from datetime import datetime, timedelta, timezone

from app.billing.refund import compute_cancellation_refund_cents


def test_period_one_is_never_automatically_refunded():
    assert (
        compute_cancellation_refund_cents(
            period_number=1,
            period_charged_cents=1200,
            period_start=datetime(2026, 1, 1, tzinfo=timezone.utc),
            cancel_date=datetime(2026, 2, 15, tzinfo=timezone.utc),
        )
        == 0
    )


def test_period_two_mid_period_refunds_the_unused_days_fraction():
    period_start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    cancel_date = period_start + timedelta(days=91)  # 274 days remaining of 365

    refund_cents = compute_cancellation_refund_cents(
        period_number=2,
        period_charged_cents=1200,
        period_start=period_start,
        cancel_date=cancel_date,
    )

    assert refund_cents == round(1200 * (274 / 365))


def test_refund_basis_is_the_amount_actually_charged_not_the_list_price():
    # A renewal that charged more than the $12 nominal price (e.g. tax
    # included) — the refund must scale off period_charged_cents, per D5.
    period_start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    cancel_date = period_start + timedelta(days=100)

    refund_cents = compute_cancellation_refund_cents(
        period_number=3,
        period_charged_cents=1356,  # e.g. $12 + 13% HST
        period_start=period_start,
        cancel_date=cancel_date,
    )

    assert refund_cents == round(1356 * (265 / 365))


def test_cancelling_after_the_period_already_ended_refunds_nothing():
    period_start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    cancel_date = period_start + timedelta(days=400)  # past the 365-day period

    refund_cents = compute_cancellation_refund_cents(
        period_number=2,
        period_charged_cents=1200,
        period_start=period_start,
        cancel_date=cancel_date,
    )

    assert refund_cents == 0
