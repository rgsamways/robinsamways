import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import { parseProjectStatus } from "@/components/project-record/types";
import rawSreditorStatus from "@/data/sreditor-status.json";

export const metadata: Metadata = {
  title: "Sreditor Testing & Verification · Robin Samways",
};

export default function SreditorTestingVerificationPage() {
  const status = parseProjectStatus(rawSreditorStatus, "sreditor-status.json");

  return (
    <main className="py-10">
      <PageHeading title="Sreditor · Testing & Verification">
        How Sreditor actually gets verified — against its own build, and
        against a codebase four times its size.
      </PageHeading>

      <div className="mt-8 space-y-4 text-sm leading-relaxed">
        {status.testingVerification.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
