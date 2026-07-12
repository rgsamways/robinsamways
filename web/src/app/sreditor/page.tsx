import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Sreditor · Robin Samways",
};

export default function SreditorPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Sreditor
      </h1>
      <p className="mt-2 text-sm text-muted">
        A CLI tool that judges SR&amp;ED tax-credit eligibility from a
        project&rsquo;s own OpenSpec change history, in near real time.
      </p>

      <section>
        <SectionHeader title="ORIGIN_STORY" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            I didn&rsquo;t set out to build a tax-credit tool. Early in
            building robinsamways.ca, I started keeping a plain markdown log
            &mdash; <code>docs/sreditor/</code>{" "}
            &mdash; every time I hit a genuine technical uncertainty and had
            to systematically work through it. Not because I had SR&amp;ED
            specifically in mind yet; it was just good practice for hard
            problems, worth writing down while I still remembered the actual
            sequence of not-knowing, investigating, and resolving.
          </p>
          <p>
            The habit paid off enough that I started paying attention to why
            it mattered. Canada&rsquo;s SR&amp;ED tax credit runs on a
            specific three-part test &mdash; a genuine technological
            uncertainty, a systematic investigation that resolved it, and a
            resulting technological advancement &mdash; assessed through Form
            T661 Part 2&rsquo;s three word-limited lines. Roughly 60% of
            audited claims get denied or substantially reduced, and the gap
            between an approved claim and a denied one is almost never the
            eligibility of the underlying work. It&rsquo;s the documentation.
            When a developer reconstructs this narrative months later, at
            filing time, they remember what they built, not what they
            didn&rsquo;t know going in &mdash; producing exactly the kind of
            product-description language and after-the-fact-assembled claim
            CRA&rsquo;s own denial statistics penalize.
          </p>
          <p>
            I already had the fix, informally: a contemporaneous log, kept as
            I actually hit uncertainty, not reconstructed later. The only
            real question was whether that discipline could be automated
            into something a solo developer would actually keep using,
            instead of abandoning it the way manual note-taking usually gets
            abandoned once a deadline hits. Sreditor is that automation
            &mdash; built for real, in its own repository, across one
            extended session, using the same propose &rarr; implement &rarr;
            verify &rarr; archive discipline it exists to document.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="PROBLEMS_SREDITOR_SOLVES" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>Manual note-taking gets abandoned.</strong>{" "}
            No structure, no CRA-shaped framing, and because it&rsquo;s a
            separate chore layered on top of actual work, inconsistently kept
            or dropped entirely once a deadline hits. Sreditor removes the
            separate-chore problem by judging each change automatically,
            right when it&rsquo;s archived &mdash; no extra discipline
            required beyond already using OpenSpec.
          </p>
          <p>
            <strong>Git history isn&rsquo;t SR&amp;ED-shaped.</strong>{" "}
            Commit messages are written for other developers &mdash; what
            changed, not what was uncertain or how it was systematically
            investigated. Sreditor reads{" "}
            <code>proposal.md</code>/<code>design.md</code>/<code>tasks.md</code>{" "}
            instead &mdash; structured reasoning a developer already writes
            at decision time, not reverse-engineered from commit diffs.
          </p>
          <p>
            <strong>
              Reconstruction at filing time is the most expensive and least
              reliable option.
            </strong>{" "}
            An accountant or SR&amp;ED consultant interviewing a developer
            months later reconstructs intent from memory, under time
            pressure &mdash; the exact failure mode behind CRA&rsquo;s own
            denial statistics, and the developer being interviewed has
            usually already forgotten the real sequence of events.
            Sreditor&rsquo;s judgment happens in near real time instead,
            while the sequence is still fresh.
          </p>
          <p>
            <strong>
              Generic project tooling &mdash; and the funded competitors
              built on top of it &mdash; are still reconstruction, just
              automated.
            </strong>{" "}
            Jira, Azure DevOps, timesheets track work, not scientific
            uncertainty; tickets describe features and tasks, not hypotheses
            and experiments. Mining tickets, commits, and timesheets after
            the fact &mdash; literally how the funded competitors in this
            space operate &mdash; doesn&rsquo;t fix the fact that it&rsquo;s
            still reconstruction. Sreditor judges contemporaneously instead
            of reconstructing anything.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="SRED_ELIGIBILITY_EXAMPLE" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Built across one extended session, in seven phases plus a
            corroborating-signals extension, each shipped through
            Sreditor&rsquo;s own required propose &rarr; implement &rarr;
            verify &rarr; archive loop &mdash; the same discipline a
            user&rsquo;s project goes through, applied to itself. As of the
            most recent count: 26 TypeScript source files, 1,222 non-blank
            lines of code, 52 passing tests across 12 test files. Every
            command works end to end against real Anthropic API calls, not
            fixtures &mdash; <code>init</code>, <code>reflect</code>,{" "}
            <code>judge</code>{" "}
            (with drift-auditing and corroborating signals),{" "}
            <code>rollup</code>{" "}
            (with a real pre-call cost estimate), <code>report</code>{" "}
            (T661-line-structured markdown with real word counts), plus{" "}
            <code>scan</code>, <code>status</code>, and <code>doctor</code>.
          </p>
          <p>
            Two real tests, not one. Judged against its own build first:
            Sreditor found <em>itself</em>{" "}
            SR&amp;ED-ineligible at every single phase &mdash; including its
            hardest debugging work. Then, judged against Farpost&rsquo;s
            real, unrelated OpenSpec history &mdash; 48 archived changes,
            roughly four times Sreditor&rsquo;s own build &mdash; it returned
            exactly one defensible claim. Not one easy win: a project rollup
            synthesized from three individually-ineligible changes (a
            dispatch/ranking abstraction built once around
            claim-to-contractor assignment, then proven to generalize to a
            structurally different inspection-to-inspector flow, surfacing
            and fixing three real hidden defects along the way). None of the
            three contributing changes cleared the bar judged on its own
            &mdash; two were rated &ldquo;not close,&rdquo; one &ldquo;some
            signal&rdquo; &mdash; the eligibility only became visible once
            rollup viewed them as one continuous investigation. Exactly one
            other change out of the full 48 registered above &ldquo;not
            close&rdquo; at all, and it still stayed out: the closest it came
            to a real technical question was resolved with a single
            empirical check, not a structured investigation, and
            CRA&rsquo;s test asks for the latter. A skeptical judge that
            clears almost nothing, twice, on two different projects &mdash;
            including work it has every real incentive to find eligible in
            &mdash; is the calibration the entire design bet on. Not a
            limitation to explain away &mdash; the point, twice over.
          </p>
          <p>
            Testing against a codebase four times Sreditor&rsquo;s own size
            also did what dogfooding alone couldn&rsquo;t: it broke things
            dogfooding never touched. Rollup failed outright against
            Farpost&rsquo;s mostly-ineligible 48-change log &mdash; first an
            opaque parse error, then a clean token-limit error once
            diagnosed &mdash; because the judgment prompt asked the model to
            enumerate every ineligible change into its own bucket, which
            blew the output ceiling at that scale; fixed by having code
            assemble that bucket instead of the model. Rollup&rsquo;s exact
            grouping also showed real run-to-run variance &mdash; an earlier
            run pulled a fourth, unrelated change into the dispatch
            narrative; the saved run kept it at three, same underlying
            story, a different boundary &mdash; worth stating plainly rather
            than implying the grouping is fully deterministic.
          </p>
          <p>
            Still rough, worth naming plainly: markdown-only report output,
            no PDF or CSV yet. A single source adapter &mdash; OpenSpec only
            &mdash; though the adapter interface is designed to be
            tool-agnostic. Canada&rsquo;s CRA SR&amp;ED program only, not a
            general international R&amp;D tax credit tool. The git-to-code
            correlation heuristic behind corroborating signals only sees a
            change&rsquo;s final archiving commit, not earlier implementation
            commits along the way. Not yet published &mdash;{" "}
            <code>npm publish</code>{" "}
            and tagging <code>v0.1.0</code>{" "}
            is the one remaining step, held back pending sign-off, not a
            technical blocker.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="PROCESS" />
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
            runs a one-time AI-assisted interview that drafts a
            developer-authored &ldquo;anchor&rdquo; document &mdash; goal,
            genuine uncertainty, success criteria; the AI only assists in
            framing, never invents content, and the document is append-only
            once saved. From there, build normally through OpenSpec&rsquo;s
            own propose &rarr; apply &rarr; archive loop.{" "}
            <code>sreditor judge</code>{" "}
            judges each newly-archived change against the three-part test,
            and separately compares it against the anchor for scope drift
            &mdash; a second, distinct model call, kept apart from the
            eligibility judgment specifically so one doesn&rsquo;t bias the
            other. <code>sreditor rollup</code>{" "}
            periodically groups the accumulated judgments into CRA-shaped
            &ldquo;projects,&rdquo; the level CRA actually wants a claim
            framed at &mdash; gated behind a real token-cost estimate first,
            since it&rsquo;s the one command that processes the whole
            accumulated log at once. <code>sreditor report</code>{" "}
            renders the rollup into T661-structured markdown, with real word
            counts checked against the 350/700/350 limits.
          </p>
          <p>
            A few decisions worth naming directly, the same discipline
            behind this site&rsquo;s own drift-audited build process: the
            two-layer judgment model (per-change judgment running
            continuously, rollup as the periodic filing-time synthesis step
            on top of an already-accumulated record) means the habit of
            thinking in SR&amp;ED terms forms during the build, not at the
            end of the year. Every judgment prompt lives in the repo as
            plain TypeScript, readable by a developer, their accountant, or
            a CRA reviewer, not hidden behind a platform &mdash;
            transparency is the actual trust mechanism, not a slogan. Every
            call runs against the developer&rsquo;s own Anthropic account at
            standard rates, no markup, no subscription &mdash; the direct
            structural reason a solo developer or a tiny CCPC is a market
            the funded, per-seat-priced competitors aren&rsquo;t built to
            serve. Three optional corroborating-signal tools can feed extra
            context into a judgment prompt if installed, but are
            structurally barred from ever determining eligibility on their
            own &mdash; the prompt is explicitly instructed to treat them as
            non-authoritative.
          </p>
        </div>
      </section>
    </main>
  );
}
