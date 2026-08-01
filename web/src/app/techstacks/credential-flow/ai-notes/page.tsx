import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Credential Flow AI Notes · Robin Samways",
};

export default function CredentialFlowAiNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Credential Flow · AI Notes">
        How AI was used to build this piece, then the real AI feature
        living inside it.
      </PageHeading>

      <section>
        <SectionHeader title="BUILD_PROCESS" />
        <p className="text-sm leading-relaxed">
          Credential Flow was built with Claude Code pairing throughout —
          scaffolding the FastAPI token client and its in-memory caching
          logic, drafting the honeypot/rate-limiting/profanity-blocklist
          write protections shared with this site&rsquo;s contact form, and
          iterating on the Relationship View&rsquo;s live-sync behavior
          against the real Salesforce org rather than mocked responses.
        </p>
      </section>

      <section>
        <SectionHeader title="RECOMMENDED_NEXT_ACTION" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The real AI feature: a short, AI-assisted &ldquo;recommended
            next action&rdquo; suggestion for a given Loan Application,
            generated from its current Status and how long it has been in
            that status, by calling the Anthropic API directly. An
            application sitting in Under Review for several days with no
            change gets a suggestion that references that duration, not a
            generic status-only message — and if the Anthropic call fails
            or times out, the page shows a clean error state for the
            recommendation without breaking anything else.
          </p>
          <p>
            <strong>Why not Agentforce:</strong> Salesforce&rsquo;s own
            agentic AI layer isn&rsquo;t licensed on this free Developer
            Edition org. Calling Anthropic directly is the honest
            workaround, not a feature downgrade dressed up — and it proves
            the same direct-API-integration skill Farpost Dispatch proves
            from the opposite direction (Apex calling out to Anthropic, this
            piece&rsquo;s Python calling out to Salesforce data).
          </p>
        </div>
      </section>
    </main>
  );
}
