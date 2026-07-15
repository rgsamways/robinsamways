# Handoff: Farpost dev-log entries for robinsamways.ca

**What this file is:** a self-contained handoff, written during a Farpost work session
(2026-07-15), for a *different* project — Robin's personal portfolio/dev-log site at
robinsamways.ca. It is not Farpost documentation and has no bearing on Farpost's own
specs, architecture, or build sequence. It exists at the Farpost repo root only because
that's where it was easiest to write it down; it should be picked up by a Claude Code
session working *inside* the robinsamways.ca project, and can be deleted from this repo
once that's done.

**How to use this file, if you are that future session:** read this whole file before
writing anything. It contains everything needed to write 10 HTML dev-log entries
showcasing interesting code from Farpost — verified real code (not paraphrased or
guessed), one fully-written reference entry to match the style of, and raw
material (context notes + code) for the other nine. You do not need access to the
Farpost repo to do this — every code excerpt below is already accurate and complete
for what each entry needs. If you want to double check something against the live
source anyway, the file paths are given, but that's a nice-to-have, not a requirement.

## The goal

Produce 10 HTML dev-log entries for robinsamways.ca, each showcasing one genuinely
interesting piece of code from the Farpost project (a rural-Ontario property /
professional-network platform Robin has been building solo, working with Claude across
both a "Chat" planning role and a "CLI" (Claude Code) building role).

**Audience is deliberately dual:** a developer reading this should see real engineering
judgment (not just "here's a function"). A recruiter or hiring manager who isn't
deeply technical should still come away thinking "this person clearly knows what
they're doing" — the "why this matters" framing at the end of each entry is doing that
translation work on purpose. Don't drop it or treat it as filler.

## Format rules — Entry 1 below is the approved template. Match its shape exactly.

Confirmed with Robin already, do not re-derive or change without asking:
- **Self-contained HTML, no JS dependency.** robinsamways.ca's syntax-highlighter
  situation is unconfirmed, so don't assume Prism.js/highlight.js is loaded. Manual
  color spans via CSS classes, defined once in a shared `<style>` block.
- **Shape per entry:** kicker line (`project · category · date`) → title → 1-2
  plain-language framing paragraphs a non-engineer can follow → the real annotated
  code block(s) → a red-bordered "The fix" callout (technical specifics) → a
  green-bordered "Why this matters" callout (translates the fix into a named
  competency: root-cause diagnosis, judgment under ambiguity, defensive design,
  verification discipline, etc. — this is the recruiter-facing payoff line, don't
  skip it).
- The shared `<style>` block only needs to appear **once per page**, not once per
  entry, even though it's shown again in Entry 1 below for completeness.
- Write real framing prose and callouts for entries 2-10 the way Entry 1 does —
  don't just paste the raw code + context notes as-is. The context notes given for
  entries 2-10 are raw material for you to write from, not finished copy.

---

## Entry 1 — DONE. Use as the template; paste this HTML as-is, do not rewrite it.

