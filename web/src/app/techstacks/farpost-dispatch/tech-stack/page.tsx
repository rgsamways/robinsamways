import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Dispatch Tech Stack · Robin Samways",
};

export default function FarpostDispatchTechStackPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dispatch · Tech Stack">
        What&rsquo;s real, source-driven Salesforce DX, versus what&rsquo;s
        configured only through the Setup UI.
      </PageHeading>

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
                  shared Python <code>api/</code>. Every object, field,
                  class, and component is real, hand-authored source in this
                  repo, deployed via <code>sf project deploy start</code>{" "}
                  &mdash; not configuration that only exists by clicking
                  through Setup.
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
                  external-user login, not a Guest User workaround. The
                  Experience Cloud site itself is configured through Setup,
                  the way Experience Cloud sites are — not source-driven.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">AI callout</td>
                <td className="py-2 pr-4 align-top">
                  Named Credential &rarr; Anthropic API
                </td>
                <td className="py-2 align-top">
                  The current recommended Salesforce pattern for a secure
                  external callout &mdash; avoids the anti-pattern of a key
                  sitting in a Custom Metadata Type field in plaintext. The
                  Named Credential itself is Setup-UI configuration; the
                  Apex code that calls it is git-tracked source.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
