"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  compareLoanApplications,
  SETTABLE_STATUSES,
  STATUS_FILTER_OPTIONS,
  type LoanApplication,
  type SortDirection,
} from "./loanApplication";

type ListStatus = "loading" | "loaded" | "error";
type CreateStatus = "idle" | "submitting" | "success" | "error";
type Errors = { applicantName?: string; accountName?: string; amountRequested?: string };
type RowActionState = {
  statusSaving?: boolean;
  statusError?: boolean;
  deleting?: boolean;
  deleteError?: boolean;
};
type SortField =
  | "applicant_name"
  | "account_name"
  | "amount_requested"
  | "status"
  | "submitted_date"
  | "decision_date";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const COLUMNS: { field: SortField; label: string }[] = [
  { field: "applicant_name", label: "Applicant" },
  { field: "account_name", label: "Account" },
  { field: "amount_requested", label: "Amount" },
  { field: "status", label: "Status" },
  { field: "submitted_date", label: "Submitted" },
  { field: "decision_date", label: "Decision" },
];

export default function LoanDemoWidget({ onMutate }: { onMutate?: () => void }) {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [listStatus, setListStatus] = useState<ListStatus>("loading");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [rowActions, setRowActions] = useState<Record<string, RowActionState>>({});

  const [applicantName, setApplicantName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amountRequested, setAmountRequested] = useState("");
  const [status, setStatus] = useState("Draft");
  const [honeypot, setHoneypot] = useState("");
  const [renderedAt] = useState(() => Date.now() / 1000);
  const [errors, setErrors] = useState<Errors>({});
  const [createStatus, setCreateStatus] = useState<CreateStatus>("idle");

  const loadApplications = async () => {
    setListStatus("loading");
    try {
      const response = await fetch(`${API_URL}/salesforce/loan-applications`);
      if (!response.ok) throw new Error("request failed");
      const data: LoanApplication[] = await response.json();
      setApplications(data);
      setListStatus("loaded");
    } catch {
      setListStatus("error");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const applicantOptions = Array.from(
    new Set(
      applications.map((app) => app.applicant_name).filter((name): name is string => Boolean(name))
    )
  );
  const accountOptions = Array.from(
    new Set(applications.map((app) => app.account_name).filter((name): name is string => Boolean(name)))
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredApplications =
    statusFilter === "All" ? applications : applications.filter((app) => app.status === statusFilter);

  const sortedApplications = [...filteredApplications].sort((a, b) =>
    sortField ? compareLoanApplications(a, b, sortField, sortDirection) : 0
  );

  const validate = () => {
    const next: Errors = {};
    if (!applicantName.trim()) next.applicantName = "Applicant is required";
    if (!accountName.trim()) next.accountName = "Account is required";
    const amount = Number(amountRequested);
    if (!amountRequested.trim() || Number.isNaN(amount) || amount <= 0) {
      next.amountRequested = "Enter a valid amount";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setCreateStatus("submitting");
    try {
      const response = await fetch(`${API_URL}/salesforce/loan-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_name: applicantName.trim(),
          account_name: accountName.trim(),
          amount_requested: Number(amountRequested),
          status,
          honeypot,
          rendered_at: renderedAt,
        }),
      });
      if (!response.ok) throw new Error("request failed");
      setCreateStatus("success");
      setApplicantName("");
      setAccountName("");
      setAmountRequested("");
      setStatus("Draft");
      await loadApplications();
      onMutate?.();
    } catch {
      setCreateStatus("error");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setRowActions((prev) => ({ ...prev, [id]: { statusSaving: true } }));
    try {
      const response = await fetch(`${API_URL}/salesforce/loan-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("request failed");
      await loadApplications();
      setRowActions((prev) => ({ ...prev, [id]: {} }));
      onMutate?.();
    } catch {
      setRowActions((prev) => ({ ...prev, [id]: { statusError: true } }));
    }
  };

  const handleDelete = async (id: string) => {
    setRowActions((prev) => ({ ...prev, [id]: { deleting: true } }));
    try {
      const response = await fetch(`${API_URL}/salesforce/loan-applications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("request failed");
      setApplications((prev) => prev.filter((app) => app.id !== id));
      setRowActions((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      onMutate?.();
    } catch {
      setRowActions((prev) => ({ ...prev, [id]: { deleteError: true } }));
    }
  };

  if (listStatus === "loading") {
    return <p className="text-muted">Loading live data from Salesforce…</p>;
  }
  if (listStatus === "error") {
    return (
      <p className="text-sm">
        Couldn&rsquo;t reach the live Salesforce data right now. Try
        refreshing, or see the architecture notes above in the meantime.
      </p>
    );
  }

  return (
    <div className="text-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <label htmlFor="status-filter" className="font-semibold text-accent">
          filter
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="border border-foreground/20 bg-transparent px-2 py-1 focus:border-accent focus:outline-none"
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                {COLUMNS.map((column) => (
                  <th key={column.field} className="py-1 pr-4 font-semibold">
                    <button
                      type="button"
                      onClick={() => handleSort(column.field)}
                      className="inline-flex items-center gap-1 hover:text-accent"
                    >
                      {column.label}
                      {sortField === column.field && (
                        <span aria-hidden>{sortDirection === "asc" ? "▲" : "▼"}</span>
                      )}
                    </button>
                  </th>
                ))}
                <th className="py-1 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10 align-top">
                <td className="py-1 pr-4">
                  <div className="absolute -left-[9999px]">
                    <label htmlFor="loan-website">Website</label>
                    <input
                      id="loan-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(event) => setHoneypot(event.target.value)}
                    />
                  </div>
                  <input
                    id="loan-applicant"
                    list="applicant-options"
                    placeholder="applicant"
                    value={applicantName}
                    onChange={(event) => setApplicantName(event.target.value)}
                    className="w-full border border-foreground/20 bg-transparent px-1 py-0.5 text-xs focus:border-accent focus:outline-none"
                  />
                  <datalist id="applicant-options">
                    {applicantOptions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                  {errors.applicantName && (
                    <p className="mt-0.5 text-[10px]">{errors.applicantName}</p>
                  )}
                </td>
                <td className="py-1 pr-4">
                  <input
                    id="loan-account"
                    list="account-options"
                    placeholder="account"
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    className="w-full border border-foreground/20 bg-transparent px-1 py-0.5 text-xs focus:border-accent focus:outline-none"
                  />
                  <datalist id="account-options">
                    {accountOptions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                  {errors.accountName && <p className="mt-0.5 text-[10px]">{errors.accountName}</p>}
                </td>
                <td className="py-1 pr-4">
                  <input
                    id="loan-amount"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="amount"
                    value={amountRequested}
                    onChange={(event) => setAmountRequested(event.target.value)}
                    className="w-full border border-foreground/20 bg-transparent px-1 py-0.5 text-xs focus:border-accent focus:outline-none"
                  />
                  {errors.amountRequested && (
                    <p className="mt-0.5 text-[10px]">{errors.amountRequested}</p>
                  )}
                </td>
                <td className="py-1 pr-4">
                  <select
                    id="loan-status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="border border-foreground/20 bg-transparent px-1 py-0.5 text-xs focus:border-accent focus:outline-none"
                  >
                    {SETTABLE_STATUSES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1 pr-4 text-muted">—</td>
                <td className="py-1 pr-4 text-muted">—</td>
                <td className="py-1">
                  <button
                    type="submit"
                    disabled={createStatus === "submitting"}
                    className="text-accent underline disabled:opacity-50"
                  >
                    {createStatus === "submitting" ? "adding…" : "+ add"}
                  </button>
                </td>
              </tr>
              {(createStatus === "success" || createStatus === "error") && (
                <tr className="border-b border-foreground/10">
                  <td colSpan={7} className="py-1 text-xs">
                    {createStatus === "success" && (
                      <span>
                        <span className="text-accent">›</span>{" "}
                        Created — it&rsquo;s in the table below.
                      </span>
                    )}
                    {createStatus === "error" && (
                      <span>
                        Something went wrong creating that record. Double-check
                        the applicant/account name matches an existing one, or
                        try again.
                      </span>
                    )}
                  </td>
                </tr>
              )}
              {sortedApplications.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-2 text-muted">
                    No loan applications yet — create the first one above.
                  </td>
                </tr>
              )}
              {sortedApplications.map((app) => {
                const isArchived = app.status === "Archived";
                const actionState = rowActions[app.id];
                return (
                  <tr key={app.id} className="border-b border-foreground/10">
                    <td className="py-1 pr-4">{app.applicant_name ?? "—"}</td>
                    <td className="py-1 pr-4">{app.account_name ?? "—"}</td>
                    <td className="py-1 pr-4">
                      {app.amount_requested != null
                        ? `$${app.amount_requested.toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="py-1 pr-4">
                      {isArchived ? (
                        <span className="text-accent">Archived</span>
                      ) : (
                        <select
                          value={app.status ?? ""}
                          disabled={actionState?.statusSaving}
                          onChange={(event) => handleStatusChange(app.id, event.target.value)}
                          className="border border-foreground/20 bg-transparent px-1 py-0.5 text-xs text-accent focus:border-accent focus:outline-none disabled:opacity-50"
                        >
                          {SETTABLE_STATUSES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      {actionState?.statusSaving && (
                        <span className="ml-1 text-muted">saving…</span>
                      )}
                      {actionState?.statusError && (
                        <p className="mt-1 text-[10px]">Update failed.</p>
                      )}
                    </td>
                    <td className="py-1 pr-4">{app.submitted_date ?? "—"}</td>
                    <td className="py-1 pr-4">{app.decision_date ?? "—"}</td>
                    <td className="py-1">
                      {!isArchived && (
                        <button
                          type="button"
                          onClick={() => handleDelete(app.id)}
                          disabled={actionState?.deleting}
                          className="text-accent underline disabled:opacity-50"
                        >
                          {actionState?.deleting ? "deleting…" : "delete"}
                        </button>
                      )}
                      {actionState?.deleteError && (
                        <p className="mt-1 text-[10px]">Delete failed.</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}
