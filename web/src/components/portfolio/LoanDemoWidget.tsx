"use client";

import { useEffect, useState, type FormEvent } from "react";

type LoanApplication = {
  id: string;
  applicant_name: string | null;
  account_name: string | null;
  amount_requested: number | null;
  status: string | null;
  submitted_date: string | null;
  decision_date: string | null;
};

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
type SortDirection = "asc" | "desc";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Archived is a real Status value (the original seed records), but it's
// deliberately reachable only by editing Salesforce directly — never offered
// as a settable option in the create form or the per-row update control.
const SETTABLE_STATUSES = ["Draft", "Submitted", "Under Review", "Approved", "Denied"];
const STATUS_FILTER_OPTIONS = ["All", ...SETTABLE_STATUSES, "Archived"];

const COLUMNS: { field: SortField; label: string }[] = [
  { field: "applicant_name", label: "Applicant" },
  { field: "account_name", label: "Account" },
  { field: "amount_requested", label: "Amount" },
  { field: "status", label: "Status" },
  { field: "submitted_date", label: "Submitted" },
  { field: "decision_date", label: "Decision" },
];

export default function LoanDemoWidget() {
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

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? cmp : -cmp;
  });

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
    } catch {
      setRowActions((prev) => ({ ...prev, [id]: { deleteError: true } }));
    }
  };

  return (
    <div className="space-y-6 text-sm">
      <div>
        {listStatus === "loading" && (
          <p className="text-muted">Loading live data from Salesforce…</p>
        )}
        {listStatus === "error" && (
          <p>
            Couldn&rsquo;t reach the live Salesforce data right now. Try
            refreshing, or see the architecture notes above in the meantime.
          </p>
        )}
        {listStatus === "loaded" && applications.length === 0 && (
          <p className="text-muted">
            No loan applications yet — be the first to create one below.
          </p>
        )}
        {listStatus === "loaded" && applications.length > 0 && (
          <>
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
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
        <p className="font-semibold text-accent">create a demo application</p>

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

        <div>
          <label htmlFor="loan-applicant" className="block font-semibold text-accent">
            applicant
          </label>
          <input
            id="loan-applicant"
            list="applicant-options"
            value={applicantName}
            onChange={(event) => setApplicantName(event.target.value)}
            className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
          />
          <datalist id="applicant-options">
            {applicantOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          {errors.applicantName && <p className="mt-1 text-xs">{errors.applicantName}</p>}
        </div>

        <div>
          <label htmlFor="loan-account" className="block font-semibold text-accent">
            account
          </label>
          <input
            id="loan-account"
            list="account-options"
            value={accountName}
            onChange={(event) => setAccountName(event.target.value)}
            className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
          />
          <datalist id="account-options">
            {accountOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          {errors.accountName && <p className="mt-1 text-xs">{errors.accountName}</p>}
        </div>

        <div>
          <label htmlFor="loan-amount" className="block font-semibold text-accent">
            amount requested
          </label>
          <input
            id="loan-amount"
            type="number"
            min="0"
            step="1"
            value={amountRequested}
            onChange={(event) => setAmountRequested(event.target.value)}
            className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
          />
          {errors.amountRequested && <p className="mt-1 text-xs">{errors.amountRequested}</p>}
        </div>

        <div>
          <label htmlFor="loan-status" className="block font-semibold text-accent">
            status
          </label>
          <select
            id="loan-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
          >
            {SETTABLE_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={createStatus === "submitting"}
          className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
        >
          {createStatus === "submitting" ? "Creating…" : "Create"}
        </button>

        {createStatus === "success" && (
          <p className="text-sm">
            <span className="text-accent">›</span>{" "}
            Created — the new application is in the list above.
          </p>
        )}
        {createStatus === "error" && (
          <p className="text-xs">
            Something went wrong creating that record. Double-check the
            applicant/account name matches an existing one, or try again.
          </p>
        )}
      </form>
    </div>
  );
}