```html
<style>
.devlog-entry { font-family: -apple-system, sans-serif; max-width: 760px; margin: 2rem auto; }
.devlog-entry h3 { font-size: 1.4rem; margin-bottom: 0.25rem; }
.devlog-entry .devlog-kicker { color: #888; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.devlog-entry p { line-height: 1.6; color: #333; }
.devlog-code {
  background: #1e1e2e; color: #cdd6f4; border-radius: 8px; padding: 1.25rem 1.5rem;
  overflow-x: auto; font-family: "SF Mono", Consolas, monospace; font-size: 0.85rem; line-height: 1.55;
  margin: 1rem 0;
}
.devlog-code .ln { color: #585b70; margin-right: 1rem; user-select: none; }
.tok-kw  { color: #cba6f7; }  /* keywords: async, def, if, for, return, except */
.tok-str { color: #a6e3a1; }  /* strings */
.tok-com { color: #6c7086; font-style: italic; } /* comments / docstrings */
.tok-fn  { color: #89b4fa; }  /* function/class names */
.tok-num { color: #fab387; }  /* numbers */
.devlog-callout {
  border-left: 3px solid #f38ba8; background: #fdf1f4; padding: 0.75rem 1.25rem;
  border-radius: 0 6px 6px 0; margin: 1rem 0;
}
.devlog-callout strong { color: #d20f39; }
.devlog-why {
  border-left: 3px solid #40a02b; background: #f2f9ef; padding: 0.75rem 1.25rem;
  border-radius: 0 6px 6px 0; margin: 1.5rem 0 0;
}
</style>

<div class="devlog-entry">
  <div class="devlog-kicker">Farpost &middot; Data Ingestion &middot; 2026-07-15</div>
  <h3>The Bug That Silently Ate 2,706 Records</h3>

  <p>
    I was loading 31,152 real civic addresses into a MongoDB collection, in batches, for
    performance — one round-trip per record was too slow against the dataset size. Each
    building gets a human-readable <code>slug</code> (e.g. <code>136-spence-rd-carl-civic</code>),
    generated by checking the database for anything already using that slug and appending
    <code>-2</code>, <code>-3</code>, etc. on a collision.
  </p>

  <p>
    That check has a blind spot: it only sees what's already <em>committed</em> to the
    database. Two addresses distinguished only by a house-number suffix
    — <code>136A Spence Rd</code> and <code>136B Spence Rd</code> — landed in the same
    unflushed batch. Neither was in the database yet, so both passed the uniqueness check
    and were assigned the identical slug. The second one failed at insert time with a
    duplicate-key error — which looked exactly like the expected, harmless case of
    re-running the pipeline against data it had already loaded. My error handling treated
    every duplicate-key error the same way: swallow it and move on. 2,706 real addresses
    quietly vanished before anyone noticed.
  </p>

  <div class="devlog-code"><pre><span class="ln"> 1</span><span class="tok-kw">async def</span> <span class="tok-fn">_generate_building_slug</span>(record: dict, assigned_slugs: <span class="tok-fn">set</span>[str]) -&gt; str:
<span class="ln"> 2</span>    <span class="tok-com">"""assigned_slugs tracks every slug handed out so far *this run*, checked in
<span class="ln"> 3</span>    addition to the DB. Without it, two records sharing house_no+rd_name+municipality
<span class="ln"> 4</span>    (distinguished only by house_suf/rd_dir/unit — e.g. 136A vs 136B Spence Rd) that
<span class="ln"> 5</span>    land in the same unflushed batch both pass the `await Building.find_one` check
<span class="ln"> 6</span>    (neither is in the DB yet) and get assigned the same base slug; the second then
<span class="ln"> 7</span>    fails at flush time with a duplicate-key error on the slug index, which looked
<span class="ln"> 8</span>    identical to an expected re-run duplicate and was silently swallowed — silently
<span class="ln"> 9</span>    dropping 2,706 real records on the first live run before this fix."""</span>
<span class="ln">10</span>    base = <span class="tok-fn">_slugify_component</span>(
<span class="ln">11</span>        <span class="tok-str">f"{record['house_no']}-{record['house_suf']}-{record['rd_dir']}-{record['rd_name']}-"</span>
<span class="ln">12</span>        <span class="tok-str">f"{record['unit']}-{record['municipality_code']}-civic"</span>,
<span class="ln">13</span>    ) or <span class="tok-str">"civic-building"</span>
<span class="ln">14</span>    slug = base
<span class="ln">15</span>    counter = <span class="tok-num">2</span>
<span class="ln">16</span>    <span class="tok-kw">while</span> slug <span class="tok-kw">in</span> assigned_slugs <span class="tok-kw">or</span> <span class="tok-kw">await</span> Building.find_one({<span class="tok-str">"slug"</span>: slug}):
<span class="ln">17</span>        slug = <span class="tok-str">f"{base}-{counter}"</span>
<span class="ln">18</span>        counter += <span class="tok-num">1</span>
<span class="ln">19</span>    assigned_slugs.add(slug)
<span class="ln">20</span>    <span class="tok-kw">return</span> slug</pre></div>

  <p>The other half of the fix, in the batch-flush logic:</p>

  <div class="devlog-code"><pre><span class="ln">1</span><span class="tok-kw">except</span> BulkWriteError <span class="tok-kw">as</span> e:
<span class="ln">2</span>    write_errors = e.details.get(<span class="tok-str">"writeErrors"</span>, [])
<span class="ln">3</span>    non_id_duplicates = [
<span class="ln">4</span>        err <span class="tok-kw">for</span> err <span class="tok-kw">in</span> write_errors
<span class="ln">5</span>        <span class="tok-kw">if</span> err.get(<span class="tok-str">"code"</span>) != <span class="tok-num">11000</span> <span class="tok-kw">or</span> <span class="tok-str">"index: _id_"</span> <span class="tok-kw">not in</span> err.get(<span class="tok-str">"errmsg"</span>, <span class="tok-str">""</span>)
<span class="ln">6</span>    ]
<span class="ln">7</span>    <span class="tok-kw">if</span> non_id_duplicates:
<span class="ln">8</span>        <span class="tok-kw">raise</span>  <span class="tok-com"># a real bug, not idempotency — must not be swallowed</span>
<span class="ln">9</span>    inserted = e.details.get(<span class="tok-str">"nInserted"</span>, batch_size - <span class="tok-fn">len</span>(write_errors))</pre></div>

  <div class="devlog-callout">
    <strong>The fix has two parts:</strong> (1) track every slug already handed out
    <em>during this run</em>, in memory, not just what's already in the database —
    closing the race between unflushed records in the same batch. (2) Stop treating
    every duplicate-key error the same way — only a duplicate on the <code>_id</code>
    index is the expected, harmless "already ingested this" case. A duplicate on any
    <em>other</em> index, like <code>slug</code>, is a real data-loss bug wearing the
    same error code as a harmless one, and now raises instead of vanishing silently.
  </div>

  <div class="devlog-why">
    <strong>Why this matters:</strong> the dangerous part of this bug wasn't the
    collision itself — it's that the failure mode was <em>indistinguishable</em> from
    correct behavior at a glance. "Duplicate key error, skip it" is right 99% of the
    time in an idempotent pipeline. Catching the 1% required actually reasoning about
    <em>which index</em> the duplicate was on, not just the error code. Caught this
    during verification before it shipped, by checking the actual record count against
    the expected one rather than trusting a clean exit code.
  </div>
</div>
```

