import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Vocare Tech Stack · Robin Samways",
};

export default function VocareTechStackPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span>{" "}Vocare &middot; Tech Stack
      </h1>
      <p className="mt-2 text-sm text-muted">
        The converged siloes stack as it applies to Vocare, plus the
        Vocare-specific items beyond that shared baseline. Notably, Vocare is
        where this stack was discovered, not designed top-down — Farpost's
        rebuild adopted it after finding it already working here.
      </p>

      <section>
        <SectionHeader title="SHARED_SILOES_BASELINE" />
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <span className="font-semibold text-accent">Fastify</span> — the
            API framework.
          </li>
          <li>
            <span className="font-semibold text-accent">Drizzle</span> — the
            ORM layer over Postgres.
          </li>
          <li>
            <span className="font-semibold text-accent">Postgres</span> —
            the database.
          </li>
          <li>
            <span className="font-semibold text-accent">better-auth</span> —
            passwordless magic-link authentication, extended with Vocare's
            own <code>additionalFields</code> (entitlement status, date of
            birth, country, paid-at) rather than a separate profile table.
          </li>
        </ul>
      </section>

      <section>
        <SectionHeader title="VOCARE_SPECIFIC_ADDITIONS" />
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <span className="font-semibold text-accent">
              Web Speech API / Expo speech recognition
            </span>{" "}
            — voice capture for the conversation engine, with a typed
            fallback.
          </li>
          <li>
            <span className="font-semibold text-accent">Stripe</span> — the
            $29 one-time paywall, currently running in test mode.
          </li>
          <li>
            <span className="font-semibold text-accent">Expo</span> — the
            mobile shell underlying both voice capture (M3) and the planned
            Android packaging (M10).
          </li>
          <li>
            <span className="font-semibold text-accent">An LLM API</span> —
            powers the conversation engine and the async post-session mining
            pipeline that extracts coaching signal without ever scoring a
            session in real time.
          </li>
        </ul>
      </section>
    </main>
  );
}
