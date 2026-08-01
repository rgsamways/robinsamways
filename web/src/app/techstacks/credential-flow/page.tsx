import type { Metadata } from "next";
import Farpost from "@/components/Farpost";
import InfoTooltip from "@/components/InfoTooltip";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";
import PortfolioDemos from "@/components/portfolio/PortfolioDemos";

const PROFESSIONAL_REPUTATION_GRAPH_EXPLANATION =
  "Farpost's professional-reputation graph: not a score or star rating — a computed timeline. Every action a professional takes (inspections, claims, relationships with buildings) is an event; reputation is assembled fresh from those events on each request, surfacing activity history and breadth of engagement rather than a single number. Professionals whose roles haven't yet earned trust are excluded entirely — no score, no timeline, nothing to game. It's the same underlying entities-connected-by-records shape as a Salesforce Account/Contact view, just applied to a professional network instead of a household.";

export const metadata: Metadata = {
  title: "Credential Flow · Robin Samways",
};

export default function CredentialFlowPage() {
  return (
    <main className="py-10">
      <PageHeading title="Credential Flow">
        Salesforce loan-application integration — a live case study, not a
        mockup.
      </PageHeading>

      <section>
        <SectionHeader title="OVERVIEW" />
        <p className="text-sm leading-relaxed">
          A live Salesforce integration built for this portfolio: a custom{" "}
          <code>Loan_Application__c</code>{" "}
          object model (Applicant → Loan Application → Account) in a free
          Salesforce Developer Edition
          org, called from this site&rsquo;s own FastAPI backend via the
          OAuth 2.0 Client Credentials Flow. The list and create actions
          below hit the real Salesforce REST API against real records —
          this isn&rsquo;t mocked data. See{" "}
          <a
            href="/techstacks/credential-flow/architecture"
            className="text-accent underline"
          >
            Architecture
          </a>{" "}
          for the token lifecycle and full endpoint surface.
        </p>
      </section>

      <section>
        <SectionHeader title="WHY_CLIENT_CREDENTIALS_FLOW" />
        <p className="text-sm leading-relaxed">
          The API talks to Salesforce using raw <code>httpx</code> rather
          than the <code>simple-salesforce</code> wrapper, and OAuth
          2.0&rsquo;s Client Credentials Flow rather than a user-interactive
          flow — a server-to-server integration where no user is in the
          loop. See{" "}
          <a
            href="/techstacks/credential-flow/design-notes"
            className="text-accent underline"
          >
            Design Notes
          </a>{" "}
          for the full reasoning behind choosing raw <code>httpx</code> over
          a wrapper library.
        </p>
      </section>

      <section>
        <SectionHeader title="LICENSING_LIMITATIONS" />
        <p className="text-sm leading-relaxed">
          This integration deliberately does <strong>not</strong>{" "}
          use Salesforce Financial Services Cloud or Agentforce — both
          require paid licenses that aren&rsquo;t available in a free
          Developer Edition org. What&rsquo;s built here is the closest
          honest approximation on standard objects: a custom object with
          lookups to standard Contact and Account, a Status picklist, and a
          Record-Triggered Flow that auto-stamps a decision date when
          status changes to Approved or Denied. It&rsquo;s a simplified
          relationship model, not a claim of parity with a production FSC
          implementation.
        </p>
      </section>

      <section>
        <SectionHeader title="FARPOST_PARALLEL" />
        <p className="text-sm leading-relaxed">
          The Applicant → Loan Application → Account relationship model
          here is structurally the same shape as <Farpost />
          &rsquo;s own professional-reputation graph
          <InfoTooltip text={PROFESSIONAL_REPUTATION_GRAPH_EXPLANATION} />
          {" "}— entities linked through records that carry status and a
          decision trail. See{" "}
          <a
            href="/techstacks/credential-flow/object-model"
            className="text-accent underline"
          >
            Object Model
          </a>{" "}
          for the full field list and the parallel in more depth.
        </p>
      </section>

      <PortfolioDemos />
    </main>
  );
}