---

## Entries 2-10 — raw material only. Write each in Entry 1's exact shape.

### Entry 2 — Generic role-agnostic dispatch loop
**File:** `farpost-api/app/services/work_request.py:127-197` (loop), `:75-122` (ranking)
**Context:** Claims and future request types (inspections, service requests) all run
through ONE dispatch function via a structural `Protocol`, not inheritance — no shared
base class needed. Re-dispatch excludes already-tried candidates by *identity*
(`candidate.slug`), not their position in the ranking, because ranking is live/
reputation-based and can reorder between attempts. An instant per-dispatch timer AND a
separate periodic sweep both converge on the same idempotency guard, so if both fire,
the second is a no-op instead of a double-dispatch.
**Why interesting:** demonstrates generalizing a concrete flow (claim dispatch) into
reusable infrastructure *before* the second consumer existed, and getting the
exclusion-by-identity detail right on the first pass — a subtle correctness issue easy
to get wrong (excluding by rank position instead would silently skip the wrong person
after a re-rank).

```python
async def dispatch_work_request(
    request: DispatchableRequest,
    notify: NotifyCallable,
) -> None:
    """Core dispatch loop. Called via asyncio.create_task — never awaited directly.

    1. Find eligible candidates
    2. Rank by reputation
    3. Exclude already-tried candidates by identity (not ranking position — ranking
       can shift between attempts since it's reputation-based and live)
    4. Create WorkRequestAttempt
    5. Increment attempt counter on request
    6. Call notify(candidate, attempt)
    7. Schedule an instant in-process timeout check (supplements, doesn't replace,
       the periodic check_request_timeouts sweep)
    """
    repo = WorkRequestAttemptRepository()

    candidates = await find_candidates(
        request.postal_prefix, request.target_role, request.required_capabilities
    )

    if not candidates:
        await request.on_no_candidates()
        return

    ranked = await rank_candidates(candidates)

    existing_attempts = await repo.list_for_request(request.request_id)
    already_tried = {a.candidate_slug for a in existing_attempts}
    eligible = [c for c in ranked if c.slug not in already_tried]

    if not eligible:
        await request.on_all_exhausted()
        return

    candidate = eligible[0]
    # ... create WorkRequestAttempt, notify(candidate, attempt) ...

    asyncio.get_event_loop().call_later(
        request.timeout_minutes * 60,
        lambda: asyncio.create_task(_check_attempt_timeout(str(attempt.id))),
    )
```

