from datetime import datetime, timedelta, timezone

import pytest
from sqlmodel import select

from app.billing.subscription_service import SubscriptionService
from app.db import async_session
from app.models import Account, Subscription, _as_utc

# Mocked Stripe SDK — no real network calls, per task 7.4. `_FakeGateway`
# stands in for `StripeGateway`, recording every call so orchestration
# (which gateway method fires, with what arguments) is assertable too, not
# just the resulting database row.
pytestmark = pytest.mark.usefixtures("db_client")


class _FakeGateway:
    def __init__(self, charge_customer_id=None, latest_charge_id=None):
        self.charge_customer_id = charge_customer_id
        self.latest_charge_id = latest_charge_id
        self.calls: list[tuple] = []

    def get_charge(self, charge_id):
        self.calls.append(("get_charge", charge_id))
        return {"id": charge_id, "customer": self.charge_customer_id}

    def cancel_at_period_end(self, subscription_id):
        self.calls.append(("cancel_at_period_end", subscription_id))

    def cancel_immediately(self, subscription_id):
        self.calls.append(("cancel_immediately", subscription_id))

    def refund(self, charge_id, amount_cents):
        self.calls.append(("refund", charge_id, amount_cents))

    def get_latest_charge_id_for_subscription(self, subscription_id):
        self.calls.append(("get_latest_charge_id_for_subscription", subscription_id))
        return self.latest_charge_id


async def _make_account(session, email: str) -> Account:
    account = Account(email=email)
    session.add(account)
    await session.commit()
    await session.refresh(account)
    return account


async def test_checkout_session_completed_creates_period_one_subscription():
    async with async_session() as session:
        account = await _make_account(session, "checkout1@example.com")
        service = SubscriptionService(session, gateway=_FakeGateway())

        await service.handle_checkout_completed(
            {
                "customer": "cus_checkout1",
                "subscription": "sub_checkout1",
                "amount_total": 1200,
                "metadata": {"account_id": str(account.id)},
            }
        )

        subscription = (
            await session.exec(
                select(Subscription).where(Subscription.stripe_subscription_id == "sub_checkout1")
            )
        ).first()
        assert subscription is not None
        assert subscription.account_id == account.id
        assert subscription.period_number == 1
        assert subscription.period_charged_cents == 1200
        assert subscription.status == "active"


async def test_checkout_session_completed_is_idempotent_on_webhook_redelivery():
    async with async_session() as session:
        account = await _make_account(session, "checkout2@example.com")
        service = SubscriptionService(session, gateway=_FakeGateway())
        event = {
            "customer": "cus_checkout2",
            "subscription": "sub_checkout2",
            "amount_total": 1200,
            "metadata": {"account_id": str(account.id)},
        }

        await service.handle_checkout_completed(event)
        await service.handle_checkout_completed(event)  # Stripe redelivered the same event

        rows = (
            await session.exec(
                select(Subscription).where(Subscription.stripe_subscription_id == "sub_checkout2")
            )
        ).all()
        assert len(rows) == 1


async def test_invoice_paid_does_not_double_count_the_first_periods_own_invoice():
    async with async_session() as session:
        account = await _make_account(session, "renew1@example.com")
        service = SubscriptionService(session, gateway=_FakeGateway())
        await service.handle_checkout_completed(
            {
                "customer": "cus_renew1",
                "subscription": "sub_renew1",
                "amount_total": 1200,
                "metadata": {"account_id": str(account.id)},
            }
        )

        # Stripe also fires invoice.paid for the very first invoice, with
        # billing_reason "subscription_create" — already recorded as period
        # 1 above, so this must be a no-op, not a second increment.
        await service.handle_invoice_paid(
            {"subscription": "sub_renew1", "billing_reason": "subscription_create", "amount_paid": 1200}
        )

        subscription = (
            await session.exec(
                select(Subscription).where(Subscription.stripe_subscription_id == "sub_renew1")
            )
        ).first()
        assert subscription.period_number == 1


