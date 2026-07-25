import logging
import os

import stripe

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

TROUBLESHOOTING_PRICE_ID = os.environ.get("STRIPE_TROUBLESHOOTING_PRICE_ID", "")
TROUBLESHOOTING_PRICE_CENTS = 1200
BILLING_CURRENCY = "cad"

CHECKOUT_SUCCESS_URL = os.environ.get(
    "STRIPE_CHECKOUT_SUCCESS_URL", "https://robinsamways.ca/services?checkout=success"
)
CHECKOUT_CANCEL_URL = os.environ.get(
    "STRIPE_CHECKOUT_CANCEL_URL", "https://robinsamways.ca/services?checkout=canceled"
)
PORTAL_RETURN_URL = os.environ.get("STRIPE_PORTAL_RETURN_URL", "https://robinsamways.ca/sign-in")


class StripeGatewayError(Exception):
    """Raised when a Stripe API call fails."""


class StripeGateway:
    """Every raw Stripe SDK call for this codebase lives behind this one
    class (D4 in services-payments/design.md) — `SubscriptionService` and
    `FulfillmentFeeService` depend on this, never on the `stripe` package
    directly, so upgrading API versions or swapping test/live keys touches
    one class, not every call site."""

    def __init__(self) -> None:
        stripe.api_key = STRIPE_SECRET_KEY

    def find_or_create_customer(self, email: str, existing_customer_id: str | None) -> str:
        if existing_customer_id:
            return existing_customer_id
        try:
            customer = stripe.Customer.create(email=email)
        except stripe.StripeError as exc:
            logging.error("Stripe customer create failed: %s", exc)
            raise StripeGatewayError("Stripe customer create failed") from exc
        return customer.id

    def create_checkout_session(self, customer_id: str, account_id: int) -> str:
        try:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                mode="subscription",
                line_items=[{"price": TROUBLESHOOTING_PRICE_ID, "quantity": 1}],
                success_url=CHECKOUT_SUCCESS_URL,
                cancel_url=CHECKOUT_CANCEL_URL,
                client_reference_id=str(account_id),
                metadata={"account_id": str(account_id)},
            )
        except stripe.StripeError as exc:
            logging.error("Stripe checkout session create failed: %s", exc)
            raise StripeGatewayError("Stripe checkout session create failed") from exc
        return session.url

    def create_portal_session(self, customer_id: str) -> str:
        try:
            portal_session = stripe.billing_portal.Session.create(
                customer=customer_id, return_url=PORTAL_RETURN_URL
            )
        except stripe.StripeError as exc:
            logging.error("Stripe portal session create failed: %s", exc)
            raise StripeGatewayError("Stripe portal session create failed") from exc
        return portal_session.url

    def cancel_at_period_end(self, subscription_id: str) -> None:
        try:
            stripe.Subscription.modify(subscription_id, cancel_at_period_end=True)
        except stripe.StripeError as exc:
            logging.error("Stripe cancel-at-period-end failed: %s", exc)
            raise StripeGatewayError("Stripe cancel-at-period-end failed") from exc

    def cancel_immediately(self, subscription_id: str) -> None:
        try:
            stripe.Subscription.cancel(subscription_id)
        except stripe.StripeError as exc:
            logging.error("Stripe immediate cancel failed: %s", exc)
            raise StripeGatewayError("Stripe immediate cancel failed") from exc

    def refund(self, charge_id: str, amount_cents: int) -> None:
        try:
            stripe.Refund.create(charge=charge_id, amount=amount_cents)
        except stripe.StripeError as exc:
            logging.error("Stripe refund failed: %s", exc)
            raise StripeGatewayError("Stripe refund failed") from exc

    def get_latest_charge_id_for_subscription(self, subscription_id: str) -> str | None:
        """The refund basis is "the current period's charge" (D5 step 4) —
        Subscription itself doesn't carry a charge id, so this looks up the
        most recent invoice for it and reads its `charge` field."""
        try:
            invoices = stripe.Invoice.list(subscription=subscription_id, limit=1)
        except stripe.StripeError as exc:
            logging.error("Stripe invoice list failed: %s", exc)
            raise StripeGatewayError("Stripe invoice list failed") from exc
        if not invoices.data:
            return None
        return invoices.data[0].get("charge")

    def get_charge(self, charge_id: str) -> stripe.Charge:
        try:
            return stripe.Charge.retrieve(charge_id)
        except stripe.StripeError as exc:
            logging.error("Stripe charge retrieve failed: %s", exc)
            raise StripeGatewayError("Stripe charge retrieve failed") from exc

    def get_invoice(self, invoice_id: str) -> stripe.Invoice:
        try:
            return stripe.Invoice.retrieve(invoice_id)
        except stripe.StripeError as exc:
            logging.error("Stripe invoice retrieve failed: %s", exc)
            raise StripeGatewayError("Stripe invoice retrieve failed") from exc

    def create_fulfillment_invoice(self, customer_id: str, amount_cents: int, description: str) -> str:
        """No Checkout flow for this (D7) — an operator (Robin) triggers it
        once a quote is agreed and work is delivered; Stripe emails the
        client a real invoice to pay."""
        try:
            stripe.InvoiceItem.create(
                customer=customer_id,
                amount=amount_cents,
                currency=BILLING_CURRENCY,
                description=description,
            )
            invoice = stripe.Invoice.create(
                customer=customer_id,
                collection_method="send_invoice",
                days_until_due=14,
                auto_advance=True,
            )
            invoice.finalize_invoice()
            invoice.send_invoice()
        except stripe.StripeError as exc:
            logging.error("Stripe fulfillment invoice create failed: %s", exc)
            raise StripeGatewayError("Stripe fulfillment invoice create failed") from exc
        return invoice.id

    def construct_event(self, payload: bytes, signature: str) -> stripe.Event:
        try:
            return stripe.Webhook.construct_event(payload, signature, STRIPE_WEBHOOK_SECRET)
        except (stripe.SignatureVerificationError, ValueError) as exc:
            logging.error("Stripe webhook signature verification failed: %s", exc)
            raise StripeGatewayError("Stripe webhook signature verification failed") from exc
