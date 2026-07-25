import hmac
import logging
import os

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlmodel import select

from app.accounts.service import AccountService
from app.accounts.session import get_current_account_id
from app.billing.fulfillment_service import FulfillmentFeeService
from app.billing.gateway import StripeGatewayError
from app.billing.subscription_service import SubscriptionService
from app.db import async_session
from app.models import Subscription
from app.rate_limit import RateLimiter, _client_ip

router = APIRouter()

_checkout_rate_limiter = RateLimiter(window_seconds=60.0, max_requests=5)

FULFILLMENT_FEE_SUBJECT_TYPES = (
    "web_sites",
    "web_applications",
    "native_applications",
    "platform",
    "hourly",
    "field_documentation",
)


def _require_admin(request: Request) -> None:
    """No admin auth system — a shared-secret header is deliberately enough
    for the one operator action this guards (task 5.2): Robin invoicing a
    `FulfillmentFee` once a quote is agreed and work is delivered."""
    admin_key = os.environ.get("ADMIN_API_KEY")
    provided_key = request.headers.get("x-admin-api-key", "")
    if not admin_key or not hmac.compare_digest(provided_key, admin_key):
        raise HTTPException(status_code=401, detail="Not authorized")


class CheckoutSessionRequest(BaseModel):
    email: str


class CheckoutSessionResponse(BaseModel):
    checkout_url: str


class PortalSessionResponse(BaseModel):
    portal_url: str


class WebhookResponse(BaseModel):
    status: str


class FulfillmentFeeRequest(BaseModel):
    email: str
    subject_type: str
    subject_description: str
    fee_cents: int


class FulfillmentFeeResponse(BaseModel):
    id: int
    stripe_invoice_id: str | None = None


@router.post(
    "/billing/checkout-session", response_model=CheckoutSessionResponse, status_code=201
)
async def create_checkout_session(
    payload: CheckoutSessionRequest, request: Request
) -> CheckoutSessionResponse:
    ip = _client_ip(request)
    if _checkout_rate_limiter.is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests")

    email = payload.email.strip().lower()
    if not email:
        raise HTTPException(status_code=422, detail="Invalid email")

    async with async_session() as session:
        try:
            checkout_url = await SubscriptionService(session).start_checkout(email)
        except StripeGatewayError:
            raise HTTPException(status_code=502, detail="Unable to reach Stripe right now")

    return CheckoutSessionResponse(checkout_url=checkout_url)


@router.post("/billing/portal-session", response_model=PortalSessionResponse)
async def create_portal_session(
    account_id: int = Depends(get_current_account_id),
) -> PortalSessionResponse:
    async with async_session() as session:
        result = await session.exec(
            select(Subscription).where(Subscription.account_id == account_id)
        )
        subscription = result.first()

        if subscription is None or not subscription.stripe_customer_id:
            raise HTTPException(status_code=404, detail="No subscription found for this account")

        service = SubscriptionService(session)
        try:
            portal_url = service.gateway.create_portal_session(subscription.stripe_customer_id)
        except StripeGatewayError:
            raise HTTPException(status_code=502, detail="Unable to reach Stripe right now")

    return PortalSessionResponse(portal_url=portal_url)


@router.post("/billing/cancel-subscription", response_model=WebhookResponse)
async def cancel_subscription(
    account_id: int = Depends(get_current_account_id),
) -> WebhookResponse:
    async with async_session() as session:
        result = await session.exec(
            select(Subscription).where(
                Subscription.account_id == account_id, Subscription.status == "active"
            )
        )
        subscription = result.first()
        if subscription is None:
            raise HTTPException(status_code=404, detail="No active subscription found")

        try:
            await SubscriptionService(session).cancel(subscription)
        except StripeGatewayError:
            raise HTTPException(status_code=502, detail="Unable to reach Stripe right now")

    return WebhookResponse(status="ok")


@router.post("/billing/webhook", response_model=WebhookResponse)
async def stripe_webhook(request: Request) -> WebhookResponse:
    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")

    async with async_session() as session:
        service = SubscriptionService(session)
        try:
            event = service.gateway.construct_event(payload, signature)
        except StripeGatewayError:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

        data_object = event["data"]["object"]

        if event["type"] == "checkout.session.completed":
            await service.handle_checkout_completed(data_object)
        elif event["type"] == "invoice.paid":
            await service.handle_invoice_paid(data_object)
        elif event["type"] == "charge.dispute.created":
            await service.handle_dispute_created(data_object)
        else:
            logging.info("Unhandled Stripe webhook event type: %s", event["type"])

    return WebhookResponse(status="ok")


@router.post(
    "/billing/fulfillment-fee", response_model=FulfillmentFeeResponse, status_code=201
)
async def create_fulfillment_fee(
    payload: FulfillmentFeeRequest, request: Request
) -> FulfillmentFeeResponse:
    """Operator-triggered, per D7 — no public Checkout flow. Robin calls
    this (e.g. via curl) once a quote is agreed and the work behind one of
    the non-subscription `/services` categories is delivered."""
    _require_admin(request)

    subject_type = payload.subject_type.strip().lower()
    subject_description = payload.subject_description.strip()
    email = payload.email.strip().lower()

    if (
        subject_type not in FULFILLMENT_FEE_SUBJECT_TYPES
        or not subject_description
        or not email
        or payload.fee_cents <= 0
    ):
        raise HTTPException(status_code=422, detail="Invalid submission")

    async with async_session() as session:
        account = await AccountService(session).get_or_create_account(email)

        result = await session.exec(
            select(Subscription).where(Subscription.account_id == account.id)
        )
        existing_subscription = result.first()
        existing_customer_id = (
            existing_subscription.stripe_customer_id if existing_subscription else None
        )

        try:
            fee = await FulfillmentFeeService(session).record_and_invoice(
                account_id=account.id,
                customer_email=account.email,
                existing_customer_id=existing_customer_id,
                subject_type=subject_type,
                subject_description=subject_description,
                fee_cents=payload.fee_cents,
            )
        except StripeGatewayError:
            raise HTTPException(status_code=502, detail="Unable to reach Stripe right now")

    return FulfillmentFeeResponse(id=fee.id, stripe_invoice_id=fee.stripe_invoice_id)