async def test_invoice_paid_increments_period_on_a_real_renewal():
    async with async_session() as session:
        account = await _make_account(session, "renew2@example.com")
        service = SubscriptionService(session, gateway=_FakeGateway())
        await service.handle_checkout_completed(
            {
                "customer": "cus_renew2",
                "subscription": "sub_renew2",
                "amount_total": 1200,
                "metadata": {"account_id": str(account.id)},
            }
        )

        period_start = datetime(2027, 1, 1, tzinfo=timezone.utc)
        period_end = datetime(2028, 1, 1, tzinfo=timezone.utc)
        await service.handle_invoice_paid(
            {
                "subscription": "sub_renew2",
                "billing_reason": "subscription_cycle",
                "amount_paid": 1260,  # a real renewal charge, tax included — not the $1200 list price
                "lines": {
                    "data": [
                        {"period": {"start": int(period_start.timestamp()), "end": int(period_end.timestamp())}}
                    ]
                },
            }
        )

        subscription = (
            await session.exec(
                select(Subscription).where(Subscription.stripe_subscription_id == "sub_renew2")
            )
        ).first()
        assert subscription.period_number == 2
        assert subscription.period_charged_cents == 1260
        # SQLite (this suite's test backend) round-trips `DateTime(timezone=True)`
        # as naive — normalize before comparing; real Postgres wouldn't need this.
        assert _as_utc(subscription.current_period_start) == period_start
        assert _as_utc(subscription.current_period_end) == period_end


async def test_dispute_created_marks_the_matching_subscription_inactive():
    async with async_session() as session:
        account = await _make_account(session, "dispute1@example.com")
        gateway = _FakeGateway(charge_customer_id="cus_dispute1")
        service = SubscriptionService(session, gateway=gateway)
        await service.handle_checkout_completed(
            {
                "customer": "cus_dispute1",
                "subscription": "sub_dispute1",
                "amount_total": 1200,
                "metadata": {"account_id": str(account.id)},
            }
        )

        await service.handle_dispute_created({"charge": "ch_dispute1"})

        subscription = (
            await session.exec(
                select(Subscription).where(Subscription.stripe_subscription_id == "sub_dispute1")
            )
        ).first()
        assert subscription.status == "inactive"


async def test_cancel_in_period_one_defers_to_period_end_with_no_refund():
    async with async_session() as session:
        account = await _make_account(session, "cancel1@example.com")
        gateway = _FakeGateway()
        service = SubscriptionService(session, gateway=gateway)
        await service.handle_checkout_completed(
            {
                "customer": "cus_cancel1",
                "subscription": "sub_cancel1",
                "amount_total": 1200,
                "metadata": {"account_id": str(account.id)},
            }
        )
        subscription = (
            await session.exec(
                select(Subscription).where(Subscription.stripe_subscription_id == "sub_cancel1")
            )
        ).first()

        refund_cents = await service.cancel(subscription)

        assert refund_cents == 0
        assert ("cancel_at_period_end", "sub_cancel1") in gateway.calls
        assert not any(call[0] == "refund" for call in gateway.calls)
        assert subscription.canceled_at is not None
        assert subscription.status == "active"  # access continues through the paid period


async def test_cancel_in_period_two_mid_period_issues_a_proportional_refund():
    async with async_session() as session:
        account = await _make_account(session, "cancel2@example.com")
        gateway = _FakeGateway(latest_charge_id="ch_cancel2")
        service = SubscriptionService(session, gateway=gateway)

        now = datetime.now(timezone.utc)
        subscription = Subscription(
            account_id=account.id,
            stripe_customer_id="cus_cancel2",
            stripe_subscription_id="sub_cancel2",
            price_cents=1200,
            period_number=2,
            current_period_start=now - timedelta(days=100),
            current_period_end=now + timedelta(days=265),
            period_charged_cents=1200,
        )
        session.add(subscription)
        await session.commit()
        await session.refresh(subscription)

        refund_cents = await service.cancel(subscription)

        assert refund_cents > 0
        assert ("cancel_immediately", "sub_cancel2") in gateway.calls
        assert any(call == ("refund", "ch_cancel2", refund_cents) for call in gateway.calls)
        assert subscription.status == "canceled"
