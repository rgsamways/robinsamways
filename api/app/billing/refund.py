"""Pure refund math — no Stripe SDK, no database, so it's unit-testable in
isolation (task 7.3). Ported from `computeCancellationRefundCents` in
docs/core-billing-model.md / D5 in services-payments/design.md.

Stripe has no native feature for "refund unused days on a flat annual
subscription" — this function is the one piece of arithmetic the whole
two-tier cancellation policy hinges on.
"""

from datetime import datetime

from app.models import _as_utc


def compute_cancellation_refund_cents(
    period_number: int,
    period_charged_cents: int,
    period_start: datetime,
    cancel_date: datetime,
    days_in_period: int = 365,
) -> int:
    """Year one (period 1) is never automatically refunded — any "life
    changing moment" exception in month one is Robin's own manual, discretionary
    Stripe refund, not a code path. From period 2 onward, a mid-period
    cancellation refunds the unused-days fraction of what was actually
    charged for the current period (tax included), not the nominal list
    price."""
    if period_number <= 1:
        return 0

    days_used = (_as_utc(cancel_date) - _as_utc(period_start)).days
    days_remaining = max(days_in_period - days_used, 0)
    return round(period_charged_cents * (days_remaining / days_in_period))
