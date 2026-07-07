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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function LoanDemoWidget() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [listStatus, setListStatus] = useState<ListStatus>("loading");

  const [applicantName, setApplicantName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amountRequested, setAmountRequested] = useState("");
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
          honeypot,
          rendered_at: renderedAt,
        }),
      });
      if (!response.ok) throw new Error("request failed");
      setCreateStatus("success");
      setApplicantName("");
      setAccountName("");
      setAmountRequested("");
      await loadApplications();
    } catch {
      setCreateStatus("error");
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-foreground/20 text-left text-muted">
                  <th className="py-1 pr-4 font-semibold">Applicant</th>
                  <th className="py-1 pr-4 font-semibold">Account</th>
                  <th className="py-1 pr-4 font-semibold">Amount</th>
                  <th className="py-1 pr-4 font-semibold">Status</th>
                  <th className="py-1 pr-4 font-semibold">Submitted</th>
                  <th className="py-1 font-semibold">Decision</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-foreground/10">
                    <td className="py-1 pr-4">{app.applicant_name ?? "—"}</td>
                    <td className="py-1 pr-4">{app.account_name ?? "—"}</td>
                    <td className="py-1 pr-4">
                      {app.amount_requested != null
                        ? `$${app.amount_requested.toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="py-1 pr-4">
                      <span className="text-accent">{app.status ?? "—"}</span>
                    </td>
                    <td className="py-1 pr-4">{app.submitted_date ?? "—"}</td>
                    <td className="py-1">{app.decision_date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            Created — the new Draft application is in the list above.
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
