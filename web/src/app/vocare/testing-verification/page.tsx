import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import { parseProjectStatus } from "@/components/project-record/types";
import rawVocareStatus from "@/data/vocare-status.json";

export const metadata: Metadata = {
  title: "Vocare Testing & Verification · Robin Samways",
};

export default function VocareTestingVerificationPage() {
  const status = parseProjectStatus(rawVocareStatus, "vocare-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Vocare · Testing & Verification">
        How Vocare actually gets verified, as far as this page can see into a
        separate repository.
      </PageHeading>

      <div className="mt-8 space-y-4 text-sm leading-relaxed">
        {status.testingVerification.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
