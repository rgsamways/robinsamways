import type { Metadata } from "next";
import Link from "next/link";
import DashboardContent from "@/components/farpost-pulse/DashboardContent";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "Farpost Pulse Dashboard · Robin Samways",
};

export default function DashboardPage() {
  return (
    <main className="py-10">
      <p className="text-xs">
        <Link href="/farpost/farpost-pulse" className="text-accent hover:underline">
          ← Farpost Pulse
        </Link>
      </p>
      <PageHeading title="Dashboard" headingClassName="mt-2 text-xl font-bold">
        Org-wide patterns across all seeded technicians.
      </PageHeading>
      <DashboardContent />
    </main>
  );
}
