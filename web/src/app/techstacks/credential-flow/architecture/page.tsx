import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Credential Flow Architecture · Robin Samways",
};

export default function CredentialFlowArchitecturePage() {
  return (
    <main className="py-10">
      <PageHeading title="Credential Flow · Architecture">
        The OAuth token lifecycle, the four HTTP endpoints, and the layered
        protections on every write.
      </PageHeading>

      <section>
        <SectionHeader title="TOKEN_LIFECYCLE" />
        <p className="text-sm leading-relaxed">
          On its first Salesforce call since starting, the API requests an
          access token from Salesforce&rsquo;s OAuth token endpoint using
          the configured Consumer Key and Secret, then caches it in memory.
          Every subsequent call reuses that cached token — it is not
          refetched on every request — until it&rsquo;s expired or about to
          expire, at which point the API requests a fresh one before making
          the call. This is the actual protocol mechanic this case study
          exists to demonstrate: the token request, its expiry, and when to
          refetch, not that a Python package can be installed.
        </p>
      </section>

      <section>
        <SectionHeader title="HTTP_ENDPOINTS" />
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-foreground/20 text-left text-muted">
                <th className="py-1 pr-4 font-semibold">Endpoint</th>
                <th className="py-1 font-semibold">Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>GET /salesforce/loan-applications</code>
                </td>
                <td className="py-2 align-top">
                  Lists existing records, queried live from Salesforce on
                  every call.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>POST /salesforce/loan-applications</code>
                </td>
                <td className="py-2 align-top">
                  Creates a new record, stamping Submitted Date server-side
                  and defaulting Status to Draft if omitted.
                </td>
              </tr>
              <tr className="border-b border-foreground/10">
                <td className="py-2 pr-4 align-top">
                  <code>PATCH /salesforce/loan-applications/{"{id}"}</code>
                </td>
                <td className="py-2 align-top">
                  Updates only the Status field — every other field,
                  including the Flow-controlled Decision Date, stays
                  untouched.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 align-top">
                  <code>DELETE /salesforce/loan-applications/{"{id}"}</code>
                </td>
                <td className="py-2 align-top">
                  Deletes a record — but only after checking its Status
                  server-side (see below).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="WRITE_PROTECTIONS" />
        <p className="text-sm leading-relaxed">
          Both write endpoints apply the same layered protections used
          elsewhere on this site: a honeypot field, a minimum-fill-time
          check, per-IP rate limiting, and a profanity blocklist on the
          Applicant and Account name fields. Status is restricted to the
          settable values (Draft, Submitted, Under Review, Approved,
          Denied) on both create and update — Archived is reachable only by
          editing Salesforce directly, never through either endpoint.
        </p>
      </section>

      <section>
        <SectionHeader title="ARCHIVED_RECORD_DELETE_PROTECTION" />
        <p className="text-sm leading-relaxed">
          The delete endpoint checks a record&rsquo;s current Status
          server-side and refuses to delete it if that Status is Archived —
          regardless of what any caller sends, and regardless of whether
          the request originates from this site&rsquo;s own UI or a direct
          API call. Archived records are the original seed data; this
          protection keeps them permanently intact so the live demo always
          has a stable baseline to show, no matter what a visitor does
          through the create/update/delete actions.
        </p>
      </section>
    </main>
  );
}
