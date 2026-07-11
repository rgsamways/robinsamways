# rsw-lb-sreditor-tool-integration-bugs

**Slug:** rsw-lb-sreditor-tool-integration-bugs
**Date logged:** 2026-07-11
**Status:** unscoped — idea captured, not yet spec'd
**Related:** `docs/lightbulbs/rsw-lb-ru-throughput-dev-log-entry.md` (the bug-log format this would extend), `openspec/changes/dev-log-content/` (already mid-build with 2 entries when this was captured)

## The gap

Building Sreditor tonight (in its own separate repo) surfaced three real, sequential bugs while implementing its corroborating-signals feature: a Windows `.cmd`-shim command-injection risk (fixed via `cross-spawn`), silent ANSI color codes leaking into an AI prompt (fixed via a real `--no-colors` flag), and a silent `ENOBUFS` failure on large output that would have quietly degraded signal quality (fixed by raising a buffer limit). Robin ran these through Sreditor's own judgment engine and got a clear answer: not SR&ED-eligible (well-documented, single-solution fixes, not genuine technological uncertainty) — but that's a different bar than "good Dev Log material." Three distinct, real, root-caused bugs with concrete fixes is exactly the shape of the two entries already live from tonight's Farpost Pulse deployment work.

## The idea

A third bug-log entry for `/dev-log`'s bug-log section: the `cross-spawn`/ANSI-leak/`ENOBUFS` debugging story from building Sreditor's corroborating-signals feature. Same format as the existing two — a real bug, the underlying concept it reveals (platform-specific shell-invocation risk, subprocess output isn't always clean, silent buffer-size failures), written for a developer reader.

Worth noting explicitly in the entry: this bug was found and judged *not* SR&ED-eligible by Sreditor's own skeptical standard, applied to its own build — a nice bit of self-reference (the tool that draws the SR&ED line correctly drew it against its own best debugging work).

## Why it matters beyond convenience

- The bug-log section was explicitly designed to hold more entries without restructuring — this is exactly that, arriving almost immediately after the section shipped.
- A cross-project entry (Sreditor's own repo, not robinsamways.ca or Farpost Pulse) shows the practice isn't specific to one codebase — it's a genuine habit, not a one-time feature of this site.
- The self-judgment angle (Sreditor correctly ruling out its own hardest debugging work) is a strong, concrete demonstration of the tool's actual rigor — more credible than any marketing claim about it.

## Open questions

- Timing: build now (dev-log-content's bug-log section already supports it structurally) or batch it with whatever comes out of the Sreditor Method page work, since both draw from the same session's material?
- Exact wording — first-pass draft acceptable when it's built, same pattern as everything else in this section.
