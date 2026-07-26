## Why

Dev Log is about to grow from 12 entries to 23 — the 11 new ones drafted this session, on top of what's already live — and it has no grouping mechanism anywhere. The `/dev-log` hub already lists every entry flat, most recent first; at 23+ entries that's a long scroll with no way to find "just the engineering bug stories" or "just the process/AI-collaboration ones." Worse, `DrawerNav`'s left-nav Dev Log submenu currently enumerates every entry by title directly in the sitewide nav tree (per `site-navigation`'s existing "Writing group's Dev Log entry" requirement) — that was fine at 12 short-ish titles, but doesn't scale the way Farpost/Vocare/Sreditor's *fixed*, 10-item project-record submenus do, because Dev Log is an unbounded, growing stream, not a stable page set.

## What Changes

- Add a `topic` field to `CodeShowcaseEntry`, one level above the existing `category` field. Five topics cover everything that exists today: **Engineering**, **Process & Verification**, **Architecture & Stack Decisions**, **Business Model**, **Human Factors**. Every existing entry gets a topic assigned (mapped from its current `category`); no existing entry's `category`, code, or prose changes.
- Add 11 new entries to `CODE_SHOWCASE_ENTRIES` (final copy for all 11 is in this change's `design.md`): 3 about this project's own AI-assisted development process (a "minor" UI change's real scope, the same source material producing different prose twice, a drift audit that didn't fully self-verify), and 8 drawn from existing `docs/lightbulbs/*-dev-log-entry.md` files (AI-interview format mismatch, cross-project billing-model convergence, the Fastify-vs-Express decision, the golden-path/Backstage parallel, the own-stack-discovery story, Farpost's role-modeled-twice design lesson, this site's own testing/verification practice, Vocare's three-prices-in-three-days pricing history). A ninth lightbulb, `rsw-lb-ru-throughput-dev-log-entry.md`, is **not** drafted — its content is already published as the existing `cosmos-db-shared-throughput` entry.
- `/dev-log`'s hub page gains a single-select topic pill bar (reusing this site's existing pill/tab pattern) filtering the entry list to one topic at a time, with an "All" option as the default/reset state.
- `DrawerNav`'s Dev Log submenu caps at the 5 most recent entries by `publishedAtUtc`, plus a trailing "View All" link to `/dev-log` — replacing "every entry, most recent first."

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `dev-log-content`: entries gain a `topic` field; the hub page gains topic-based filtering; 11 new entries are added (10 existing + these 11 = 23 total, minus the confirmed-already-published `ru-throughput` lightbulb, which stays uncounted as new).
- `site-navigation`: the "Writing group's Dev Log entry links to a collapsible submenu of Dev Log pages" requirement changes from listing every entry to listing the 5 most recent plus a "View All" link.

## Impact

- `web/src/components/dev-log/codeShowcase.ts` — `CodeShowcaseEntry` type gains `topic`; every existing entry gets one assigned; 11 new entries appended.
- `web/src/app/dev-log/page.tsx` — gains a topic pill filter component and filtered rendering.
- New component, e.g. `web/src/components/dev-log/TopicFilter.tsx` — single-select pill bar, matching `FarpostTabBar`'s existing pattern.
- `web/src/components/DrawerNav.tsx` — Dev Log submenu logic changes from "all entries" to "5 most recent + View All."
- `docs/lightbulbs/rsw-lb-*-dev-log-entry.md` (8 of the 9) — each gets a pointer note added once its content ships, per this project's existing lightbulb-graduation convention; `rsw-lb-ru-throughput-dev-log-entry.md` gets a note that it was already fulfilled independently.
- Test coverage: Vitest for the topic-filter component's filtering logic and the nav-cap logic; Playwright coverage for the hub page's topic pills and the nav submenu's cap + "View All" link.
