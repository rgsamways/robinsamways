import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Farpost Dispatch · Robin Samways",
};

export default function FarpostDispatchPage() {
  return (
    <main className="py-10">
      <PageHeading title="Farpost Dispatch">
        A Salesforce-native partner network — Experience Cloud, Apex, and an
        AI-assisted matching service, built to prove Salesforce skills from{" "}
        <em>inside</em> the platform, not just integrating with it.
      </PageHeading>

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
        <p className="text-sm leading-relaxed">
          Professionals are standard Salesforce Contacts extended with four
          custom fields (Service Region, Certifications, Availability
          Status, Rating), and Jobs are a new custom object,{" "}
          <code>Job__c</code>. See{" "}
          <a
            href="/techstacks/farpost-dispatch/object-model"
            className="text-accent underline"
          >
            Object Model
          </a>{" "}
          for the full field list.
        </p>
      </section>

      <section>
        <SectionHeader title="ARCHITECTURE" />
        <p className="text-sm leading-relaxed">
          <code>pieces/farpost-dispatch-sf/</code> is a real, git-tracked
          Salesforce DX project deployed via the Salesforce CLI, with
          concurrency-safe job claiming and a Partner Community portal. See{" "}
          <a
            href="/techstacks/farpost-dispatch/architecture"
            className="text-accent underline"
          >
            Architecture
          </a>{" "}
          for the full explanation of the source-driven, git-tracked
          Salesforce DX/Apex build.
        </p>
      </section>

      <section>
        <SectionHeader title="AI_MATCHING" />
        <p className="text-sm leading-relaxed">
          <code>JobMatchingService</code> queries eligible Contacts and calls
          Anthropic&rsquo;s API via a Named Credential for a ranked,
          reasoned shortlist &mdash; the callout originates from inside
          Salesforce this time, the mirror image of Credential
          Flow&rsquo;s Python-calls-Salesforce direction. See{" "}
          <a
            href="/techstacks/farpost-dispatch/ai-notes"
            className="text-accent underline"
          >
            AI Notes
          </a>{" "}
          for the full mechanic and its contrast with Credential
          Flow&rsquo;s AI feature.
        </p>
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
        <SectionHeader title="NO_LIVE_DEMO" />
        <p className="text-sm leading-relaxed">
          No live demo widget or login link here on purpose &mdash; exposing
          a free-tier Salesforce org&rsquo;s Partner Community login
          publicly risks abuse and governor-limit exhaustion for no real
          benefit. See{" "}
          <a
            href="/techstacks/farpost-dispatch/design-notes"
            className="text-accent underline"
          >
            Design Notes
          </a>{" "}
          for the full reasoning, and{" "}
          <a
            href="/techstacks/farpost-dispatch/setup-gallery"
            className="text-accent underline"
          >
            Setup Gallery
          </a>{" "}
          for real configuration screenshots once captured.
        </p>
      </section>
    </main>
  );
}
