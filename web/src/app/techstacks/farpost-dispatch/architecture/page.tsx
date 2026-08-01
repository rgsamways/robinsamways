import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Dispatch Architecture · Robin Samways",
};

export default function FarpostDispatchArchitecturePage() {
  return (
    <main className="py-10">
      <PageHeading title="Dispatch · Architecture">
        The source-driven Salesforce DX/Apex build behind the Partner
        Community portal.
      </PageHeading>

      <section>
        <SectionHeader title="NOT_FARPOST_S_REAL_DISPATCH" />
        <p className="text-sm leading-relaxed">
          <strong>
            This is a separate, illustrative system, not Farpost&rsquo;s
            real dispatch engine.
          </strong>{" "}
          The actual farpost.ca product has a mature, live, twice-rebuilt
          dispatch system running on MongoDB, FastAPI, and Twilio. It needs
          nothing from this piece, and this piece touches none of it — no
          shared code, no shared data, no shared infrastructure.
        </p>
      </section>

      <section>
        <SectionHeader title="SOURCE_DRIVEN_BUILD" />
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
        </div>
      </section>

      <section>
        <SectionHeader title="CONCURRENCY_SAFE_CLAIMING" />
        <p className="text-sm leading-relaxed">
          Claiming a job is concurrency-safe, not a toy:{" "}
          <code>JobClaimService.claimJob</code> row-locks the{" "}
          <code>Job__c</code> record (<code>FOR UPDATE</code>) and re-checks
          its Status inside that lock before updating it, so two
          professionals claiming the same job near-simultaneously can never
          both succeed. That&rsquo;s the sharper version of the founding
          story: instead of manual outreach that failed, the system
          proactively surfaces the job to the best-fit people, who claim it
          themselves.
        </p>
      </section>

      <section>
        <SectionHeader title="PARTNER_COMMUNITY_PORTAL" />
        <p className="text-sm leading-relaxed">
          Two Lightning Web Components carry the two sides of this story: an
          ops-side recommendation panel on the <code>Job__c</code> record
          page, and a Partner Community portal page showing each
          Professional their own matching open jobs with a Claim action. The
          AI ranks and surfaces; it doesn&rsquo;t assign. Ops sees the
          ranked, reasoned shortlist on the Job record page; Professionals
          see it reflected as a recommended flag on their own portal board.
          Claiming stays a Professional&rsquo;s own action.
        </p>
      </section>
    </main>
  );
}
