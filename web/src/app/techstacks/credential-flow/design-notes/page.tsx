import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Credential Flow Design Notes · Robin Samways",
};

export default function CredentialFlowDesignNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Credential Flow · Design Notes">
        Why raw <code>httpx</code> over a wrapper library, and what the
        Financial Services Cloud/Agentforce licensing limitation actually
        drove.
      </PageHeading>

      <section>
        <SectionHeader title="WHY_RAW_HTTPX" />
        <p className="text-sm leading-relaxed">
          The API talks to Salesforce using raw <code>httpx</code> rather
          than the <code>simple-salesforce</code> wrapper, and OAuth
          2.0&rsquo;s Client Credentials Flow rather than a user-interactive
          flow. Client Credentials Flow fits here because this is a
          server-to-server integration — no user is in the loop, matching
          how a backend service actually authenticates to Salesforce in
          production. Skipping the wrapper library was deliberate too: the
          point of this case study is demonstrating the protocol mechanics
          themselves — the token request, its expiry, when to refetch — not
          that a Python package can be installed. A wrapper library would
          have hidden exactly the mechanic this piece exists to prove.
        </p>
      </section>

      <section>
        <SectionHeader title="LICENSING_LIMITATION_AND_WHAT_IT_DROVE" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            This integration deliberately does <strong>not</strong> use
            Salesforce Financial Services Cloud or Agentforce — both
            require paid licenses that aren&rsquo;t available in a free
            Developer Edition org. What&rsquo;s built here is the closest
            honest approximation on standard objects: a custom object with
            lookups to standard Contact and Account, a Status picklist, and
            a Record-Triggered Flow that auto-stamps a decision date when
            status changes to Approved or Denied. It&rsquo;s a simplified
            relationship model, not a claim of parity with a production FSC
            implementation.
          </p>
          <p>
            The most concrete consequence: the recommended-next-action
            feature calls the Anthropic API directly rather than using
            Agentforce, which isn&rsquo;t licensed on this org. That&rsquo;s
            not a downgrade improvised around a missing feature — it&rsquo;s
            the same direct-API-integration pattern proven elsewhere on this
            site (Farpost Dispatch&rsquo;s Apex-native Anthropic callout),
            applied here from the opposite direction: Python calling out to
            Salesforce data, rather than Salesforce calling out to
            Anthropic.
          </p>
        </div>
      </section>
    </main>
  );
}