---

### Entry 3 — Reputation scoring with per-signal floors, not a flat "unknown = neutral"
**File:** `farpost-api/app/services/work_request.py:75-122`
**Context:** A brand-new professional with zero history isn't scored as a flat "neutral"
0.5 across every dimension. `recently_active` floors at 0.3, `engagement`/`experience`
floor at 0.0 — only an actual *computation error* (the `except` branch) falls back to
0.5. The comment explicitly documents this distinction.
**Why interesting:** small detail, deliberate honesty about what "no data" should mean
vs. "something broke" — conflating those two is a common, subtle scoring-system bug.

```python
async def rank_candidates(candidates: list[Professional]) -> list[Professional]:
    """Rank candidates by reputation signals. Role-agnostic.

    Uses the reputation timeline read-model. Professionals with no history are not
    flatly neutral — each signal has its own floor: recently_active=0.3,
    engagement=0.0, experience=0.0, availability computed as normal from real
    capacity fields. Only the `except` fallback below (a timeline-computation
    error, not "no history") uses a flat 0.5.
    """
    scored = []
    for pro in candidates:
        try:
            timeline = await get_reputation_timeline(pro.slug)
            s = timeline.signals
            if s.quarantined:
                continue  # provisional role — ineligible for dispatch
            availability = (
                (pro.dispatch_capacity_max - pro.dispatch_capacity_current)
                / pro.dispatch_capacity_max
                if pro.dispatch_capacity_max > 0 else 0.5
            )
            experience = min(s.total_events, 20) / 20.0
            recently = 1.0 if s.recently_active else 0.3
            engagement = min(s.distinct_relationship_types, 5) / 5.0
            score = (
                recently * 0.30 + engagement * 0.25 + experience * 0.20
                + availability * 0.15 + 0.10  # base — everyone gets a floor
            )
            scored.append((round(score, 4), pro))
        except Exception as exc:
            scored.append((0.5, pro))  # timeline computation failed — NOT "no history"

    scored.sort(key=lambda t: t[0], reverse=True)
    return [pro for _, pro in scored]
```

---

### Entry 4 — Two weak signals corroborating each other beats either alone
**File:** `farpost-api/app/services/nar_ingestion.py:169-213`
**Context:** Matching a government address record against an existing building by
address-string alone isn't trusted — it's corroborated by an independent 50m geospatial
proximity check. If the string match is *contradicted* by proximity (candidate exists
2km away), it's logged as ambiguous, not auto-accepted. Neither signal alone is reliable
against Canada's fragmented civic-address data; together they catch each other's blind
spots.
**Why interesting:** a real defensive-data-matching pattern — most people would trust
either signal alone; requiring corroboration is the more rigorous (and more work to
build) choice.

