"use client";

import { Fragment, useEffect, useState } from "react";

type LoanApplication = {
  id: string;
  applicant_name: string | null;
  account_name: string | null;
  amount_requested: number | null;
  status: string | null;
  submitted_date: string | null;
  decision_date: string | null;
};

type AccountGroup = {
  account_id: string | null;
  account_name: string | null;
  applications: LoanApplication[];
};

type HistoryEntry = {
  old_value: string | null;
  new_value: string | null;
  changed_at: string | null;
};

type LoadStatus = "loading" | "loaded" | "error";
type PanelState = {
  open?: boolean;
  loading?: boolean;
  error?: boolean;
};
type RecommendationState = PanelState & { text?: string };
type HistoryState = PanelState & { entries?: HistoryEntry[] };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function RelationshipView() {
  const [groups, setGroups] = useState<AccountGroup[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Record<string, RecommendationState>>({});
  const [histories, setHistories] = useState<Record<string, HistoryState>>({});

  useEffect(() => {
    const load = async () => {
      setLoadStatus("loading");
      try {
        const response = await fetch(`${API_URL}/salesforce/accounts`);
        if (!response.ok) throw new Error("request failed");
        const data: AccountGroup[] = await response.json();
        setGroups(data);
        setLoadStatus("loaded");
      } catch {
        setLoadStatus("error");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedAccountId && groups.length > 0) {
      setSelectedAccountId(groups[0].account_id ?? "");
    }
  }, [groups, selectedAccountId]);

  const selectedGroup = groups.find((group) => group.account_id === selectedAccountId) ?? null;

  const toggleRecommendation = async (id: string) => {
    const current = recommendations[id];
    if (current?.open) {
      setRecommendations((prev) => ({ ...prev, [id]: { ...prev[id], open: false } }));
      return;
    }
    if (current?.text) {
      setRecommendations((prev) => ({ ...prev, [id]: { ...prev[id], open: true } }));
      return;
    }
    setRecommendations((prev) => ({ ...prev, [id]: { open: true, loading: true } }));
    try {
      const response = await fetch(`${API_URL}/salesforce/loan-applications/${id}/recommendation`);
      if (!response.ok) throw new Error("request failed");
      const data: { suggestion: string } = await response.json();
      setRecommendations((prev) => ({ ...prev, [id]: { open: true, text: data.suggestion } }));
    } catch {
      setRecommendations((prev) => ({ ...prev, [id]: { open: true, error: true } }));
    }
  };

  const toggleHistory = async (id: string) => {
    const current = histories[id];
    if (current?.open) {
      setHistories((prev) => ({ ...prev, [id]: { ...prev[id], open: false } }));
      return;
    }
    if (current?.entries) {
      setHistories((prev) => ({ ...prev, [id]: { ...prev[id], open: true } }));
      return;
    }
    setHistories((prev) => ({ ...prev, [id]: { open: true, loading: true } }));
    try {
      const response = await fetch(`${API_URL}/salesforce/loan-applications/${id}/history`);
      if (!response.ok) throw new Error("request failed");
      const data: HistoryEntry[] = await response.json();
      setHistories((prev) => ({ ...prev, [id]: { open: true, entries: data } }));
    } catch {
      setHistories((prev) => ({ ...prev, [id]: { open: true, error: true } }));
    }
  };

  if (loadStatus === "loading") {
    return <p className="text-muted">Loading Account data from Salesforce…</p>;
  }
  if (loadStatus === "error") {
    return (
      <p>
        Couldn&rsquo;t reach the live Salesforce data right now. Try
        refreshing.
      </p>
    );
  }
  if (groups.length === 0) {
    return <p className="text-muted">No Loan Applications yet to group by Account.</p>;
  }

  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <label htmlFor="account-select" className="font-semibold text-accent">
          account
        </label>
        <select
          id="account-select"
          value={selectedAccountId}
          onChange={(event) => setSelectedAccountId(event.target.value)}
          className="border border-foreground/20 bg-transparent px-2 py-1 focus:border-accent focus:outline-none"
        >
          {groups.map((group) => (
            <option key={group.account_id ?? "unknown"} value={group.account_id ?? ""}>
              {group.account_name ?? "Unknown Account"}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Applicant</th>
                <th className="py-1 pr-4 font-semibold">Amount</th>
                <th className="py-1 pr-4 font-semibold">Status</th>
                <th className="py-1 pr-4 font-semibold">Submitted</th>
                <th className="py-1 pr-4 font-semibold">Decision</th>
                <th className="py-1 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedGroup.applications.map((app) => {
                const recommendation = recommendations[app.id];
                const history = histories[app.id];
                return (
                  <Fragment key={app.id}>
                    <tr className="border-b border-foreground/10">
                      <td className="py-1 pr-4">{app.applicant_name ?? "—"}</td>
                      <td className="py-1 pr-4">
                        {app.amount_requested != null
                          ? `$${app.amount_requested.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="py-1 pr-4">
                        <span className="text-accent">{app.status ?? "—"}</span>
                      </td>
                      <td className="py-1 pr-4">{app.submitted_date ?? "—"}</td>
                      <td className="py-1 pr-4">{app.decision_date ?? "—"}</td>
                      <td className="py-1">
                        <button
                          type="button"
                          onClick={() => toggleRecommendation(app.id)}
                          className="mr-3 text-accent underline"
                        >
                          recommend
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleHistory(app.id)}
                          className="text-accent underline"
                        >
                          history
                        </button>
                      </td>
                    </tr>
                    {recommendation?.open && (
                      <tr key={`${app.id}-recommendation`} className="border-b border-foreground/10">
                        <td colSpan={6} className="bg-skills-bg px-3 py-2 text-xs">
                          <span className="font-semibold text-accent">recommended next action:</span>{" "}
                          {recommendation.loading && <span className="text-muted">thinking…</span>}
                          {recommendation.error && (
                            <span>Couldn&rsquo;t generate a recommendation right now.</span>
                          )}
                          {recommendation.text && <span>{recommendation.text}</span>}
                        </td>
                      </tr>
                    )}
                    {history?.open && (
                      <tr key={`${app.id}-history`} className="border-b border-foreground/10">
                        <td colSpan={6} className="bg-skills-bg px-3 py-2 text-xs">
                          <span className="font-semibold text-accent">status history:</span>{" "}
                          {history.loading && <span className="text-muted">loading…</span>}
                          {history.error && (
                            <span>Couldn&rsquo;t load the status history right now.</span>
                          )}
                          {history.entries && history.entries.length === 0 && (
                            <span className="text-muted">
                              No status changes recorded since Field History Tracking was enabled.
                            </span>
                          )}
                          {history.entries && history.entries.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {history.entries.map((entry, index) => (
                                <li key={index}>
                                  <span aria-hidden>›</span>{" "}
                                  {entry.old_value ?? "—"} → {entry.new_value ?? "—"}
                                  {entry.changed_at && (
                                    <span className="text-muted">
                                      {" "}
                                      ({new Date(entry.changed_at).toLocaleString()})
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
