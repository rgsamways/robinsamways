import type { Metadata } from "next";
import Farpost from "@/components/Farpost";
import HamburgerMenu from "@/components/HamburgerMenu";
import InfoTooltip from "@/components/InfoTooltip";
import SectionHeader from "@/components/SectionHeader";
import PortfolioDemos from "@/components/portfolio/PortfolioDemos";
import SetupGallery from "@/components/portfolio/SetupGallery";

const PROFESSIONAL_REPUTATION_GRAPH_EXPLANATION =
  "Farpost's professional-reputation graph: not a score or star rating — a computed timeline. Every action a professional takes (inspections, claims, relationships with buildings) is an event; reputation is assembled fresh from those events on each request, surfacing activity history and breadth of engagement rather than a single number. Professionals whose roles haven't yet earned trust are excluded entirely — no score, no timeline, nothing to game. It's the same underlying entities-connected-by-records shape as a Salesforce Account/Contact view, just applied to a professional network instead of a household.";

const SECTION_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#why-client-credentials-flow", label: "Why Client Credentials Flow" },
  { href: "#licensing-limitations", label: "Licensing Limitations" },
  { href: "#farpost-parallel", label: "Farpost Parallel" },
  { href: "#live-demo", label: "Live Demo" },
  { href: "#relationship-view", label: "Relationship View" },
  { href: "#setup-gallery", label: "Setup Gallery" },
];

export const metadata: Metadata = {
  title: "Portfolio · Robin Samways",
};

export default function PortfolioPage() {
  return (
    <main className="py-10">
      <div className="flex items-start gap-3">
        <HamburgerMenu links={SECTION_LINKS} ariaLabel="page sections menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Portfolio
          </h1>
          <p className="mt-2 text-sm text-muted">
            Salesforce loan-application integration — a live case study, not a
            mockup.
          </p>
        </div>
      </div>

      <section>
        <SectionHeader id="overview" title="OVERVIEW" />
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
        <SectionHeader id="why-client-credentials-flow" title="WHY_CLIENT_CREDENTIALS_FLOW" />
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
        <SectionHeader id="licensing-limitations" title="LICENSING_LIMITATIONS" />
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
        <SectionHeader id="farpost-parallel" title="FARPOST_PARALLEL" />
        <p className="text-sm leading-relaxed">
          The Applicant → Loan Application → Account relationship model
          here is structurally the same shape as <Farpost />
          &rsquo;s own professional-reputation graph
          <InfoTooltip text={PROFESSIONAL_REPUTATION_GRAPH_EXPLANATION} />
          {" "}— entities (adjusters, inspectors, contractors, agents,
          building owners) linked through records that carry status and a
          decision trail. Same underlying pattern — a graph of related
          parties and the records that move between statuses — applied to
          a different domain.
        </p>
      </section>

      <PortfolioDemos />

      <SetupGallery />
    </main>
  );
}
