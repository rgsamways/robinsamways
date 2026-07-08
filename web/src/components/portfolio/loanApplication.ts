export type LoanApplication = {
  id: string;
  applicant_name: string | null;
  account_name: string | null;
  amount_requested: number | null;
  status: string | null;
  submitted_date: string | null;
  decision_date: string | null;
};

export type SortDirection = "asc" | "desc";

// Archived is a real Status value (the original seed records), but it's
// deliberately reachable only by editing Salesforce directly — never offered
// as a settable option in any create/update control.
export const SETTABLE_STATUSES = ["Draft", "Submitted", "Under Review", "Approved", "Denied"];
export const STATUS_FILTER_OPTIONS = ["All", ...SETTABLE_STATUSES, "Archived"];

export function compareLoanApplications<F extends keyof LoanApplication>(
  a: LoanApplication,
  b: LoanApplication,
  field: F,
  direction: SortDirection
): number {
  const aVal = a[field];
  const bVal = b[field];
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1;
  if (bVal == null) return -1;
  const cmp =
    typeof aVal === "number" && typeof bVal === "number"
      ? aVal - bVal
      : String(aVal).localeCompare(String(bVal));
  return direction === "asc" ? cmp : -cmp;
}
