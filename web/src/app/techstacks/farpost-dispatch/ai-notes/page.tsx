import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Dispatch AI Notes · Robin Samways",
};

export default function FarpostDispatchAiNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dispatch · AI Notes">
        How AI was used to build this piece, then how AI is used inside it.
      </PageHeading>

      <section>
        <SectionHeader title="BUILD_PROCESS" />
        <p className="text-sm leading-relaxed">
          Dispatch was built with Claude Code as a pairing partner throughout
          — scaffolding the Salesforce DX project structure, drafting Apex
          classes and Lightning Web Components against this site&rsquo;s own
          proposal-then-drift-audit process (see{" "}
          <a href="/sreditor" className="text-accent underline">
            Sreditor
          </a>{" "}
          for that discipline in more depth), and iterating on the
          concurrency-safe claiming logic until the row-lock behavior was
          actually verified, not just assumed correct.
        </p>
      </section>

      <section>
        <SectionHeader title="AI_MATCHING_MECHANIC" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <code>JobMatchingService</code> queries Contacts whose Service
            Region matches the Job&rsquo;s Region, whose Certifications
            include the Job&rsquo;s Job Type, and whose Availability Status
            is Available, sorts the shortlist by Rating, then calls
            Anthropic &mdash; via the <code>Anthropic_API</code> Named
            Credential, never a hardcoded key &mdash; for a short
            natural-language reason per candidate. If no Contact is
            eligible, the service returns an empty result without ever
            calling Anthropic.
          </p>
          <p>
            <strong>The contrast with Credential Flow:</strong> this callout
            originates from Apex inside Salesforce; Credential
            Flow&rsquo;s originates from Python outside it. Same
            &ldquo;explain the why&rdquo; pattern, same underlying AI
            provider, opposite direction of integration — two genuinely
            different ways of proving an AI feature against Salesforce data.
          </p>
        </div>
      </section>
    </main>
  );
}
