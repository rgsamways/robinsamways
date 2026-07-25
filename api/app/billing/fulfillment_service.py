from sqlalchemy.ext.asyncio import AsyncSession

from app.billing.gateway import StripeGateway
from app.models import FulfillmentFee


class FulfillmentFeeService:
    """The other five/six `/services` categories — a one-time, postpaid
    invoice per completed engagement (D7 in services-payments/design.md).
    No public Checkout flow: an operator (Robin) triggers this once a quote
    is agreed and the work is delivered; Stripe emails the client a real
    invoice to pay."""

    def __init__(self, session: AsyncSession, gateway: StripeGateway | None = None):
        self.session = session
        self.gateway = gateway or StripeGateway()

    async def record_and_invoice(
        self,
        account_id: int,
        customer_email: str,
        existing_customer_id: str | None,
        subject_type: str,
        subject_description: str,
        fee_cents: int,
    ) -> FulfillmentFee:
        customer_id = self.gateway.find_or_create_customer(customer_email, existing_customer_id)
        invoice_id = self.gateway.create_fulfillment_invoice(
            customer_id=customer_id,
            amount_cents=fee_cents,
            description=subject_description,
        )

        fee = FulfillmentFee(
            account_id=account_id,
            stripe_customer_id=customer_id,
            subject_type=subject_type,
            subject_description=subject_description,
            fee_cents=fee_cents,
            stripe_invoice_id=invoice_id,
        )
        self.session.add(fee)
        await self.session.commit()
        await self.session.refresh(fee)
        return fee
