import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Vocare Outlook · Robin Samways",
};

export default function VocareOutlookPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span>{" "}Vocare &middot; Outlook
      </h1>
      <p className="mt-2 text-sm text-muted">
        The build itself is well-specified and mostly executed — the
        product&rsquo;s longer-term shape is the genuinely open part.
      </p>

      <section>
        <SectionHeader title="CAREER_CONVERSATIONS_VS_INTERVIEW_PRACTICE" />
        <p className="text-sm leading-relaxed">
          Whether Vocare repositions from "mock interview practice" to a
          broader "career conversations" category — covering raises,
          pivots, and promotions, not just job interviews — is parked
          pending real alpha usage data, not decided either way yet.
        </p>
      </section>

      <section>
        <SectionHeader title="PRICING_MODEL" />
        <p className="text-sm leading-relaxed">
          Vocare&rsquo;s real, current model is a $29 one-time lifetime fee —
          deliberately not a subscription, unlike every named competitor.
          Whether that stays the model, or gains a subscription or
          pay-per-session tier alongside it, is floated internally but not
          evaluated.
        </p>
      </section>

      <section>
        <SectionHeader title="THE_EMPLOYER_FACING_QUESTION" />
        <p className="text-sm leading-relaxed">
          M11&rsquo;s employer-facing surface is a full open identity
          question for the product, not an implementation detail: whether
          the no-score, not-judged framing central to Vocare today still
          holds for a session a company requested and will read, what
          signal an employer&rsquo;s own AI would actually see, and whether
          a company would ever receive a raw transcript — none of that has
          an answer yet.
        </p>
      </section>
    </main>
  );
}
