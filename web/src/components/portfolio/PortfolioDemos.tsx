"use client";

import { useState } from "react";
import Farpost from "@/components/Farpost";
import SectionHeader from "@/components/SectionHeader";
import LoanDemoWidget from "@/components/portfolio/LoanDemoWidget";
import RelationshipView from "@/components/portfolio/RelationshipView";

export default function PortfolioDemos() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <section>
        <SectionHeader id="live-demo" title="LIVE_DEMO" />
        <LoanDemoWidget onMutate={() => setRefreshKey((key) => key + 1)} />
      </section>

      <section>
        <SectionHeader id="relationship-view" title="RELATIONSHIP_VIEW" />
        <p className="text-sm leading-relaxed">
          Three more read-only additions, chosen to speak directly to{" "}
          this role&rsquo;s actual priorities rather than to be generically
          impressive. Select an Account below to see its Loan Applications
          grouped together — a small, concrete instance of
          relationship-centric data modeling, not just an implied lookup.
          Each application also offers an AI-generated{" "}
          &ldquo;recommended next action,&rdquo; produced by calling the
          Anthropic API directly — not Salesforce Agentforce, which
          isn&rsquo;t licensed on this Developer Edition org, so this is an
          honest analog rather than a claim of using a product Robin
          doesn&rsquo;t have access to. And each application&rsquo;s status
          history is sourced from Salesforce&rsquo;s own Field History
          Tracking — real audit-trail entries, not a fabricated summary
          from two date fields. Same principle as{" "}
          <Farpost />
          &rsquo;s professional-reputation graph above: computed from
          actual events, not a stored score.
        </p>
        <div className="mt-4">
          <RelationshipView refreshKey={refreshKey} />
        </div>
      </section>
    </>
  );
}
