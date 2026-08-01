import type { Metadata } from "next";
import Farpost from "@/components/Farpost";
import InfoTooltip from "@/components/InfoTooltip";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

const PROFESSIONAL_REPUTATION_GRAPH_EXPLANATION =
  "Farpost's professional-reputation graph: not a score or star rating — a computed timeline. Every action a professional takes (inspections, claims, relationships with buildings) is an event; reputation is assembled fresh from those events on each request, surfacing activity history and breadth of engagement rather than a single number. Professionals whose roles haven't yet earned trust are excluded entirely — no score, no timeline, nothing to game. It's the same underlying entities-connected-by-records shape as a Salesforce Account/Contact view, just applied to a professional network instead of a household.";

export const metadata: Metadata = {
  title: "Credential Flow Object Model · Robin Samways",
};

export default function CredentialFlowObjectModelPage() {
  return (
    <main className="py-10">
      <PageHeading title="Credential Flow · Object Model">
        The <code>Loan_Application__c</code> schema, its automated
        stamping behavior, and the structural parallel to Farpost&rsquo;s
        own reputation graph.
      </PageHeading>

      <section>
        <SectionHeader title="LOAN_APPLICATION__C" />
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Field</th>
                <th className="py-1 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Applicant</td>
                <td className="py-2 align-top">Lookup to the standard Contact object</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Account</td>
                <td className="py-2 align-top">Lookup to the standard Account object</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Amount Requested</td>
                <td className="py-2 align-top">Currency field</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Status</td>
                <td className="py-2 align-top">
                  Picklist — Draft, Submitted, Under Review, Approved,
                  Denied (plus Archived, reachable only by editing
                  Salesforce directly)
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Submitted Date</td>
                <td className="py-2 align-top">Stamped server-side on creation</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Decision Date</td>
                <td className="py-2 align-top">
                  Stamped automatically by a Flow — see below
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="AUTOMATED_DECISION_DATE" />
        <p className="text-sm leading-relaxed">
          Decision Date is never set by manual entry. A Record-Triggered
          Flow sets it to the current date automatically the moment a
          record&rsquo;s Status changes to Approved or Denied, and leaves it
          untouched for any other Status change — the same real Salesforce
          Field History Tracking audit trail this integration&rsquo;s
          status-change timeline is built from, not a derived or
          synthetic timeline.
        </p>
      </section>

      <section>
        <SectionHeader title="FARPOST_PARALLEL" />
        <p className="text-sm leading-relaxed">
          The Applicant → Loan Application → Account relationship model
          here is structurally the same shape as <Farpost />
          &rsquo;s own professional-reputation graph
          <InfoTooltip text={PROFESSIONAL_REPUTATION_GRAPH_EXPLANATION} />
          {" "}— entities (adjusters, inspectors, contractors, agents,
          building owners) linked through records that carry status and a
          decision trail. Both are computed from a real event/history log,
          not a derived or fabricated summary: Farpost&rsquo;s reputation is
          assembled fresh from logged actions on each request, and this
          integration&rsquo;s status-change timeline is sourced from
          Salesforce&rsquo;s own <code>Loan_Application__History</code>{" "}
          object — the same underlying pattern, a graph of related parties
          and the records that move between statuses, applied to a
          different domain.
        </p>
      </section>
    </main>
  );
}
