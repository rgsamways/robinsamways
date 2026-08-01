import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Credential Flow Tech Stack · Robin Samways",
};

export default function CredentialFlowTechStackPage() {
  return (
    <main className="py-10">
      <PageHeading title="Credential Flow · Tech Stack">
        The real technology choices behind a live Salesforce integration —
        not a generic &ldquo;Salesforce integration&rdquo; description.
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
                <td className="py-2 pr-4 align-top">Salesforce org</td>
                <td className="py-2 pr-4 align-top">Developer Edition</td>
                <td className="py-2 align-top">
                  Free tier, no Financial Services Cloud or Agentforce
                  license available.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Authentication</td>
                <td className="py-2 pr-4 align-top">
                  OAuth 2.0 Client Credentials Flow, raw <code>httpx</code>
                </td>
                <td className="py-2 align-top">
                  Server-to-server, no user in the loop — the same shape a
                  backend service actually uses to authenticate to
                  Salesforce in production.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Data model</td>
                <td className="py-2 pr-4 align-top">
                  Custom <code>Loan_Application__c</code> object
                </td>
                <td className="py-2 align-top">
                  Lookups to standard Contact (Applicant) and Account, the
                  closest honest approximation of a relationship model
                  without paid FSC licensing.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">Automation</td>
                <td className="py-2 pr-4 align-top">Record-Triggered Flow</td>
                <td className="py-2 align-top">
                  Stamps Decision Date automatically when Status changes to
                  Approved or Denied — declarative Salesforce automation,
                  not application-layer logic.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">AI feature</td>
                <td className="py-2 pr-4 align-top">Anthropic API</td>
                <td className="py-2 align-top">
                  Called directly for the recommended-next-action feature —
                  not Agentforce, which isn&rsquo;t licensed on this org.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
