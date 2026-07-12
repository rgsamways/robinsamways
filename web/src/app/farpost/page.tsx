import type { Metadata } from "next";
import Farpost from "@/components/Farpost";
import SectionHeader from "@/components/SectionHeader";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";

export const metadata: Metadata = {
  title: "Farpost · Robin Samways",
};

const LIFECYCLE_ENTRIES: { date: string; text: string }[] = [
  {
    date: "2019-04",
    text: "Owner (Marlene) tags the building on move-in. Logs the well pump breaker location, the septic tank’s approximate location and last-pumped date, and photographs the foundation and electrical panel.",
  },
  {
    date: "2019-11",
    text: "First real payoff: a burst pipe at 1am. Marlene’s son, visiting for the weekend and unfamiliar with the property, scans the tag on the mechanical room door and finds the water shutoff in under a minute instead of guessing in the dark.",
  },
  {
    date: "2021-06",
    text: "Roof replaced. The contractor logs the shingle brand, warranty term, and invoice link directly against the building record — not just Marlene’s own filing cabinet.",
  },
  {
    date: "2022-09",
    text: "Wind damage claim. The adjuster assigned to the file is new to the area and has never been to this property; the tag surfaces the 2021 roof replacement and its warranty terms immediately, resolving in one visit what would otherwise have taken a callback to confirm.",
  },
  {
    date: "2023-03",
    text: "Marlene sells the property to a new owner, who switches insurance carriers the same year. The record itself doesn’t move with the insurer or the old owner — it stays with the building, carrier-neutral, and transfers cleanly to the new owner and their new broker.",
  },
  {
    date: "2024-01",
    text: "The system flags the septic “last pumped” fact as stale — three years since last recorded, past its expected service interval. Not a verdict, just a fact surfaced: “this record is 3 years stale.” The new owner has it serviced and logs the update.",
  },
  {
    date: "Today",
    text: "the record has outlived one owner, one carrier, one roof, and one emergency at 1am, and every professional who’s touched the building since 2019 added to the same file instead of starting their own.",
  },
];

