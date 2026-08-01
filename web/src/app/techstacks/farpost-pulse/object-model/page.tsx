import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Pulse Object Model · Robin Samways",
};

export default function FarpostPulseObjectModelPage() {
  return (
    <main className="py-10">
      <PageHeading title="Pulse · Object Model">
        <code>FieldTech</code>, <code>Job</code>, and{" "}
        <code>CoachingHistory</code>, and how a generated tip links back to
        the jobs it was based on.
      </PageHeading>

      <section>
        <SectionHeader title="FIELD_TECH" />
        <p className="text-sm leading-relaxed">
          One record per seeded field technician: an id, a name, and the
          snapshot stat shown on the roster card (their current
          tag-completion rate). Lives in the <code>techs</code> container,
          partitioned by <code>/id</code>.
        </p>
      </section>

      <section>
        <SectionHeader title="JOB" />
        <p className="text-sm leading-relaxed">
          One record per completed job: the assigned tech&rsquo;s{" "}
          <code>techId</code>, a completion timestamp, tag-completion and
          turnaround measurements for that job, and the angle types
          captured versus missed. Lives in the <code>jobs</code> container,
          partitioned by <code>/techId</code> — 20-30 seeded jobs per
          technician, patterned so the job history tells a real trend, not
          random noise.
        </p>
      </section>

      <section>
        <SectionHeader title="COACHING_HISTORY" />
        <p className="text-sm leading-relaxed">
          One record per generated coaching tip: the tip text, the{" "}
          <code>techId</code> it was generated for, and references to the
          specific <code>Job</code> records the tip was based on. Lives in
          the <code>coachingHistory</code> container, partitioned by{" "}
          <code>/techId</code>. A stored tip is never a standalone string —
          it&rsquo;s always traceable back to the job history that produced
          it, so a visitor (or a future real model call) can see exactly
          what evidence a given tip was grounded in.
        </p>
      </section>
    </main>
  );
}
