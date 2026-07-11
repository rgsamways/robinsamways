from datetime import date

from app.models import RecordType

# Expected refresh interval per record type, in months. Anchored on the real
# example already established on /farpost: a septic tank's "last pumped"
# fact is flagged stale at three years (36 months) since last recorded.
# The other three types are tuned relative to that anchor by how slowly the
# underlying fact actually changes -- a foundation photo is good for years
# (per /farpost's own framing), so it gets the longest interval; well pump
# and electrical panel sit in between, mechanical/safety-relevant facts
# worth re-checking more often than a foundation but less often than a
# septic tank's routine pump-out schedule.
EXPECTED_REFRESH_MONTHS: dict[RecordType, int] = {
    RecordType.septic: 36,
    RecordType.well_pump: 48,
    RecordType.electrical_panel: 60,
    RecordType.foundation: 84,
}


def months_since(reference_date: date, as_of: date) -> int:
    """Whole months elapsed between two dates, floor-rounded (a record
    recorded 35 days ago is "1 month stale", not "0 months and change")."""
    months = (as_of.year - reference_date.year) * 12 + (as_of.month - reference_date.month)
    if as_of.day < reference_date.day:
        months -= 1
    return max(months, 0)


def compute_staleness(
    record_type: RecordType, last_recorded_date: date, as_of: date | None = None
) -> tuple[bool, int]:
    """Returns (is_stale, months_stale) for a tracked record, as of today
    (or an injected `as_of` date for testing). A fact surfaced, not a
    verdict -- matching /farpost's own stated framing exactly."""
    as_of = as_of or date.today()
    elapsed_months = months_since(last_recorded_date, as_of)
    expected = EXPECTED_REFRESH_MONTHS[record_type]
    return elapsed_months > expected, elapsed_months