export default function FarpostPage() {
  return (
    <main className="py-10">
      <FarpostTabBar />
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> <Farpost />
      </h1>
      <p className="mt-2 text-sm text-muted">
        A building-intelligence platform &mdash; NFC-tagged records that
        outlive any single owner, insurer, or contractor, born from a rural
        dispatch gap nobody else was solving.
      </p>

      <section>
        <SectionHeader title="ORIGIN_STORY" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            I didn&rsquo;t set out to build a building-intelligence platform.
            In late May 2026, an insurance adjuster I knew had a rural claim
            and couldn&rsquo;t find anyone to work it — no contractor, no
            inspector willing to make the drive out from the city for one
            job. It wasn&rsquo;t a technology problem, it was an
            availability problem nobody&rsquo;s software was built to solve.
            I built a dispatch app in about a week to fix exactly that: get
            the right professional to the right claim, regardless of how
            far out it was.
          </p>
          <p>
            Three weeks later, deep into a second, unrelated project — an
            Android compliance app called TapLog, built around RFID tags
            for verifying physical inspections — I found out another
            company was already building almost the same thing. Not
            similar. The same thing, down to a striking number of features
            I&rsquo;d built without ever knowing theirs existed. That&rsquo;s
            a hard thing to sit with three weeks in, and there wasn&rsquo;t
            a version of finishing TapLog that still made sense, so I
            stopped.
          </p>
          <p>
            I didn&rsquo;t throw the idea away, though. The part of TapLog
            that actually mattered — an RFID tag verifying a physical
            location, logging what happened there over time — got folded
            straight into the dispatch app I&rsquo;d already built. Dispatch
            the right professional to the right building, and keep a real,
            tag-verified record of what happened at that building
            afterward. That fusion, arrived at by mid-June 2026, is what
            Farpost actually is.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="PROBLEMS_FARPOST_SOLVES" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>
              The problem that matters most: it dies with the owner.
            </strong>{" "}
            The facts that actually matter about a building — where the
            water shutoff is, the model and serial number on the furnace,
            who did the roof and when, where the warranty and manuals live
            — exist in exactly one place today: a single owner&rsquo;s
            head. When that person sells, retires, or just forgets, the
            knowledge is gone with them. Farpost anchors those facts to the
            building itself, via an NFC tag on the physical structure, so
            they survive the person. It pays off at 2am hunting a water
            shutoff, at a sale, or handing a job to a new contractor
            who&rsquo;s never set foot in the building before. This is the
            core value proposition, deliberately designed to work for a
            single owner with zero network effect — nobody else has to be
            using Farpost for it to already be useful.
          </p>
          <p>
            <strong>
              The rural service-availability gap — where this all started.
            </strong>{" "}
            National restoration franchises decline claims outside their
            service zones across North Hastings, cottage country, and the
            wider Canadian Shield. Farpost&rsquo;s dispatch flow connects
            adjusters directly to local contractors who&rsquo;d otherwise
            never get found for that work. It&rsquo;s real, live, and still
            fully supported — it&rsquo;s just no longer the platform&rsquo;s
            defining feature, since the &ldquo;it dies with the
            owner&rdquo; problem turned out to be the deeper, more durable
            one.
          </p>
          <p>
            <strong>Every professional starts from zero.</strong>{" "}
            An inspector who&rsquo;s been to a building before, a
            contractor who already knows its quirks, an adjuster who
            already has the claim history — none of that persists or
            connects across roles today. Every visit starts cold. Farpost
            builds one living record tied to the building, so the right
            professional already knows what they&rsquo;re walking into
            instead of re-discovering it every time.
          </p>
          <p>
            <strong>No neutral, portable building history exists.</strong>{" "}
            Right now, an owner&rsquo;s building memory is effectively
            locked to whichever insurer or professional relationship
            happens to be active at the time. Farpost is carrier-neutral by
            design — the &ldquo;Switzerland&rdquo; that owners, brokers, and
            contractors can all trust — so the record survives a carrier
            switch. No insurer would ever build this themselves:
            they&rsquo;re structurally conflicted, and an insurer-owned
            version of this record could never actually be neutral.
          </p>
          <p>
            <strong>
              A smaller mechanic worth mentioning: staleness, not just
              presence.
            </strong>{" "}
            Facts about a building don&rsquo;t all age the same way — a
            foundation photo is good for years, but &ldquo;current
            occupant&rdquo; can be stale in months. Farpost tracks that
            decay per fact and surfaces it plainly (&ldquo;this record is
            three years stale&rdquo;) rather than passing judgment on it.
            Consistent with the platform&rsquo;s broader principle: it
            documents, it doesn&rsquo;t evaluate.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="BUILDING_LIFECYCLE_EXAMPLE" />
        <div className="mb-4 border-l-4 border-accent bg-skills-bg px-4 py-3 text-sm">
          A fictional example, illustrating how a Farpost record actually
          behaves over a building&rsquo;s life — not a real property, but a
          realistic composite of what the platform is for.
        </div>
        <p className="text-sm font-semibold">
          124 Concession Rd 7, rural North Hastings — tagged 2019.
        </p>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed">
          {LIFECYCLE_ENTRIES.map((entry) => (
            <li key={entry.date}>
              <span aria-hidden>›</span>{" "}
              <span className="font-semibold text-accent">{entry.date}</span>{" "}
              — {entry.text}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeader title="PROCESS" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Building Farpost solo means there&rsquo;s no one else to catch
            drift between what a feature was supposed to do and what it
            actually does — so I built that check into the process itself.
            Every non-trivial change starts as a written proposal
            (what&rsquo;s changing, why, and the exact behavior expected of
            it) before any code gets written, and nothing merges until a
            deliberate drift audit confirms the shipped behavior actually
            matches what was proposed — not just that it works, but that it
            works the way it was supposed to. It&rsquo;s the same
            discipline behind this site&rsquo;s own Salesforce case study,
            built the same way: propose, implement, audit for drift, then
            finalize.
          </p>
          <p>
            Alongside that, I keep a contemporaneous log of genuine
            technical uncertainty resolved through real experimentation,
            written down as I hit it — not reconstructed from memory after
            the fact. It&rsquo;s the same discipline Canadian {"SR&ED"} tax
            credits ask of {"R&D"}{" "}
            work, kept up because it&rsquo;s good
            practice for hard problems regardless of the tax angle, and
            it&rsquo;s paid off enough as its own habit that it&rsquo;s
            becoming a small project in its own right.
          </p>
        </div>
      </section>
    </main>
  );
}
