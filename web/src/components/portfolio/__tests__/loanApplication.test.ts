import { describe, expect, test } from "vitest";
import { compareLoanApplications, type LoanApplication } from "../loanApplication";

function makeApplication(overrides: Partial<LoanApplication>): LoanApplication {
  return {
    id: "1",
    applicant_name: null,
    account_name: null,
    amount_requested: null,
    status: null,
    submitted_date: null,
    decision_date: null,
    ...overrides,
  };
}

describe("compareLoanApplications", () => {
  test("sorts numeric fields ascending", () => {
    const a = makeApplication({ amount_requested: 100 });
    const b = makeApplication({ amount_requested: 200 });
    expect(compareLoanApplications(a, b, "amount_requested", "asc")).toBeLessThan(0);
    expect(compareLoanApplications(b, a, "amount_requested", "asc")).toBeGreaterThan(0);
  });

  test("sorts numeric fields descending by negating the ascending comparison", () => {
    const a = makeApplication({ amount_requested: 100 });
    const b = makeApplication({ amount_requested: 200 });
    expect(compareLoanApplications(a, b, "amount_requested", "desc")).toBeGreaterThan(0);
  });

  test("sorts string fields via localeCompare", () => {
    const a = makeApplication({ applicant_name: "Alice" });
    const b = makeApplication({ applicant_name: "Bob" });
    expect(compareLoanApplications(a, b, "applicant_name", "asc")).toBeLessThan(0);
  });

  test("treats equal values as equal regardless of direction", () => {
    const a = makeApplication({ status: "Approved" });
    const b = makeApplication({ status: "Approved" });
    expect(compareLoanApplications(a, b, "status", "asc") === 0).toBe(true);
    expect(compareLoanApplications(a, b, "status", "desc") === 0).toBe(true);
  });

  test("sorts null values to the end regardless of direction", () => {
    const withValue = makeApplication({ decision_date: "2026-01-01" });
    const withNull = makeApplication({ decision_date: null });
    expect(compareLoanApplications(withValue, withNull, "decision_date", "asc")).toBe(-1);
    expect(compareLoanApplications(withNull, withValue, "decision_date", "asc")).toBe(1);
    expect(compareLoanApplications(withValue, withNull, "decision_date", "desc")).toBe(-1);
    expect(compareLoanApplications(withNull, withValue, "decision_date", "desc")).toBe(1);
  });

  test("treats two nulls as equal", () => {
    const a = makeApplication({ submitted_date: null });
    const b = makeApplication({ submitted_date: null });
    expect(compareLoanApplications(a, b, "submitted_date", "asc")).toBe(0);
  });
});
