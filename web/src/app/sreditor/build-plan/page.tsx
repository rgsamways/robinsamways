import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Sreditor Build Plan · Robin Samways",
};

export default function SreditorBuildPlanPage() {
  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Build Plan">
        Forward build sequencing beyond the seven phases already shipped —
        provisional, and expected to change as the build progresses.
      </PageHeading>

      <section>
        <SectionHeader title="ALREADY_BUILT" />
        <p className="text-sm leading-relaxed">
          Built across one extended session, in seven phases plus a
          corroborating-signals extension, each shipped through
          Sreditor&rsquo;s own required propose &rarr; implement &rarr;
          verify &rarr; archive loop: <code>init</code>, <code>judge</code>{" "}
          (with drift-auditing and corroborating signals), <code>rollup</code>{" "}
          (with a real pre-call cost estimate), <code>report</code>{" "}
          (T661-line-structured markdown), plus <code>scan</code>,{" "}
          <code>status</code>, and <code>doctor</code>.
        </p>
      </section>

      <section>
        <SectionHeader title="NEXT_PUBLISH" />
        <p className="text-sm leading-relaxed">
          <code>npm publish</code> and tagging <code>v0.1.0</code> is the one
          remaining step before the tool is installable by anyone other than
          Robin — held back pending sign-off, not a technical blocker.
        </p>
      </section>

      <section>
        <SectionHeader title="THEN_ADAPTERS_AND_OUTPUT" />
        <p className="text-sm leading-relaxed">
          The adapter interface that reads a project&rsquo;s change history is
          already designed to be tool-agnostic, but OpenSpec is the only
          source format actually built. PDF/CSV report output is the other
          named gap — markdown-only today.
        </p>
      </section>
    </main>
  );
}
