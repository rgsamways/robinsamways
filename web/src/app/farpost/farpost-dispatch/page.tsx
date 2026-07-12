import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";

export const metadata: Metadata = {
  title: "Farpost Dispatch · Robin Samways",
};

export default function FarpostDispatchPage() {
  return (
    <main className="py-10">
      <FarpostTabBar />
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Farpost Dispatch
      </h1>
      <p className="mt-2 text-sm text-muted">
        A Salesforce-native partner network — Experience Cloud, Apex, and an
        AI-assisted matching service, built to prove Salesforce skills from{" "}
        <em>inside</em> the platform, not just integrating with it.
      </p>

      <section>
        <SectionHeader title="OVERVIEW" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>
              This is a separate, illustrative system, not Farpost&rsquo;s
              real dispatch engine.
            </strong>{" "}
            The actual farpost.ca product has a mature, live, twice-rebuilt
            dispatch system running on MongoDB, FastAPI, and Twilio, already
            generalized for reuse across future request types. It needs
            nothing from this piece, and this piece touches none of it — no
            shared code, no shared data, no shared infrastructure. Farpost
            Dispatch (the portfolio piece below) borrows only the founding
            story for narrative color: the same rural adjuster who
            couldn&rsquo;t find anyone to work a claim, reused here to
            motivate a parallel system built specifically to demonstrate
            Salesforce/Experience Cloud/Apex skills to an interviewer.
          </p>
          <p>
            What&rsquo;s actually built: a real Salesforce DX project,
            deployed to a Developer Edition org via the Salesforce CLI, not
            configured only through clicking around Setup. Professionals
            (real Partner Community-licensed portal users) see their own
            matching open jobs and claim them directly; an Apex service
            ranks eligible candidates for a job and calls Anthropic for a
            short natural-language reason per recommendation &mdash; the
            callout originates from inside Salesforce this time, the mirror
            image of{" "}
            <a href="/techstacks/credential-flow" className="text-accent underline">
              Credential Flow
            </a>
            &rsquo;s Python-calls-Salesforce direction.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="OBJECT_MODEL" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Professionals are standard Salesforce Contacts, extended with
            four custom fields: Service Region (picklist), Certifications
            (multi-select picklist &mdash; Septic/Well, Electrical,
            Foundation/Structural, Roofing, General Inspection, mirroring{" "}
            <a href="/farpost/farpost-atlas" className="text-accent underline">
              Farpost Atlas
            </a>
            &rsquo;s own tracked-record types), Availability Status
            (Available/Unavailable), and Rating (a seeded decimal used as
            the matching service&rsquo;s secondary sort signal).
          </p>
          <p>
            Jobs are a new custom object, <code>Job__c</code>: Job Type and
            Region (the same picklist value sets as Certifications and
            Service Region), Urgency (High/Medium/Low), Status
            (Open/Claimed/Completed), an Assigned Professional lookup back
            to Contact, and a free-text Description.
          </p>
          <p>
            Region is deliberately a plain picklist, seeded from real North
            Hastings-area municipality names (Bancroft, Faraday,
            Carlow/Mayo, Hastings Highlands, Limerick, Tudor and Cashel,
            Wollaston) for narrative continuity with Farpost Atlas&rsquo;s
            own setting &mdash; but zero data or code is shared with Atlas.
            Atlas&rsquo;s real Statistics Canada boundary polygons and this
            picklist have nothing to do with each other; a categorical
            region-match filter is all this piece&rsquo;s matching logic
            actually needs, and duplicating Atlas&rsquo;s real geo data into
            an unrelated system would be exactly the cross-piece coupling
            this site&rsquo;s own portfolio-piece isolation convention
            exists to prevent.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="ARCHITECTURE" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <code>pieces/farpost-dispatch-sf/</code> is a real Salesforce DX
            project &mdash; Apex classes, custom object/field metadata, a
            permission set, Named Credential metadata, and two Lightning Web
            Components, all hand-authored, git-tracked source deployed via{" "}
            <code>sf project deploy start</code>, not configuration that
            only exists by clicking through Setup with nothing committed
            anywhere. Apex is a genuinely different runtime than every other
            piece on this site, satisfying this site&rsquo;s own
            portfolio-piece isolation convention directly &mdash; the second
            real instance of that trigger, after Farpost Pulse&rsquo;s
            Node.js Azure Functions.
          </p>
          <p>
            A <code>Farpost_Dispatch_Partner</code> permission set scopes
            exactly what a Partner Community Professional needs: their own
            Contact self-fields, read-only visibility on{" "}
            <code>Job__c</code>, and the two Apex classes backing the job
            board and the claim action &mdash; nothing broader.
          </p>
          <p>
            Two Lightning Web Components carry the two sides of this
            story: an ops-side recommendation panel on the{" "}
            <code>Job__c</code> record page, and a Partner Community portal
            page showing each Professional their own matching open jobs
            with a Claim action. Claiming itself is concurrency-safe, not a
            toy: <code>JobClaimService.claimJob</code> row-locks the{" "}
            <code>Job__c</code> record (<code>FOR UPDATE</code>) and
            re-checks its Status inside that lock before updating it, so two
            professionals claiming the same job near-simultaneously can
            never both succeed. That&rsquo;s the sharper version of the
            founding story: instead of manual outreach that failed, the
            system proactively surfaces the job to the best-fit people, who
            claim it themselves.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="AI_MATCHING" />
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <code>JobMatchingService</code>{" "}
            queries Contacts whose Service
            Region matches the Job&rsquo;s Region, whose Certifications
            include the Job&rsquo;s Job Type, and whose Availability Status
            is Available, sorts the shortlist by Rating, then calls
            Anthropic &mdash; via the <code>Anthropic_API</code> Named
            Credential, never a hardcoded key &mdash; for a short
            natural-language reason per candidate. If no Contact is
            eligible, the service returns an empty result without ever
            calling Anthropic.
          </p>
          <p>
            This is the direct, complementary counterpart to Credential
            Flow&rsquo;s own Anthropic-powered recommendation feature: same
            &ldquo;explain the why&rdquo; pattern, opposite direction of
            integration. Credential Flow&rsquo;s recommendation call
            originates from this site&rsquo;s own Python backend calling{" "}
            <em>out to</em>{" "}
            Salesforce data; Farpost Dispatch&rsquo;s
            originates from Apex calling <em>out from inside</em>{" "}
            Salesforce
            itself &mdash; two genuinely different integration directions
            proven against the same underlying AI provider.
          </p>
          <p>
            The AI ranks and surfaces; it doesn&rsquo;t assign. Ops sees the
            ranked, reasoned shortlist on the Job record page; Professionals
            see it reflected as a recommended flag on their own portal
            board. Claiming stays a Professional&rsquo;s own action.
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="TECH_STACK" />
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Layer</th>
                <th className="py-1 pr-4 font-semibold">Choice</th>
                <th className="py-1 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Platform</td>
                <td className="py-2 pr-4 align-top">Salesforce DX, Apex</td>
                <td className="py-2 align-top">
                  Apex only runs inside Salesforce &mdash; there&rsquo;s no
                  question of whether this belongs in this site&rsquo;s
                  shared Python <code>api/</code>.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Portal</td>
                <td className="py-2 pr-4 align-top">
                  Experience Cloud, Partner Community
                </td>
                <td className="py-2 align-top">
                  Real, free, unused Partner Community licenses confirmed
                  directly in the Developer Edition org &mdash; a genuine
                  external-user login, not a Guest User workaround.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">AI callout</td>
                <td className="py-2 pr-4 align-top">
                  Named Credential &rarr; Anthropic API
                </td>
                <td className="py-2 align-top">
                  The current recommended Salesforce pattern for a secure
                  external callout &mdash; avoids the anti-pattern of a key
                  sitting in a Custom Metadata Type field in plaintext.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Concurrency</td>
                <td className="py-2 pr-4 align-top">
                  SOQL <code>FOR UPDATE</code> row locking
                </td>
                <td className="py-2 align-top">
                  A genuinely correct claim-concurrency pattern, not
                  last-write-wins.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Deployment</td>
                <td className="py-2 pr-4 align-top">
                  Salesforce CLI (<code>sf project deploy start</code>)
                </td>
                <td className="py-2 align-top">
                  Every object, field, class, and component is real,
                  hand-authored source in this repo &mdash; not
                  configuration that only exists by clicking through Setup.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="SETUP_GALLERY" />
        <p className="text-sm leading-relaxed">
          No live demo widget or login link here on purpose &mdash; exposing
          a free-tier Salesforce org&rsquo;s Partner Community login
          publicly risks abuse and governor-limit exhaustion for no real
          benefit. A gallery of real setup screenshots (the Experience Cloud
          site, the Partner Community job board, the ops-side recommendation
          panel) is a deferred, non-blocking follow-up once the manual
          Salesforce configuration is actually done &mdash; the same
          precedent as Farpost Atlas&rsquo;s and Farpost Pulse&rsquo;s own
          still-pending setup galleries.
        </p>
      </section>
    </main>
  );
}
