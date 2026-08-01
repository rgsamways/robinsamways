import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Dispatch Object Model · Robin Samways",
};

export default function FarpostDispatchObjectModelPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dispatch · Object Model">
        The Contact extensions and the new <code>Job__c</code> object
        together.
      </PageHeading>

      <section>
        <SectionHeader title="PROFESSIONAL_CONTACT_FIELDS" />
        <p className="mb-4 text-sm leading-relaxed">
          Professionals are standard Salesforce Contacts, extended with four
          custom fields.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Field</th>
                <th className="py-1 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Service Region</td>
                <td className="py-2 align-top">Picklist — where this Professional works</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Certifications</td>
                <td className="py-2 align-top">
                  Multi-select picklist — Septic/Well, Electrical,
                  Foundation/Structural, Roofing, General Inspection,
                  mirroring{" "}
                  <a
                    href="/techstacks/farpost-atlas"
                    className="text-accent underline"
                  >
                    Farpost Atlas
                  </a>
                  &rsquo;s own tracked-record types
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Availability Status</td>
                <td className="py-2 align-top">Picklist — Available or Unavailable</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Rating</td>
                <td className="py-2 align-top">
                  Decimal — a seeded value used as the matching
                  service&rsquo;s secondary sort signal
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="JOB__C" />
        <p className="mb-4 text-sm leading-relaxed">
          Jobs are a new custom object.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Field</th>
                <th className="py-1 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Job Type</td>
                <td className="py-2 align-top">
                  Picklist — the same value set as Certifications
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Region</td>
                <td className="py-2 align-top">
                  Picklist — the same value set as Service Region, seeded
                  from real North Hastings-area municipality names
                  (Bancroft, Faraday, Carlow/Mayo, Hastings Highlands,
                  Limerick, Tudor and Cashel, Wollaston) for narrative
                  continuity with Farpost Atlas&rsquo;s own setting — but
                  zero data or code is shared with Atlas
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Urgency</td>
                <td className="py-2 align-top">Picklist — High, Medium, or Low</td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Status</td>
                <td className="py-2 align-top">
                  Picklist — Open, Claimed, or Completed, defaulting to{" "}
                  <strong>Open</strong> on creation
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Assigned Professional</td>
                <td className="py-2 align-top">
                  Lookup to Contact, set only once a claim succeeds
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">Description</td>
                <td className="py-2 align-top">Free text</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
