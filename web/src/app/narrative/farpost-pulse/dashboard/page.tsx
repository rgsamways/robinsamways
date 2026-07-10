import type { Metadata } from "next";
import Link from "next/link";
import DashboardContent from "@/components/farpost-pulse/DashboardContent";

export const metadata: Metadata = {
  title: "Farpost Pulse Dashboard · Robin Samways",
};

export default function DashboardPage() {
  return (
    <main className="py-10">
      <p className="text-xs">
        <Link href="/narrative/farpost-pulse" className="text-accent hover:underline">
          ← Farpost Pulse
        </Link>
      </p>
      <h1 className="mt-2 text-xl font-bold">
        <span className="text-accent">$</span> Dashboard
      </h1>
      <p className="mt-2 text-sm text-muted">
        Org-wide patterns across all seeded technicians.
      </p>
      <DashboardContent />
    </main>
  );
}