```python
async def ingest_nar_record(record, building_repo, ambiguity_repo, write_buffer=None) -> str:
    """Returns "matched", "created", or "ambiguous" for caller-side stats."""
    loc_guid = record["loc_guid"]
    location = record.get("location")

    candidates = await building_repo.find_by_normalized_address(
        record["postal_code"], record["civic_no"], record["street_name"],
    )

    if len(candidates) > 1:
        await ambiguity_repo.record(
            loc_guid, "multiple_string_matches", [c.slug for c in candidates], record,
        )
        return "ambiguous"

    if len(candidates) == 1:
        candidate = candidates[0]
        if location is None or candidate.location is None:
            # No location data on one side to corroborate with — still unambiguous.
            await _backfill_match(candidate, loc_guid, location, write_buffer)
            return "matched"
        proximate = await building_repo.find_by_proximity(location, PROXIMITY_RADIUS_METERS)
        if any(str(c.id) == str(candidate.id) for c in proximate):
            await _backfill_match(candidate, loc_guid, location, write_buffer)
            return "matched"
        # String match says one thing, geography says another — don't guess.
        await ambiguity_repo.record(
            loc_guid, "string_match_contradicted_by_proximity", [candidate.slug], record,
        )
        return "ambiguous"

    await _create_building(record, write_buffer)
    return "created"
```

---

### Entry 5 — A Stripe fix that almost reopened the bug it was fixing
**File:** `farpost-api/app/services/stripe_service.py:41-67`
**Context:** Caching a `stripe_customer_id` fixed a duplicate-customer race against
Stripe's eventually-consistent search API. That created a new bug: a cached ID pointing
at a customer deleted directly in the Stripe dashboard broke invoicing with "No such
customer." The real fix does an exact, instantly-consistent `retrieve()` by ID before
trusting the cache — verifying without reopening the original race, since `retrieve()`
by ID (unlike search) is consistent.
**Why interesting:** a "fix within a fix" story — shows the ability to reason about
*why* a previous fix worked (eventual consistency) and choose a verification method that
doesn't undo that reasoning.

```python
async def resolve_requestor_customer_id(
    cached_customer_id: str | None, email: str, name: str, metadata: dict,
) -> str:
    """Return a valid Stripe customer ID for a requestor, verifying a cached ID still
    resolves before trusting it. A cached ID can go stale if the customer is deleted
    directly in Stripe. customers.retrieve() is an exact, instant-consistent lookup by
    ID, so verifying here doesn't reintroduce the eventually-consistent-search race
    the original caching fix was protecting against."""
    client = _client()
    if cached_customer_id:
        try:
            client.customers.retrieve(cached_customer_id)
            return cached_customer_id
        except stripe.error.InvalidRequestError:
            logger.warning('{"event": "stripe_customer_id_stale", "customer_id": "%s"}',
                            cached_customer_id)
    return await get_or_create_requestor_customer(email=email, name=name, metadata=metadata)
```

---

### Entry 6 — A Stripe footgun found empirically
**File:** `farpost-api/app/services/stripe_service.py:74-130`
**Context:** Omit `pending_invoice_items_behavior: "include"` and Stripe silently
defaults to excluding pending line items — producing a $0 invoice, auto-marked paid,
while the real fee sits stranded nowhere. Separately: a draft invoice's
`hosted_invoice_url` is `None` until `finalize_invoice()` runs — callers wanting the URL
must capture it post-finalize, not from the draft-creation response.
**Why interesting:** the kind of bug that produces no error at all — just quietly wrong
data — and the comment states plainly it was found empirically, not from documentation.

