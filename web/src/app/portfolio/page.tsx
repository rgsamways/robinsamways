import type { Metadata } from "next";
import Farpost from "@/components/Farpost";
import SectionHeader from "@/components/SectionHeader";
import LoanDemoWidget from "@/components/portfolio/LoanDemoWidget";

export const metadata: Metadata = {
  title: "Portfolio · Robin Samways",
};

export default function PortfolioPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Portfolio
      </h1>
      <p className="mt-2 text-sm text-muted">
        Salesforce loan-application integration — a live case study, not a
        mockup.
      </p>

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
          this isn&rsquo;t mocked data.
        </p>
      </section>

      <section>
        <SectionHeader title="WHY_CLIENT_CREDENTIALS_FLOW" />
        <p className="text-sm leading-relaxed">
          The API talks to Salesforce using raw <code>httpx</code>{" "}
          rather than the <code>simple-salesforce</code>{" "}
          wrapper, and OAuth 2.0&rsquo;s Client Credentials Flow rather than
          a
          user-interactive flow. Client Credentials Flow fits here because
          this is a server-to-server integration — no user is in the loop,
          matching how a backend service actually authenticates to
          Salesforce in production. Skipping the wrapper library was
          deliberate too: the point of this case study is demonstrating the
          protocol mechanics themselves — the token request, its expiry,
          when to refetch — not that a Python package can be installed. The
          API caches its access token in memory and only refetches it when
          it&rsquo;s expired or about to expire, rather than fetching a
          fresh token on every call.
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
          &rsquo;s own professional-reputation graph — entities
          (adjusters, inspectors, contractors, agents, building owners)
          linked through records that carry status and a decision trail.
          Same underlying pattern — a graph of related parties and the
          records that move between statuses — applied to a different
          domain.
        </p>
      </section>

      <section>
        <SectionHeader title="LIVE_DEMO" />
        <LoanDemoWidget />
      </section>
    </main>
  );
}
