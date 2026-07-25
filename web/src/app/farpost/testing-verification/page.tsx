import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import { parseProjectStatus } from "@/components/project-record/types";
import rawFarpostStatus from "@/data/farpost-status.json";

export const metadata: Metadata = {
  title: "Farpost Testing & Verification · Robin Samways",
};

export default function FarpostTestingVerificationPage() {
  const status = parseProjectStatus(rawFarpostStatus, "farpost-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Farpost · Testing & Verification">
        How the rebuild actually gets verified, as far as this page can see
        into a separate repository.
      </PageHeading>

      <div className="mt-8 space-y-4 text-sm leading-relaxed">
        {status.testingVerification.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