```python
async def create_platform_fee_invoice_draft(customer_id: str, fee_cents: int, description: str) -> str:
    """Create a draft platform fee invoice without finalizing."""
    client = _client()
    client.invoice_items.create(params={
        "customer": customer_id, "amount": fee_cents, "currency": "cad",
        "description": description,
    })
    invoice = client.invoices.create(params={
        "customer": customer_id,
        "collection_method": "send_invoice",
        "days_until_due": 30,
        # Without this, Stripe defaults to "exclude" and the pending invoice item
        # created above never attaches — the invoice comes back empty ($0, auto-marked
        # paid) while the real fee sits stranded.
        "pending_invoice_items_behavior": "include",
    })
    return invoice.id

async def finalize_and_send_platform_fee_invoice(invoice_id: str, fee_cents: int) -> str | None:
    """Confirmed empirically: a draft invoice's hosted_invoice_url is None — Stripe
    only populates it once finalize_invoice() runs."""
    client = _client()
    finalized = client.invoices.finalize_invoice(invoice_id)
    client.invoices.send_invoice(invoice_id)
    return finalized.hosted_invoice_url
```

---

### Entry 7 — Webhook idempotency: the redelivery Stripe warns you about
**File:** `farpost-api/app/routes/webhooks.py:149-181`
**Context:** Stripe explicitly does not guarantee at-most-once webhook delivery. A
redelivered `invoice.payment_succeeded` was silently overwriting `platform_fee_paid_at`
with a *later* timestamp on every redelivery, corrupting the actual paid-date. Fixed by
short-circuiting once the job is already marked collected.
**Why interesting:** most people build the happy path for a webhook and never consider
redelivery corrupting a timestamp that "already got set correctly" the first time.

```python
async def _handle_invoice_paid(invoice) -> None:
    """Mark platform_fee_collected on the job when the invoice is settled.

    Stripe does not guarantee at-most-once webhook delivery — a redelivered
    invoice.payment_succeeded was silently overwriting platform_fee_paid_at with a
    later timestamp on every redelivery, corrupting the actual paid-date. Now a
    no-op once already marked collected."""
    invoice_id = invoice["id"]
    job = await Job.find_one({"payment.platform_fee_invoice_id": invoice_id})
    if not job:
        return

    if job.payment.platform_fee_collected:
        return  # already recorded — a redelivery, not a new event

    job.payment.platform_fee_collected = True
    job.payment.platform_fee_paid_at = datetime.now(timezone.utc)
    job.payment.status = PaymentStatus.PAID
    await job.save()
```

---

### Entry 8 — Signature validation vs. infrastructure lying about its own URL
**File:** `farpost-api/app/routes/webhooks.py:15-31`
**Context:** Railway (the hosting platform) terminates TLS at its proxy, so requests
arrive internally as `http://` — but Twilio signed the `https://` URL it actually sent
the webhook to. Validating the signature against the wrong scheme fails every single
request in production. Fixed by rewriting the scheme before validating.
**Why interesting:** an infrastructure-specific gotcha that's invisible in local dev
(no TLS termination there) and only bites in production — the kind of thing you can't
find without actually deploying and testing the real thing.

```python
def _validate_twilio_signature(request: Request, body: dict) -> None:
    """Validate Twilio request signature to prevent spoofed webhook calls."""
    validator = RequestValidator(settings.TWILIO_AUTH_TOKEN)
    signature = request.headers.get("X-Twilio-Signature", "")
    url = str(request.url)
    # Railway terminates TLS at the proxy — internal requests arrive as http,
    # but Twilio signed the https:// URL it actually sent to.
    if url.startswith("http://"):
        url = "https://" + url[7:]

    if not validator.validate(url, body, signature):
        raise HTTPException(status_code=403, detail={"code": "INVALID_SIGNATURE"})
```

---

### Entry 9 — Per-category documentation half-life decay
**File:** `farpost-api/app/repositories/building_repository.py:230-259`,
`app/models/building.py` (FactStaleness model)
**Context:** Different building facts go stale at different real-world rates —
foundation documentation has a 120-month half-life, mechanical only 36. Each category
decays independently, tracked via its own `next_stale_at`, rather than one blanket
"last updated" timestamp for the whole building record. The due-for-renotification
query is a plain `$or` across the small fixed category set rather than an aggregation
pipeline — a deliberately simple choice given the category list won't grow unboundedly.
**Why interesting:** modeling something as nuanced as "how quickly does this specific
kind of information decay" instead of flattening it into one timestamp — and knowing
when *not* to reach for a fancier query tool.

