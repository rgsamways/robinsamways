from datetime import datetime, timedelta, timezone

import pytest
from sqlmodel import select

from app.db import async_session
from app.models import Account, FulfillmentFee, Subscription

pytestmark = pytest.mark.usefixtures("db_client")


async def test_subscription_round_trip_defaults():
    async with async_session() as session:
        account = Account(email="subscriber@example.com")
        session.add(account)
        await session.commit()
        await session.refresh(account)

        now = datetime.now(timezone.utc)
        session.add(
            Subscription(
                account_id=account.id,
                stripe_customer_id="cus_test123",
                stripe_subscription_id="sub_test123",
                price_cents=1200,
                current_period_start=now,
                current_period_end=now + timedelta(days=365),
                period_charged_cents=1200,
            )
        )
        await session.commit()

        fetched = (
            await session.exec(select(Subscription).where(Subscription.account_id == account.id))
        ).first()
        assert fetched is not None
        assert fetched.interval == "annual"
        assert fetched.status == "active"
        assert fetched.period_number == 1
        assert fetched.period_charged_cents == 1200
        assert fetched.canceled_at is None
        assert fetched.stripe_customer_id == "cus_test123"


async def test_fulfillment_fee_round_trip_defaults():
    async with async_session() as session:
        account = Account(email="client@example.com")
        session.add(account)
        await session.commit()
        await session.refresh(account)

        session.add(
            FulfillmentFee(
                account_id=account.id,
                stripe_customer_id="cus_test456",
                subject_type="hourly",
                subject_description="Bug fix engagement, 3 hours",
                fee_cents=37500,
                stripe_invoice_id="in_test456",
            )
        )
        await session.commit()

        fetched = (
            await session.exec(
                select(FulfillmentFee).where(FulfillmentFee.account_id == account.id)
            )
        ).first()
        assert fetched is not None
        assert fetched.collected is False
        assert fetched.paid_at is None
        assert fetched.fee_cents == 37500
        assert fetched.subject_type == "hourly"


async def test_billing_records_for_the_same_account_are_independent_rows():
    # Two different billing patterns for one account, per D3 — a
    # Subscription and a FulfillmentFee are separate tables/rows, not a
    # shared polymorphic record.
    async with async_session() as session:
        account = Account(email="both-patterns@example.com")
        session.add(account)
        await session.commit()
        await session.refresh(account)

        now = datetime.now(timezone.utc)
        session.add(
            Subscription(
                account_id=account.id,
                price_cents=1200,
                current_period_start=now,
                current_period_end=now + timedelta(days=365),
                period_charged_cents=1200,
            )
        )
        session.add(
            FulfillmentFee(
                account_id=account.id,
                subject_type="platform",
                subject_description="Custom platform build",
                fee_cents=500000,
            )
        )
        await session.commit()

        subscriptions = (
            await session.exec(select(Subscription).where(Subscription.account_id == account.id))
        ).all()
        fees = (
            await session.exec(select(FulfillmentFee).where(FulfillmentFee.account_id == account.id))
        ).all()
        assert len(subscriptions) == 1
        assert len(fees) == 1
