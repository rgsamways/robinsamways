import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import SectionHeader from "@/components/SectionHeader";

const SECTION_LINKS = [
  { href: "/method", label: "Method Index" },
  { href: "#problem", label: "Problem" },
  { href: "#existing-approaches", label: "Existing Approaches" },
  { href: "#hypothesis", label: "Hypothesis" },
  { href: "#method", label: "Method" },
  { href: "#results", label: "Results" },
  { href: "#conclusion", label: "Conclusion" },
];

export const metadata: Metadata = {
  title: "Sreditor · Robin Samways",
};

export default function SreditorPage() {
  return (
    <main className="py-10">
      <div className="flex items-start gap-3">
        <HamburgerMenu links={SECTION_LINKS} ariaLabel="page sections menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Sreditor
          </h1>
          <p className="mt-2 text-sm text-muted">
            A CLI tool that judges SR&amp;ED tax-credit eligibility from a
            project&rsquo;s own OpenSpec change history, in near real time.
          </p>
        </div>
      </div>

      <section>
        <SectionHeader id="problem" title="PROBLEM" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Canada&rsquo;s SR&ED tax credit runs on a specific three-part
            test: a genuine technological uncertainty, a systematic
            investigation that resolved it, and a resulting technological
            advancement. CRA assesses all three through Form T661 Part 2
            &mdash; three lines, word-limited to 350, 700, and 350 words
            respectively. Of the claims that get audited, roughly 60% are
            denied or substantially reduced, and the gap between an approved
            claim and a denied one is almost never the eligibility of the
            underlying work. It&rsquo;s the documentation.
          </p>
          <p>
            Here&rsquo;s the specific failure mode. When a developer
            reconstructs this narrative months later, at filing time, they no
            longer remember the actual sequence of uncertainty, investigation,
            and resolution &mdash; they remember what they built, not what
            they didn&rsquo;t know going in. That produces two things CRA
            explicitly penalizes: narratives written in product-description
            language (&ldquo;we built a real-time pipeline handling 50,000
            events/sec&rdquo;) instead of investigation language
            (&ldquo;investigation into whether known architectures could
            maintain latency under loads exceeding published
            benchmarks&rdquo;), and a claim assembled near a deadline that
            reads as curated rather than contemporaneous &mdash; which erodes
            credibility with a reviewer even when the work itself was
            genuinely eligible.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader id="existing-approaches" title="EXISTING_APPROACHES" />
        <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed">
          <li>
            <strong>Manual note-taking.</strong>{" "}
            No structure, no CRA-shaped
            framing, and because it&rsquo;s a separate chore layered on top of
            actual work, inconsistently kept or abandoned entirely once a
            deadline hits.
          </li>
          <li>
            <strong>Relying on git history.</strong>{" "}
            Commit messages are
            written for other developers &mdash; what changed, not what was
            uncertain or how it was systematically investigated. Git history
            has no real mapping to CRA&rsquo;s three-part test; it&rsquo;s a
            record of output, not of reasoning.
          </li>
          <li>
            <strong>
              An accountant or SR&ED consultant interviewing the developer
              months later.
            </strong>{" "}
            Reconstructs intent from memory, at year-end, under time pressure
            &mdash; exactly the failure mode behind CRA&rsquo;s own denial
            statistics. Also the most expensive option, and the developer
            being interviewed has usually already forgotten the real sequence
            of events.
          </li>
          <li>
            <strong>Generic project-management tooling.</strong>{" "}
            Jira, Azure
            DevOps, timesheets &mdash; built for tracking work, not scientific
            uncertainty. Tickets describe features and tasks, not hypotheses
            and experiments. This is also, literally, how the funded
            competitors in this space operate: mining tickets, commits, and
            timesheets to reconstruct SR&ED intent after the fact from
            signals that were never written with CRA framing in mind.
            Automating the reconstruction doesn&rsquo;t fix the fact that
            it&rsquo;s still reconstruction.
          </li>
        </ul>
      </section>

      <section>
        <SectionHeader id="hypothesis" title="HYPOTHESIS" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            A lightweight, developer-native, contemporaneous logging practice
            &mdash; integrated into how a developer already works rather than
            added as a separate chore &mdash; produces stronger, more
            defensible SR&ED documentation than any form of after-the-fact
            reconstruction, however careful.
          </p>
          <p>
            Concretely: judge SR&ED eligibility per change, in near real
            time, as changes are actually completed &mdash; not once a year
            at filing time. Keep the judgment deliberately skeptical rather
            than generous, so the resulting record stays credible under
            audit. Make the reasoning transparent &mdash; published prompts,
            not a black box &mdash; so the trust story doesn&rsquo;t depend on
            taking a vendor&rsquo;s word for it. Make it free and frictionless
            enough (CLI-native, bring-your-own API key) that a solo developer
            actually keeps using it, instead of abandoning it the way manual
            note-taking gets abandoned.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader id="method" title="METHOD" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Sreditor is a CLI tool, Node.js and TypeScript, that reads a
            project&rsquo;s archived{" "}
            <a
              href="https://github.com/Fission-AI/OpenSpec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              OpenSpec
            </a>{" "}
            change artifacts &mdash; <code>proposal.md</code>,{" "}
            <code>design.md</code>, <code>tasks.md</code>, structured
            reasoning a developer already writes at decision time under a
            spec-driven workflow &mdash; and judges each one against
            CRA&rsquo;s three-part test via a deliberately skeptical Claude
            (Sonnet 5) prompt, structured through <code>zod</code>{" "}
            schemas so the output is never freeform prose.
          </p>
          <p>
            What a developer actually does: <code>sreditor init</code>{" "}
            runs a one-time AI-assisted interview that drafts a developer-authored
            &ldquo;anchor&rdquo; document &mdash; goal, genuine uncertainty,
            success criteria. The AI only assists in framing; it never
            invents content, and the document is append-only once saved. From
            there, build normally, using OpenSpec&rsquo;s own propose &rarr;
            apply &rarr; archive loop. <code>sreditor judge</code>{" "}
            judges each newly-archived change against the three-part test, and separately
            compares it against the anchor for scope drift &mdash; a second,
            distinct model call, kept apart from the eligibility judgment
            specifically so one doesn&rsquo;t bias the other.{" "}
            <code>sreditor rollup</code>{" "}
            periodically groups the accumulated
            judgments into CRA-shaped &ldquo;projects,&rdquo; the level CRA
            actually wants a claim framed at &mdash; gated behind a real
            token-cost estimate before the call runs, since it&rsquo;s the
            one command that processes the whole accumulated log at once.{" "}
            <code>sreditor report</code>{" "}
            renders the rollup into markdown,
            pre-structured around T661 Part 2&rsquo;s actual line numbers,
            with real word counts &mdash; not model-claimed ones &mdash;
            checked against the 350/700/350 limits.
          </p>
          <p>
            A few decisions worth naming directly. The two-layer judgment
            model &mdash; per-change judgment running continuously, rollup as
            just the filing-time packaging step on top of an already-
            accumulated record &mdash; means the habit of thinking in SR&ED
            terms forms during the build, not at the end of the year.
            Drift-auditing runs as a second, independent model call, and its
            output is a plain-language narrative rather than a numeric score,
            so it&rsquo;s legible directly in the log instead of buried in a
            metric. Transparency is the actual trust mechanism, not a slogan:
            every judgment prompt lives in the repo as plain TypeScript,
            readable by a developer, their accountant, or a CRA reviewer, not
            hidden behind a platform. Every call runs against the
            developer&rsquo;s own Anthropic account at standard rates &mdash;
            no markup, no subscription &mdash; which is also the direct
            structural reason a solo developer or a tiny CCPC is a market the
            funded, per-seat-priced competitors aren&rsquo;t built to serve.
            And corroborating signals &mdash; three optional external tools
            that can feed extra context into a judgment prompt if installed
            &mdash; are structurally barred from ever determining eligibility
            on their own; the prompt is explicitly instructed to treat them
            as non-authoritative.
          </p>
          <p>
            Sreditor didn&rsquo;t start as an idea in the abstract. This
            site&rsquo;s own <code>docs/sreditor/</code>{" "}
            folder &mdash; a plain markdown log of technological-uncertainty write-ups, kept
            by hand since the first week of building robinsamways.ca &mdash;
            was the original manual prototype. Sreditor is that same
            discipline, automated.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader id="results" title="RESULTS" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Built across one extended session, in seven phases plus a
            corroborating-signals extension, each shipped through a full
            propose &rarr; implement &rarr; verify &rarr; archive loop
            &mdash; Sreditor&rsquo;s own build tracked the same way a
            user&rsquo;s project would be, using OpenSpec on itself.
          </p>
          <p>
            As of tonight: 26 TypeScript source files, roughly 1,100 lines of
            code, 46 passing tests across 12 test files, CI green on every
            push. Every command works end to end against real Anthropic API
            calls, not fixtures &mdash; <code>init</code>, <code>reflect</code>,{" "}
            <code>judge</code> (with drift-auditing and corroborating
            signals), <code>rollup</code> (with a real pre-call cost
            estimate), <code>report</code> (T661-line-structured markdown
            with real word counts), plus <code>scan</code>, <code>status</code>,
            and <code>doctor</code>. Sreditor is dogfooded on its own build
            &mdash; its real judgment log and real anchor document, produced
            by running the tool on itself, are the actual calibration data
            behind everything above.
          </p>
          <p>
            Still rough, and worth naming plainly rather than hiding:
            markdown-only report output, no PDF or CSV yet. A single source
            adapter &mdash; OpenSpec only &mdash; though the adapter
            interface is designed to be tool-agnostic, nothing else is built.
            Canada&rsquo;s CRA SR&ED program only, not a general
            international R&D tax credit tool. The git-to-code correlation
            heuristic behind corroborating signals only sees a
            change&rsquo;s final archiving commit, not earlier implementation
            commits along the way. And the T661 narrative register has been
            checked against a real published CRA example, but only
            calibrated against a deliberately ineligible test set &mdash;
            Sreditor&rsquo;s own build &mdash; never yet against a genuinely
            eligible one.
          </p>
          <p>
            Not yet published. <code>npm publish</code> and tagging{" "}
            <code>v0.1.0</code>{" "}
            is the one remaining step &mdash; a live,
            externally-visible action deliberately held back pending
            sign-off, not a technical blocker.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader id="conclusion" title="CONCLUSION" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            This proves the core bet is buildable, not just plausible: a
            contemporaneous, developer-native SR&ED judgment loop that runs
            continuously rather than being reconstructed once a year,
            verified end to end against a real project&rsquo;s real build
            history &mdash; its own.
          </p>
          <p>
            The honest state is early but real. Not a mockup or a demo
            script &mdash; a working CLI that has made real, billed API calls
            against its own actual git and OpenSpec history, with a full
            test suite and green CI. Genuinely pre-1.0, single-adapter,
            single-jurisdiction, not yet calibrated against a real eligible
            project.
          </p>
          <p>
            The most credible evidence for the whole thesis might be an
            unglamorous one. Judged by its own standard, Sreditor found{" "}
            <em>itself</em>{" "}
            SR&ED-ineligible at every single phase tonight
            &mdash; including its hardest debugging work. That&rsquo;s the
            skeptical calibration the entire design bet on, holding up under
            the most self-interested test case available. Not a limitation
            to explain away &mdash; the point.
          </p>
          <p>
            Next: <code>npm publish</code>, tag <code>v0.1.0</code>.
          </p>
        </div>
      </section>
    </main>
  );
}
