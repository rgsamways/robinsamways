import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Sreditor Tech Stack · Robin Samways",
};

export default function SreditorTechStackPage() {
  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Tech Stack">
        A deliberately small, dependency-light stack for a CLI tool meant to
        run against a developer&rsquo;s own Anthropic account.
      </PageHeading>

      <section>
        <SectionHeader title="CORE" />
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <span className="font-semibold text-accent">Node.js / TypeScript</span>{" "}
            — the CLI itself, distributed as an npm package once published.
          </li>
          <li>
            <span className="font-semibold text-accent">Anthropic Claude (Sonnet 5)</span>{" "}
            — the judgment model behind every <code>judge</code> call, run
            against the developer&rsquo;s own account at standard rates, no
            markup, no subscription.
          </li>
          <li>
            <span className="font-semibold text-accent">Zod</span> — every
            judgment prompt is structured through a zod schema, so the
            model&rsquo;s output is never freeform prose that needs
            re-interpreting.
          </li>
        </ul>
      </section>

      <section>
        <SectionHeader title="SOURCE_FORMAT" />
        <p className="text-sm leading-relaxed">
          <a
            href="https://github.com/Fission-AI/OpenSpec"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            OpenSpec
          </a>{" "}
          is the only source adapter built so far — reading a project&rsquo;s
          archived <code>proposal.md</code>/<code>design.md</code>/
          <code>tasks.md</code> artifacts directly. The adapter interface
          itself is designed to be tool-agnostic for whenever a second source
          format is worth building.
        </p>
      </section>

      <section>
        <SectionHeader title="TESTING" />
        <p className="text-sm leading-relaxed">
          52 passing tests across 12 test files, run against real Anthropic
          API calls rather than fixtures — see{" "}
          <a href="/sreditor/testing-verification" className="text-accent underline">
            Testing &amp; Verification
          </a>{" "}
          for the full story.
        </p>
      </section>
    </main>
  );
}
