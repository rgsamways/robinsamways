import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.accounts.service import AccountService
from app.billing.gateway import TROUBLESHOOTING_PRICE_CENTS, StripeGateway
from app.billing.refund import compute_cancellation_refund_cents
from app.models import Subscription


def _extract_invoice_period(invoice_obj: dict) -> tuple[datetime, datetime]:
    lines = (invoice_obj.get("lines") or {}).get("data") or []
    period = lines[0].get("period") if lines else None
    if period and period.get("start") and period.get("end"):
        return (
            datetime.fromtimestamp(period["start"], tz=timezone.utc),
            datetime.fromtimestamp(period["end"], tz=timezone.utc),
        )
    now = datetime.now(timezone.utc)
    return now, now + timedelta(days=365)


class SubscriptionService:
    """The Troubleshooting & Questions $12/year plan — Checkout, webhooks,
    and cancellation. See D5/D6 in services-payments/design.md."""

    def __init__(self, session: AsyncSession, gateway: StripeGateway | None = None):
        self.session = session
        self.gateway = gateway or StripeGateway()

    async def _get_subscription_by_account(self, account_id: int) -> Subscription | None:
        result = await self.session.exec(
            select(Subscription).where(Subscription.account_id == account_id)
        )
        return result.first()

    async def _get_subscription_by_stripe_id(self, stripe_subscription_id: str) -> Subscription | None:
        result = await self.session.exec(
            select(Subscription).where(Subscription.stripe_subscription_id == stripe_subscription_id)
        )
        return result.first()

    async def start_checkout(self, email: str) -> str:
        """Creates the `account-auth` account first if one doesn't already
        exist (task 3.2) — a visitor can subscribe before ever explicitly
        signing in."""
        account = await AccountService(self.session).get_or_create_account(email)
        existing = await self._get_subscription_by_account(account.id)
        existing_customer_id = existing.stripe_customer_id if existing else None

        customer_id = self.gateway.find_or_create_customer(email, existing_customer_id)
        return self.gateway.create_checkout_session(customer_id, account.id)

    async def handle_checkout_completed(self, session_obj: dict) -> None:
        metadata = session_obj.get("metadata") or {}
        account_id = metadata.get("account_id")
        subscription_id = session_obj.get("subscription")
        customer_id = session_obj.get("customer")
        amount_total = session_obj.get("amount_total")

        if not account_id or not subscription_id or not customer_id or amount_total is None:
            logging.error("checkout.session.completed missing required fields: %s", session_obj)
            return

        if await self._get_subscription_by_stripe_id(subscription_id) is not None:
            return  # already recorded — webhook redelivery

        now = datetime.now(timezone.utc)
        self.session.add(
            Subscription(
                account_id=int(account_id),
                stripe_customer_id=customer_id,
                stripe_subscription_id=subscription_id,
                interval="annual",
                price_cents=TROUBLESHOOTING_PRICE_CENTS,
                status="active",
                period_number=1,
                current_period_start=now,
                current_period_end=now + timedelta(days=365),
                period_charged_cents=amount_total,
            )
        )
        await self.session.commit()

    async def handle_invoice_paid(self, invoice_obj: dict) -> None:
        # The first invoice of a new subscription (billing_reason ==
        # "subscription_create") is already recorded as period 1 by
        # handle_checkout_completed — only a real renewal cycle increments
        # period_number, or period 1 would double-count on its own creation.
        if invoice_obj.get("billing_reason") == "subscription_create":
            return

        subscription_id = invoice_obj.get("subscription")
        if not subscription_id:
            return

        subscription = await self._get_subscription_by_stripe_id(subscription_id)
        if subscription is None:
            logging.error("invoice.paid for unknown subscription: %s", subscription_id)
            return

        period_start, period_end = _extract_invoice_period(invoice_obj)
        subscription.period_number += 1
        subscription.period_charged_cents = invoice_obj.get("amount_paid", subscription.period_charged_cents)
        subscription.current_period_start = period_start
        subscription.current_period_end = period_end
        subscription.status = "active"
        self.session.add(subscription)
        await self.session.commit()

    async def handle_dispute_created(self, dispute_obj: dict) -> None:
        charge_id = dispute_obj.get("charge")
        if not charge_id:
            return

        charge = self.gateway.get_charge(charge_id)
        customer_id = charge.get("customer") if isinstance(charge, dict) else getattr(charge, "customer", None)
        if not customer_id:
            return

        result = await self.session.exec(
            select(Subscription).where(
                Subscription.stripe_customer_id == customer_id, Subscription.status == "active"
            )
        )
        subscription = result.first()
        if subscription is None:
            return

        subscription.status = "inactive"
        self.session.add(subscription)
        await self.session.commit()

    async def cancel(self, subscription: Subscription) -> int:
        """Returns the refund amount issued, in cents (always 0 in period 1)."""
        now = datetime.now(timezone.utc)

        if subscription.period_number <= 1:
            self.gateway.cancel_at_period_end(subscription.stripe_subscription_id)
            subscription.canceled_at = now
            self.session.add(subscription)
            await self.session.commit()
            return 0

        refund_cents = compute_cancellation_refund_cents(
            period_number=subscription.period_number,
            period_charged_cents=subscription.period_charged_cents,
            period_start=subscription.current_period_start,
            cancel_date=now,
        )

        self.gateway.cancel_immediately(subscription.stripe_subscription_id)

        if refund_cents > 0:
            charge_id = self.gateway.get_latest_charge_id_for_subscription(
                subscription.stripe_subscription_id
            )
            if charge_id:
                self.gateway.refund(charge_id, refund_cents)
            else:
                logging.error(
                    "No charge id found for subscription %s; refund of %d cents not issued automatically",
                    subscription.stripe_subscription_id,
                    refund_cents,
                )

        subscription.status = "canceled"
        subscription.canceled_at = now
        self.session.add(subscription)
        await self.session.commit()
        return refund_cents
