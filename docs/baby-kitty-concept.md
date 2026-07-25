# Baby Kitty — Calendar App Concept

## Origin
Idea sparked by a friend's girlfriend's situation: juggling a work calendar, a shared-custody calendar with a former spouse, and a school schedule (possibly), with no good way to see them together. Named "Baby Kitty" after the daughter's cat.

## The Gap in Existing Tools
Two buckets currently exist in the market:
1. **Sync/aggregation tools** (OneCal, CalendarBridge, SyncThemCalendars) — merge multiple calendar feeds into one view, prevent double-booking. Stop at "here's everything in one place."
2. **AI planning layers** (Motion, Morgen, Pocket Informant) — add time-blocking or analytics on top of a *single* calendar.

Neither addresses reconciling schedules across parties you don't fully control (a co-parent, a school, an employer).

Dedicated co-parenting apps (OurFamilyWizard, 2Houses, AppClose, Cozi) exist but are built primarily as legal/documentation tools for high-conflict custody situations — expense tracking, message logging, court-admissible records — with calendar as a secondary feature. They're overbuilt and unpleasant for the much larger population of people whose calendar-juggling isn't adversarial, just uncoordinated.

## Differentiators Considered (later-stage ideas, not v1)
- **Friction/conflict detection** between calendars, not just merged display
- **Cross-party negotiation** — generate a message to the other party when a conflict arises, rather than just showing a colored block
- **Household-as-unit** model instead of person-as-unit (shared views for co-parents, role-based permissions)
- **Source-provenance tracking** — visible chain showing where an event originated and when it last changed, for trust in schedule changes

## Core Principle (settled)
**Helping people arrange multiple calendars into something that helps them get organized.**

This reframes the app: multiple calendar sources are an *input*, not the output. The product isn't a merged grid — it's an answer to "what do I actually need to know or do right now."

## Scope Decision
"Getting organized" = **not double-booking yourself** (the simpler, lower-anxiety use case), rather than the higher-anxiety custody-certainty use case (e.g., "did the handoff happen," "is there a conflict coming").

### v1 scope
- Literal time-overlap conflict detection only

### v2 goal (design-aware from day one)
- Buffer/travel-time conflicts — not just overlapping time blocks, but functional double-booking (e.g., no time to travel between two locations, no buffer before a pickup)
- v1's data model and event handling should anticipate this (location, duration certainty, etc.) so v2 isn't a rewrite

## Context
- Robin is currently working across multiple projects in parallel: Farpost, a robinsamways.ca overhaul, and this new idea.
- The robinsamways.ca overhaul includes developing an "all projects are built this way" concept — a shared framework intended to also apply to a Farpost rebuild and a slight modification to Vocare.
- Design work for Baby Kitty is intentionally being held off for now.
