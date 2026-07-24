# Core User model — a shared identity library across siloes

**What this file is:** a portable design document, same convention as `docs/design-system-handoff.md`. Its real audience is whichever session has write access to Farpost's and Vocare's actual repos. Unlike the first draft, this revision is grounded in real code read directly from both — `c:\dev\vocare\backend` and `c:\dev\farpost\farpost-api` — not secondhand description. Where something is still a proposal rather than confirmed, it says so explicitly.

**Scope:** answers `docs/standard-methodology.md` rule #4 for the *User* object. Doesn't design Farpost's `Stake` pattern in depth — it's already well-built; this doc just clarifies how it relates to the new Membership layer.

**Vocare is not a fixed constraint.** It's 3 days old as of this writing, and Robin has said he's happy to rewrite it however needed to make this idea land quickly. Read Vocare's current `additionalFields` (Layer 1) as one early data point worth knowing about, not a shape the shared design has to accommodate — if Layer 2/Layer 1 lands somewhere better, Vocare adopts it, not the other way around.

---

## Guiding principles

1. **Don't fight better-auth — extend it.** Confirmed in Vocare's real `auth.ts`: `additionalFields` is already the live mechanism for exactly this.
2. **Shared code, not shared runtime.** Each silo is a fully independent deploy with its own database (per `CLAUDE.md`'s Silo isolation). What's shared is a versioned library, not a shared database or auth session — matches Robin's own framing: "a core object library/classification."
3. **Fix the real bug, not the described one.** Farpost's actual duplication is `Professional.roles: list[str]` vs. the 10 per-role existence-documents (`Adjuster`, `Contractor`, ...) — two unsynchronized sources of truth for "does this person hold role X." `Stake.role` (per-relationship contextual role — e.g. "acting as adjuster on *this* building") is a legitimately different question and should stay a separate concept, not get folded in.
4. **Levels of abstraction, not one flat class.**

---

## The layers

### Layer 0 — better-auth core (framework-owned)

`user`/`session`/`account`/`verification`. Confirmed identical shape in Vocare's `src/db/auth-schema.ts` to what better-auth's Drizzle adapter generates by default. Not designed here.

### Layer 1 — the shared User shape: **thinner than first proposed, possibly empty for now**

The first draft guessed universal fields (`displayName`, `avatarUrl`, `timezone`, `locale`). Real evidence says otherwise: Vocare's actual `additionalFields` are `entitlementStatus`, `dateOfBirth`, `country`, `paidAt` (`src/auth/auth.ts`) — all billing/compliance-driven (Stripe is a real Vocare dependency), zero overlap with the guessed fields. There is currently **no confirmed universal field** across projects.

**Recommendation:** don't force a shared Layer 1 config yet. Let each project keep using better-auth's own `additionalFields` directly, undecorated. Revisit once Farpost's rebuild actually needs fields and a real second data point exists to compare against Vocare's.

**Entitlement/billing — checked against real Farpost strategy docs, resolved as "not Layer 1, maybe Layer 2":** Farpost's Stripe Connect flow bills a *requestor* a per-job fee — not individual-user billing, confirming the Farpost session's first read. But `docs/strategy-and-competitive/farpost-revenue-by-role.md` (real, dated 2026-06-22) describes an actual planned freemium model: **the base platform stays free for everyone, always** ("Farpost documents, it does not evaluate" / "notifies, it does not gate" — structural, not a growth tactic), with paid tiers layered on top **per role** — an adjuster's paid tier is a different tool than a contractor's, priced differently (per-seat, per-listing, carrier contract). That's a materially different shape than Vocare's single global `entitlementStatus` flag: Farpost's entitlement is *per-Membership* (which role, which tier), not *per-User*. If this pattern gets built, it likely belongs as a Layer-2-adjacent concept — a `tier`/`entitlement` field living alongside a `membership` row (or in its `metadata` jsonb, or a dedicated table keyed on `membership.id` the same way Layer 3 profile tables are) — not a Layer 1 addition to the User itself. Not designing this further now: the revenue-tier work is explicitly sequenced behind other unbuilt Farpost prerequisites ("none of these get built before the role's core platform relationship actually works") and has no pricing numbers yet — premature to lock in a shape.

**A note on scope:** there may end up being no shared Layer 1 at all — just Layer 0 (better-auth) directly, Layer 2 (Membership) for role, and a per-Membership entitlement concept nested inside Layer 2's territory rather than a separate layer. Worth letting the layer count settle once Farpost's rebuild produces a second real data point, rather than forcing today's guess to stay a permanent 4-layer model.

### Layer 2 — Membership: the fix for the real bug

Answers "what can this person generically do on this platform" — replacing `Professional.roles` + the 10 per-role existence-documents with one table, one source of truth per role held.

```ts
// @rsw/core-identity/src/membership.ts
import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export function membershipTable(tableName: string) {
  return pgTable(tableName, {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(), // matches better-auth's user.id — confirmed `text` in Vocare's real schema
    role: text("role").notNull(), // plain string at the shared-package level — see below
    status: text("status", { enum: ["active", "suspended", "revoked"] })
      .notNull()
      .default("active"),
    grantedAt: timestamp("granted_at").notNull().defaultNow(),
    revokedAt: timestamp("revoked_at"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  });
}

// Each project narrows this at its own boundary — a fixed union for a
// small/simple project, or validation against a real role-taxonomy table
// (Farpost's RoleType) for one that needs runtime-editable roles.
export type Membership<TRole extends string = string> = {
  id: string;
  userId: string;
  role: TRole;
  status: "active" | "suspended" | "revoked";
  grantedAt: Date;
  revokedAt: Date | null;
  metadata: Record<string, unknown> | null;
};
```

**Role-taxonomy fork — resolved.** Farpost's `RoleType` runtime-editable taxonomy isn't hypothetical: the platform spec documents the role catalog actually growing from 8 core roles (as of a past milestone) to the current 10 when `accountant`, `space_coordinator`, and `home_stager` were added later — a real historical instance, not a theoretical future need. Collapsing that to a fixed compile-time union would repeat the exact mistake tonight's whole retrospective is about. **Decision: `role` is plain `text` at the shared-package level, unconstrained by any enum.** Each consuming project layers its own validation at its own boundary — Farpost validates against its real `RoleType` table; a project with a genuinely small fixed role set can still narrow `Membership<TRole>`'s generic for compile-time safety on top, without forcing that constraint into the shared schema.

**Why the taxonomy was runtime-editable — confirmed deliberate, and it clarifies the real requirement.** Per Robin directly: the goal was letting a new user build a Farpost profile under a real-life role the platform hadn't explicitly scoped yet (his example: a home security professional) — someone whose work plausibly relates to building intelligence even though Farpost hadn't built dedicated tooling for that role. That's a legitimate, deliberate goal. But Robin is explicitly not attached to *how* Farpost solved it (a full admin-curated `RoleType` collection with `tier`/`status`/promotion workflow) — if something simpler achieves the same goal, he'd rather scrap the curation machinery than keep it out of inertia.

It does — and the `role: text` decision above already does most of the work. The actual requirement is just "a user can be assigned a role string the platform hasn't built dedicated support for yet," and unconstrained `text` already permits that with zero extra machinery — no lookup table, no admin curation, no promotion workflow required. **Recommendation: don't put the curation/promotion apparatus (tiers, status, curator sign-off) in the shared package at all.** If Farpost specifically still wants moderation — catching spam, merging near-duplicate self-reported labels ("Home Security Pro" vs. "home security professional") — that's a legitimate *Farpost-specific* extension, built the same way Layer 3's profile tables are: on top of the shared `Membership.role` string, not baked into it. Vocare or a future silo that never needs curation shouldn't have to carry that weight.

One alternative Robin floated — an extensive predefined list of real-world roles/careers/vocations (something like Statistics Canada's NOC or the US O*NET-SOC taxonomy) instead of free text — is legitimate if he wants that rigor, and would tie in narratively with the StatCan familiarity already showing up elsewhere in this project (`docs/lightbulbs/rsw-lb-rural-demographics-api.md`). My honest take: probably more scope than the actual need justifies right now — those taxonomies run to hundreds or thousands of categories mostly irrelevant to building-intelligence work, and importing one just to constrain a text field trades a small, real problem for a much bigger mapping/maintenance one. Free text plus an optional Farpost-specific curation layer solves the stated goal with far less machinery. Worth revisiting only if moderation/spam on self-reported roles turns out to be a real problem in practice.

**Organization/Admin plugins — recommend forgetting them, not just skipping.** Neither fits anything either project needs today: no siloed-workspace/tenant concept anywhere in Farpost's or Vocare's real code, and the richer `Membership` pattern above already covers what Admin's single global role field would do. The one condition that would make this worth reopening: a future silo that's genuinely multi-tenant in the SaaS sense (users belonging to separate companies/workspaces, not just holding platform-wide roles) — Organization plugin would fit *that* shape well. Not a real prospect for Farpost or Vocare as they exist now, so treating this as closed rather than tracking it as an open item.

### Layer 3 — per-role profile tables (project-specific, not shared)

Farpost's `Adjuster` document (`brokerage`, `office`, `region`) is exactly this — but currently keyed on `professional_id` (a slug *string*) with no real reference, the actual referential-integrity smell. The fix: key on the new Membership row's real primary key instead of a slug string.

```ts
// Farpost's own schema, NOT in the shared package
export const professionalProfile = pgTable("professional_profile", {
  membershipId: text("membership_id").notNull().references(() => membership.id),
  brokerage: text("brokerage"),
  office: text("office"),
  region: text("region"),
});
```

### Layer 4 — Stake (already exists, stays distinct — not redundant with Membership)

Farpost's real `Stake` document (`app/models/stake.py`) is already a well-designed generic person↔subject pattern: `user_id`, `subject_type`/`subject_slug` (polymorphic — property/building/asset), `role`, `kind`, `status`, plus verification/temporal fields. It answers a genuinely different question than Membership: not "what can this person generically do" but "what is this person's relationship to *this specific* building/property/claim, and what role are they playing in it." Someone could hold a `professional` Membership platform-wide while their Stake role differs per property.

**Recommendation:** keep Stake as-is conceptually; don't merge it into Membership. The one connective-tissue question worth deciding: should `Stake.role` and `Membership.role` be validated against the *same* role vocabulary (whichever fork Layer 2 lands on), so there's one shared list of valid role strings even though two tables answer two different questions about them? Leaning yes, not designed in detail here.

---

## Distribution mechanism — resolved

Vocare already proves the *tooling* works — `@vocare/shared` is a real npm-workspace package inside Vocare's own monorepo. But siloes are polyrepo (separate GitHub remotes), so a package shared *across* Farpost and Vocare needs to leave that monorepo-only pattern. **Decision: a git dependency** — `"@rsw/core-identity": "github:robinsamways/core-identity#v0.1"` in each consumer's `package.json`. Free, versioned, no registry to pay for or maintain, appropriate for a 2-3-project one-developer scale — and avoids quietly recreating the exact "two copies that can silently drift apart" problem this whole design effort exists to fix. A published private npm package or a vendored copy were the alternatives; both rejected (former is paid infra this doesn't need yet, latter reintroduces drift).

One real mechanic to work out when this actually gets built: consuming TS source via a git dependency without a build step needs either committed `dist/` output in that repo, or each consumer building it themselves post-install. Not designed here.

---

## Remaining open items

1. ~~Entitlement/tier shape~~ — now designed, see `docs/core-billing-model.md`: an entitlement is a derived check against that doc's `Subscription`/`CreditPack` patterns, not a stored field on `User`/`Membership`.
2. Whether Farpost wants to keep any project-specific role-curation layer on top of `Membership.role` (spam/near-duplicate moderation) — optional, not required by the shared pattern, Farpost's own call whenever it's relevant.

Everything else above is either confirmed against real code, resolved by Robin directly, or clearly marked as still a proposal. The role-taxonomy fork, the Organization/Admin-plugin question, the distribution mechanism, and the entitlement/Layer-1 question are all closed as of this revision.
