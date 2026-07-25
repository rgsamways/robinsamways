from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel


def _utc_now_column() -> Column:
    return Column(DateTime(timezone=True), nullable=False)


def _as_utc(value: datetime) -> datetime:
    """SQLite (used by this suite's own tests, and any local dev without a
    real Postgres) doesn't have a native timestamptz type — a
    `DateTime(timezone=True)` column round-trips as a naive datetime there,
    unlike production's real Postgres/asyncpg. Every timestamp this app
    writes is already UTC (`_utc_now_column`/`datetime.now(timezone.utc)`),
    so a naive value read back is safely assumed to already be UTC."""
    return value if value.tzinfo is not None else value.replace(tzinfo=timezone.utc)


class Ping(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=_utc_now_column(),
    )


class ContactSubmission(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    message: str
    ip_address: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=_utc_now_column(),
    )


class FeedbackSubmission(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    page: str
    sentiment: str | None = None
    comment: str | None = None
    ip_address: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=_utc_now_column(),
    )


class Account(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=_utc_now_column(),
    )


class SignInToken(SQLModel, table=True):
    token: str = Field(primary_key=True)
    account_id: int = Field(foreign_key="account.id")
    expires_at: datetime = Field(sa_column=_utc_now_column())
    used_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True)))
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=_utc_now_column(),
    )


class BillingRecord(SQLModel):
    """Non-table mixin shared by every billing pattern — see D3 in
    services-payments/design.md. `Subscription`/`FulfillmentFee` inherit
    from this and add `table=True`; a future billing pattern is a new
    subclass, not a copy-pasted table."""

    id: int | None = Field(default=None, primary_key=True)
    account_id: int = Field(foreign_key="account.id")
    stripe_customer_id: str | None = None
    # A mixin field can't reuse a pre-built `_utc_now_column()` Column
    # instance the way every other table here does — SQLAlchemy would try to
    # attach that same object to both Subscription's and FulfillmentFee's
    # tables. `sa_type`/`sa_column_kwargs` let SQLModel build a fresh Column
    # per subclass instead.
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"nullable": False},
    )


class Subscription(BillingRecord, table=True):
    interval: str = "annual"
    price_cents: int
    status: str = "active"
    period_number: int = 1
    current_period_start: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))
    current_period_end: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))
    period_charged_cents: int
    canceled_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True)))
    stripe_subscription_id: str | None = None


class FulfillmentFee(BillingRecord, table=True):
    subject_type: str
    subject_description: str
    fee_cents: int
    stripe_invoice_id: str | None = None
    paid_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True)))
    collected: bool = False
