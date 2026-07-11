from datetime import date

from app.models import RecordType
from app.staleness import compute_staleness, months_since


def test_months_since_counts_whole_months_floored():
    assert months_since(date(2024, 1, 15), date(2024, 4, 15)) == 3
    # 20 days short of a full 3rd month -- floors down to 2.
    assert months_since(date(2024, 1, 15), date(2024, 4, 10)) == 2


def test_septic_stale_after_36_months():
    is_stale, months = compute_staleness(RecordType.septic, date(2020, 1, 1), as_of=date(2023, 3, 1))
    assert months == 38
    assert is_stale is True


def test_septic_not_stale_within_36_months():
    is_stale, months = compute_staleness(RecordType.septic, date(2021, 1, 1), as_of=date(2023, 6, 1))
    assert months == 29
    assert is_stale is False


def test_septic_boundary_at_exactly_36_months_is_not_yet_stale():
    # Exactly at the threshold -- past due starts the month *after* the
    # expected interval, not on the interval itself.
    is_stale, months = compute_staleness(RecordType.septic, date(2021, 1, 1), as_of=date(2024, 1, 1))
    assert months == 36
    assert is_stale is False


def test_septic_boundary_one_month_past_threshold_is_stale():
    is_stale, months = compute_staleness(RecordType.septic, date(2021, 1, 1), as_of=date(2024, 2, 1))
    assert months == 37
    assert is_stale is True


def test_well_pump_uses_a_48_month_threshold():
    is_stale, _ = compute_staleness(RecordType.well_pump, date(2020, 1, 1), as_of=date(2024, 2, 1))
    assert is_stale is True  # 49 months
    is_stale, _ = compute_staleness(RecordType.well_pump, date(2021, 1, 1), as_of=date(2024, 2, 1))
    assert is_stale is False  # 37 months


def test_electrical_panel_uses_a_60_month_threshold():
    is_stale, _ = compute_staleness(RecordType.electrical_panel, date(2018, 1, 1), as_of=date(2024, 2, 1))
    assert is_stale is True  # 73 months
    is_stale, _ = compute_staleness(RecordType.electrical_panel, date(2020, 1, 1), as_of=date(2024, 2, 1))
    assert is_stale is False  # 49 months


def test_foundation_uses_the_longest_84_month_threshold():
    is_stale, _ = compute_staleness(RecordType.foundation, date(2016, 1, 1), as_of=date(2024, 2, 1))
    assert is_stale is True  # 97 months
    is_stale, _ = compute_staleness(RecordType.foundation, date(2018, 1, 1), as_of=date(2024, 2, 1))
    assert is_stale is False  # 73 months
