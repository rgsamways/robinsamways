import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Vocare Build Plan · Robin Samways",
};

const MODULES: { id: string; what: string; status: string }[] = [
  { id: "M0", what: "Repo/scaffold, CI, Railway + Vercel deploy", status: "Built, live since 2026-07-21" },
  { id: "M1", what: "Magic-link auth, $29 Stripe paywall, 3-free-session gate, fair-use velocity cap, age/country capture", status: "Built, live (Stripe still in test mode)" },
  { id: "M2", what: "Core conversation engine — question arc, adaptive follow-up, anchor steering, crisis-safety net, personas", status: "Built, live" },
  { id: "M2.1", what: "App navigation shell (Conversation / Feedback / Progress & Anchors / Profile tabs)", status: "Built, live" },
  { id: "M3", what: "Voice capture (Web Speech API / Expo speech recognition, typed fallback)", status: "Built, live — one real-device re-verification still owed" },
  { id: "M4", what: "Async post-session mining pipeline", status: "Built, live" },
  { id: "M5", what: "Coaching feedback generation", status: "Built, live" },
  { id: "M6", what: "Progress over time — session history, trend indicators, anchor CRUD/archive/revisions", status: "In progress" },
  { id: "M7", what: "Anonymization / Tier 2b aggregate pipeline", status: "Planned, not started" },
  { id: "M8", what: "Tier 2a self-tagged aggregate", status: "Planned, not started" },
  { id: "M9", what: "Tier 1 opt-in public profiles", status: "Planned, not started" },
  { id: "M10", what: "Android packaging (Expo shell, Play Store)", status: "Planned — not conditional on anything else" },
  { id: "M11", what: "Employer-facing surface (second revenue line)", status: "Planned, deliberately last, gated behind proven demand and unresolved design questions" },
];

export default function VocareBuildPlanPage() {
  return (
    <main className="py-10">
      <PageHeading title="Vocare · Build Plan">
        The real module map (M0&ndash;M11) as of 2026-07-24 — provisional and
        expected to change as the build itself progresses, not a fixed
        roadmap.
      </PageHeading>

      <section>
        <SectionHeader title="MODULE_MAP" />
        <div className="space-y-3 text-sm leading-relaxed">
          {MODULES.map((module) => (
            <div key={module.id} className="border-l-2 border-accent pl-3">
              <p>
                <span className="font-semibold text-accent">{module.id}</span> — {module.what}
              </p>
              <p className="mt-0.5 text-xs text-muted">{module.status}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
