import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Farpost Tech Stack · Robin Samways",
};

export default function FarpostTechStackPage() {
  return (
    <main className="py-10">
      <PageHeading title="Farpost · Tech Stack">
        The converged siloes stack as it applies to Farpost, plus the
        Farpost-specific items beyond that shared baseline.
      </PageHeading>

      <section>
        <SectionHeader title="SHARED_SILOES_BASELINE" />
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <span className="font-semibold text-accent">Fastify</span> —
            the API framework, chosen over the site&rsquo;s own FastAPI
            baseline because the siloes program deliberately runs on Node/TS
            rather than Python, per <code>docs/standard-methodology.md</code>.
          </li>
          <li>
            <span className="font-semibold text-accent">Drizzle</span> — the
            ORM layer over Postgres, chosen for its lightweight, SQL-first
            style over a heavier ORM.
          </li>
          <li>
            <span className="font-semibold text-accent">Postgres</span> —
            the database, replacing the original system&rsquo;s MongoDB.
          </li>
          <li>
            <span className="font-semibold text-accent">better-auth</span> —
            passwordless magic-link authentication, the same identity
            pattern already proven in Vocare&rsquo;s own build.
          </li>
        </ul>
      </section>

      <section>
        <SectionHeader title="FARPOST_SPECIFIC_ADDITIONS" />
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <span className="font-semibold text-accent">Twilio</span> — SMS
            notifications for dispatch, carried over unchanged from the
            original stack since it&rsquo;s not tied to the database or
            framework choice being replaced.
          </li>
          <li>
            <span className="font-semibold text-accent">
              NFC/RFID tag reading
            </span>{" "}
            — the physical-tag verification mechanic at the core of
            Farpost&rsquo;s building records, unique to this project among
            the siloes.
          </li>
          <li>
            <span className="font-semibold text-accent">
              Anthropic Claude
            </span>{" "}
            — used for the contribution-preening pipeline (rewriting
            evaluative field language into neutral, observational language)
            and, going forward, Pulse&rsquo;s coaching-tip generation.
          </li>
        </ul>
      </section>
    </main>
  );
}
