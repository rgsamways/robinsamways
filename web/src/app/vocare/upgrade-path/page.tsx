import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Vocare Upgrade Path · Robin Samways",
};

export default function VocareUpgradePathPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span>{" "}Vocare &middot; Upgrade Path
      </h1>
      <p className="mt-2 text-sm text-muted">
        Planned upgrades and evolutions to the live build, beyond what&rsquo;s
        already shipped.
      </p>

      <section>
        <SectionHeader title="M6_PROGRESS_OVER_TIME" />
        <p className="text-sm leading-relaxed">
          Actively in development: session history, qualitative trend
          indicators (surfacing decline as honestly as improvement, never
          silent on it), and full anchor (goal) CRUD with a revisable
          history.
        </p>
      </section>

      <section>
        <SectionHeader title="CONSENT_GATED_DATA_TIERS" />
        <p className="text-sm leading-relaxed">
          M7&ndash;M9 build the optional data layer behind Vocare&rsquo;s
          possible second business line: an anonymized aggregate pipeline
          (M7), a self-tagged aggregate tier (M8), and opt-in public "here I
          am" profiles (M9) — all consent-gated, and explicitly never
          joinable back to a real identity in any sellable export.
        </p>
      </section>

      <section>
        <SectionHeader title="ANDROID_PACKAGING" />
        <p className="text-sm leading-relaxed">
          M10 packages the existing Expo shell for the Play Store. It
          isn&rsquo;t conditional on any other module and can happen
          whenever it makes sense to prioritize it.
        </p>
      </section>

      <section>
        <SectionHeader title="EMPLOYER_FACING_SURFACE" />
        <p className="text-sm leading-relaxed">
          M11, deliberately last: a second revenue line letting employers
          query Vocare&rsquo;s data layer. This is a genuine open identity
          question for the product, not just an implementation detail —
          whether the no-score, not-judged framing that defines Vocare today
          still holds for a session a company requested and will read is
          unresolved.
        </p>
      </section>
    </main>
  );
}
