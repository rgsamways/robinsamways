# Handoff: give `sreditor judge` a live numbered task-list UI

**What this file is:** a self-contained handoff, written from inside the robinsamways.ca
repo, for whichever session works inside Sreditor's own repo (`c:\dev\sreditor`). It exists
here only because this session doesn't have an assigned role in Sreditor's own repo — read
access was used to investigate the actual code, but implementing this is Sreditor's own
session's job, ideally scoped through Sreditor's own OpenSpec process (it already has
`openspec/` and uses OpenSpec itself, per its own README). Once picked up, this file can be
deleted from wherever it landed.

## The observation that started this

Robin liked how Claude Code's own terminal UI shows a live, numbered task list — checkmarks
for done, a colored fill for the in-progress item, empty boxes for pending — while working
through a multi-step task. He asked whether Sreditor has anything like that, and thought it
should.

## What's actually there today

`sreditor judge` (`src/commands/judge.ts:60-90`) loops over every unjudged OpenSpec change
and, for each one, calls `spin()` (`src/cliUi.ts:30-50`) once or twice — a single spinner
line, printed and cleared one at a time, with the judgment results logged below it once
each item finishes. There's no persistent overview: running `judge` against a large archive
(Farpost's real archive is 48 changes, per prior Sreditor scale-testing) means watching 48+
individual spinner lines scroll past with no sense of "12 of 48 done, on 13 now."

The other commands that use `spin()` don't have the same shape: `doctor`
(`src/commands/doctor.ts`) runs a handful of checks synchronously and instantly — no real
async wait to animate, so a live progress list wouldn't add anything there. `rollup`
(`src/commands/rollup.ts:41,68`) only has 2 sequential `spin()` calls total (a cost
estimate, then the rollup build itself) — not a batch of N items, so it's a single-step
wait, not a list.

## The actual fix — a dependency Sreditor already has, just unused

`@clack/prompts` (already in `package.json`'s dependencies) exports a `tasks()` function —
confirmed directly in its own type definitions
(`node_modules/@clack/prompts/dist/index.d.mts:912-914`: "Define a group of tasks to be
executed," `tasks: (tasks: Task[], opts?: CommonOptions) => Promise<void>`). This is the
exact primitive for a numbered list of async steps with live status — no new dependency,
no custom terminal-UI code to write from scratch. It's simply never been used anywhere in
Sreditor's codebase yet; every current `@clack/prompts` usage (`cliUi.ts`, `init.ts`,
`probe.ts`, `reflect.ts`, `interview.ts`) is for other prompt types (spinners, interactive
input), not `tasks()`.

## Where this applies

`judge.ts`'s loop over `toJudge` (the array of unjudged `ChangeArtifact`s, built by
`selectChangesToJudge`) is the one real fit — swap the current per-item `spin()` calls for
a single `tasks()` call describing the whole batch, one task per artifact, so a run against
a large archive shows the same kind of live numbered/checkmarked overview Robin saw and
liked, instead of a scrolling list of individual spinners with no batch-level context.

## What this handoff deliberately doesn't decide

- The exact task title/label format per artifact, and whether the two-step nature of each
  item (judge, then optionally check drift) becomes one task or two in the list — a real UI
  design choice worth making with Sreditor's own conventions in mind, not dictated here.
- Whether to scope this as a full OpenSpec change in Sreditor's own repo (matching how that
  project already works) or a smaller direct fix — Sreditor's own session's call.
