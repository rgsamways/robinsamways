## Context

`/dev-log` (`web/src/app/dev-log/page.tsx`) is currently a server component rendering four fixed `<section>` blocks in order (Glossary, Testing & Verification, Metrics, Bug Log), each backed by its own data module in `web/src/components/dev-log/` (`glossary.ts`, `bugLog.ts`, `metrics.ts`). There is no page-local navigation — the anchor-link local menu that `dev-log-content` originally specified was removed by `page-chrome-simplification` in favor of a simpler page chrome; this change does not resurrect that anchor menu, it adds a different, pill-based mechanism.

`docs/farpost-devlog-handoff-robinsamways.md` holds the source material: one finished, approved entry (the template) and nine more as context notes + real verified code only. It was written by a Claude session in the separate Farpost repo, blind to this site's actual component conventions, so its formatting prescriptions (inline `<style>` block, hand-tokenized syntax-highlighting spans, red/green bordered callout `<div>`s) are a proposal from that isolated context, not a constraint this site is bound to honor.

`/techstacks` already has the exact interaction pattern Robin wants for the new nav: `TechStacksBrowser.tsx` (client component owning `activeTags` state) + `filterProjects.ts` (pure, unit-tested filter function) + a pill row using `aria-pressed` and `role="group"`.

## Goals / Non-Goals

**Goals:**
- Add all 10 Code Showcase entries as real, permanent site content, not a stub or a subset.
- Add a pill filter bar to `/dev-log` that toggles visibility of its five sections, matching `/techstacks`' pill look and interaction model.
- Keep `/dev-log` visually and structurally consistent with itself — one code-block style, one "here's the technical detail / here's why it matters" grammar — rather than importing a second visual system alongside the existing one.

**Non-Goals:**
- Tag-based filtering of individual entries *within* a section (e.g. filtering Code Showcase entries by "Stripe" or "async"). The ask is section-level filtering, mirroring how `/techstacks` filters projects — here the "projects" being filtered are the sections themselves.
- Restoring the old anchor-link local menu design from the original `dev-log-content` spec — the pill bar replaces that need going forward.
- Any change to the global hamburger menu (`site-navigation`) or to `/techstacks` itself, beyond the pattern being referenced.
- Deleting `docs/farpost-devlog-handoff-robinsamways.md` from the Farpost repo (out of scope: different repo).

## Decisions

**1. Reuse Bug Log's existing subsection grammar for "the fix" / "why this matters," instead of the handoff's red/green callout boxes.**
Bug Log entries already render a title + date kicker, then labeled subsections ("The bug", "The concept") in `text-accent`, each holding one or more paragraphs. Code Showcase entries need the same shape — kicker, title, framing paragraphs, then two more labeled subsections ("The fix", "Why this matters"). Introducing a second visual language (bordered color-coded callout boxes) for content that sits directly below Bug Log on the same page would read as inconsistent, and the handoff's own colors (Catppuccin-derived hex values) don't correspond to anything in this site's `globals.css` theme tokens. Alternative considered: build the red/green callouts as new components matching the handoff exactly — rejected, since it duplicates a "here's a label, here's the explanation" pattern that already exists one section up, for no reader-facing benefit.

**2. Relocate `CodeBlock` out of `components/ops/` into a shared location; keep it plain (no syntax highlighting).**
The existing `web/src/components/ops/CodeBlock.tsx` is a 7-line `<pre><code>` wrapper with no highlighting, currently used only by `/ops/deploy`. Code Showcase needs the same thing for ~11 code blocks (10 entries + Entry 1's two blocks). Rather than duplicate it under `components/dev-log/` or hand-roll the handoff's manual `tok-kw`/`tok-str`/`tok-fn` span-per-token markup (which would mean writing, by hand, colored spans for every keyword/string/number in ~11 Python snippets — a direct DRYness/duplication cost `CLAUDE.md`'s `scc` tracking exists to catch), move `CodeBlock` to a shared, non-page-specific path (e.g. `web/src/components/CodeBlock.tsx`) and import it from both `/ops/deploy` and the new Code Showcase component. Alternative considered: leave `CodeBlock` where it is and import `components/ops/CodeBlock` directly from `components/dev-log/` — rejected as a smaller diff but a worse-named dependency (a dev-log component depending on something under an `ops`-specific folder reads as an architectural accident, not an intentional shared utility).

**3. Code Showcase entries are typed data in `codeShowcase.ts`, code stored as plain strings.**
Mirrors `bugLog.ts`'s existing `BugLogEntry[]` pattern exactly: a typed array, each entry holding `project`, `category`, `date` (for the kicker), `title`, `framing: string[]`, `codeBlocks: { language: string; code: string }[]`, `theFix: string[]`, `whyThisMatters: string[]`. Plain code strings (not JSX, not pre-tokenized markup) keep the data file readable and the rendering component trivial (`CodeBlock` + `<pre>`-preserved whitespace), consistent with decision 2.

**4. Section filtering is a pill bar over five fixed section identifiers, not a generic tag system.**
`filterSections.ts` exports a pure function `filterSections(sections, activeIds)` — given the five section descriptors and the current active-pill-id set, returns which are visible, with the same "empty selection = show all" default `filterProjects.ts` already establishes for `/techstacks`. `page.tsx` stays a server component: it builds the five section bodies as JSX and hands them, labeled, to a new client component (e.g. `DevLogSectionFilter.tsx`) that owns `activeIds` state, renders the pill row, and conditionally renders each passed-in section node. This is the same "server component renders content, client component owns interactive chrome around it" split already used elsewhere on this page (`MetricsDashboard` is already a client component receiving server-parsed data).

**5. All 10 entries ship in this change; the handoff's optional 11th/12th are explicitly deferred.**
The handoff lists two more (inspector capacity leak, a Beanie/pytest-asyncio event-loop footgun) as "optional, if more than 10 are wanted." This change scopes to exactly the 10 required entries — the optional two are not silently dropped, they're a named, deferred option a future change could pick up.

## Risks / Trade-offs

- **[Risk]** Writing real, accurate framing prose and callouts for 9 entries from context notes (not copy-pasted) risks drifting from what actually happened in the Farpost code, since this session has no direct access to the Farpost repo. → **Mitigation**: the handoff states every code excerpt is already verified accurate and complete; framing prose only needs to explain that code faithfully, and file paths are given if anything needs a source-of-truth check.
- **[Risk]** Moving `CodeBlock` out of `components/ops/` touches an existing page (`/ops/deploy`) that isn't otherwise part of this change's scope. → **Mitigation**: it's a pure relocation (same component, same props, one import path updated) with no behavior change to `/ops/deploy`; existing e2e/visual coverage of that page (if any) is unaffected.
- **[Risk]** A pill bar that hides sections outright (rather than filtering a list within a section) is a different interaction than `/techstacks`' filter, despite the shared visual style — a visitor could read the pills as "categories of entries" rather than "sections to show/hide." → **Mitigation**: pill labels are the section titles themselves (Glossary, Testing & Verification, Metrics, Bug Log, Code Showcase), not abstract tags, so the mapping from pill to what disappears/reappears is direct and unambiguous.

## Open Questions

None outstanding — flag during implementation if the handoff's file-path references (e.g. `farpost-api/app/services/work_request.py:127-197`) turn out to matter for verification; the handoff itself says checking them against live source is a nice-to-have, not a requirement.
