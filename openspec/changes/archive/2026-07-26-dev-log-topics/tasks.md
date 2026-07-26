## 1. Data model

- [x] 1.1 Add `topic: string` to the `CodeShowcaseEntry` type in `web/src/components/dev-log/codeShowcase.ts`.
- [x] 1.2 Assign a `topic` to each of the 12 existing entries per design.md's mapping table (all 12 map to `Engineering`).
- [x] 1.3 Insert all 11 new entries from design.md's "Final Copy" section verbatim — do not rewrite the prose, split each `framing`/`theFix`/`whyThisMatters` array exactly as shown.
- [x] 1.4 Confirm the final count: 23 entries, 13 `Engineering`, 4 `Process & Verification`, 3 `Architecture & Stack Decisions`, 2 `Business Model`, 1 `Human Factors`.

## 2. Hub page topic filter

- [x] 2.1 Build `web/src/components/dev-log/TopicFilter.tsx` — single-select pill bar (5 topic pills + "All"), matching `FarpostTabBar`'s existing active-state styling pattern.
- [x] 2.2 Wire `web/src/app/dev-log/page.tsx` to render the filter and show only entries matching the selected topic (or all, when "All" is selected/on initial load), most recent first.
- [x] 2.3 Confirm entry count per topic pill matches task 1.4's numbers once wired up.

## 3. Left-nav submenu cap

- [x] 3.1 In `DrawerNav.tsx`'s Dev Log submenu, cap the listed entries to the 5 most recent by `publishedAtUtc` (reuse the same sort already used on the hub page), followed by a "View All" link to `/dev-log`.
- [x] 3.2 Confirm the "fewer than 5 entries exist" case still lists everything without an empty or broken "View All" state (not reachable today, but keep the logic correct for completeness).

## 4. Lightbulb graduation notes

- [x] 4.1 Add a one-line pointer note to each of the 8 lightbulb files whose content shipped as a new entry (per design.md's mapping), per this project's existing lightbulb-graduation convention.
- [x] 4.2 Add a note to `docs/lightbulbs/rsw-lb-ru-throughput-dev-log-entry.md` that its content was already independently fulfilled by the existing `cosmos-db-shared-throughput` entry, not by this change.

## 5. Test coverage

- [x] 5.1 Vitest coverage for `TopicFilter`'s selection/filtering logic (selecting a topic, selecting "All," an entry with no topic match shows nothing).
- [x] 5.2 Vitest or a small unit test confirming the left-nav cap logic returns exactly 5 most-recent entries when more than 5 exist, and all of them when fewer than 5 exist.
- [x] 5.3 Playwright coverage: `/dev-log`'s topic pills actually filter the visible list; the left-nav Dev Log submenu shows 5 entries plus a working "View All" link.
- [x] 5.4 Confirm existing Dev Log e2e coverage (entry routes, timestamps) still passes unchanged — this change doesn't touch individual entry pages.

## 6. Pre-archive verification

- [x] 6.1 Full Vitest + Playwright suite green, `npm run build` clean.
- [x] 6.2 Check the new entries' rendered pages for the JSX whitespace-glue bug this project has hit repeatedly on new content — a real headless-render text-extraction check, not just a source read.
- [x] 6.3 Drift audit: every requirement/scenario in the updated `dev-log-content` and `site-navigation` deltas checked against the real implementation.
- [x] 6.4 Run `scc --dryness --exclude-dir .git,.hg,.svn,node_modules,.venv,raw web/src api pieces`, log the snapshot to both `docs/metrics.md` and `web/src/data/metrics.json` with a one-line delta from the previous snapshot.
- [x] 6.5 Log the resolution in `docs/issues.md` per the handoff-logging convention.
