import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Dispatch Design Notes · Robin Samways",
};

export default function FarpostDispatchDesignNotesPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dispatch · Design Notes">
        Why the AI callout originates from inside Salesforce, and why this
        piece has no live public demo.
      </PageHeading>

      <section>
        <SectionHeader title="WHY_APEX_NATIVE_AI" />
        <p className="text-sm leading-relaxed">
          Every other AI feature on this site calls out to Salesforce data
          from an external Python backend. Dispatch deliberately inverts
          that direction: the Anthropic callout originates from Apex,
          inside Salesforce itself, via a Named Credential. That&rsquo;s the
          harder, more Salesforce-native pattern to demonstrate — proving
          the platform can be the caller, not just the thing being called
          into — and it&rsquo;s the direct, complementary counterpart to
          Credential Flow&rsquo;s own Anthropic-powered recommendation
          feature: same &ldquo;explain the why&rdquo; pattern, opposite
          direction of integration.
        </p>
      </section>

      <section>
        <SectionHeader title="WHY_NO_LIVE_DEMO" />
        <p className="text-sm leading-relaxed">
          Exposing a free-tier Salesforce Developer Edition org&rsquo;s
          Partner Community login publicly risks two real problems:
          credential abuse (anyone can log in and start using the org) and
          governor-limit exhaustion (a free org has hard per-24-hour API and
          Apex execution limits shared across every user of the org — a
          public login could exhaust them for no real benefit). Neither risk
          is worth taking just to let a portfolio visitor click around a
          live login, so this piece stays demonstrated through screenshots
          and this written record instead of a working public link.
        </p>
      </section>
    </main>
  );
}