```python
async def upsert_fact_staleness(self, slug: str, category: str, visit_date: date):
    """Resets the category's staleness clock to the new visit_date."""
    building = await self.find_by_slug(slug)
    half_life_months = FACT_STALENESS_HALF_LIFE_MONTHS[category]
    building.fact_staleness[category] = FactStaleness(
        last_documented_at=visit_date,
        half_life_months=half_life_months,
        next_stale_at=_add_months(visit_date, half_life_months),
        notified_at=None,
    )
    await building.save()
    return building

async def get_due_for_fact_decay(self) -> list[Building]:
    """Categories are a small fixed set, so this is a plain $or across each known
    key rather than an aggregation pipeline."""
    today = date.today()
    conditions = [
        {
            f"fact_staleness.{category}.next_stale_at": {"$lt": today},
            f"fact_staleness.{category}.notified_at": None,
        }
        for category in FACT_STALENESS_HALF_LIFE_MONTHS
    ]
    return await Building.find({"$or": conditions}).to_list()
```
Half-life reference: foundation 120mo, electrical 96mo, plumbing 96mo, exterior 60mo,
site 60mo, interior 48mo, roof 72mo, mechanical 36mo.

---

### Entry 10 — An AI integration that respects the event loop
**File:** `farpost-api/app/services/preening.py`
**Context:** A contribution-rewriting pipeline calls Claude to turn evaluative language
("roof looks bad") into observational language ("roof has visible granule loss"). The
Anthropic SDK call is synchronous, so it's wrapped in `asyncio.to_thread()` with an
explicit comment warning that calling it directly from an async route would stall every
other concurrent request on the process. It also hand-parses Claude's occasional habit
of wrapping JSON in markdown code fences by locating `{`/`}` manually rather than
trusting a clean response.
**Why interesting:** two small, easy-to-miss details of building real AI features
correctly — respecting the async runtime, and not trusting an LLM's output format
100% even when you asked for JSON.

```python
def _call_claude(raw_text: str, role: str) -> dict:
    """Blocking Anthropic SDK call — always run via asyncio.to_thread(), never directly
    from an async route (a synchronous network call here would block the whole event
    loop, stalling every other concurrent request on this process)."""
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{"role": "user", "content": PREEN_PROMPT.format(role=role, raw_text=raw_text)}],
    )
    raw = message.content[0].text.strip()
    # Claude sometimes wraps JSON in markdown code fences — extract just the object
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError(f"No JSON object found in response: {raw[:100]}")
    return json.loads(raw[start:end])

async def preen_contribution(raw_text: str, role: str) -> dict:
    """Raises on API failure — callers handle the failure path."""
    result = await asyncio.to_thread(_call_claude, raw_text, role)
    return result
```

---

## Optional 11th/12th, if more than 10 are wanted

- **Inspector capacity leak**: `farpost-api/app/services/inspection_dispatch.py:112-155`
  — capacity was incremented on every dispatch but only ever decremented on decline,
  never on completion, silently blocking new dispatches after 3 completed jobs. Fix:
  decrement on completion too, mirroring the claim-dispatch pattern that already did
  both halves correctly.
- **Beanie/pytest-asyncio event-loop footgun**: `farpost-api/tests/integration/conftest.py`
  — a session-scoped Mongo fixture must match `asyncio_default_fixture_loop_scope =
  "session"` in `pyproject.toml`, or Motor's async client gets bound to a closed event
  loop. More "here's a trap to warn other devs about" than a fixed-bug story.

## What to do when you're done

Once all 10 (or 12) entries are written and placed into robinsamways.ca, this file has
served its purpose — it can be deleted from the Farpost repo (it was never meant to live
here permanently). Don't delete anything from robinsamways.ca without being asked; only
this handoff file, and only from the Farpost side.
