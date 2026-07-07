import type { Metadata } from "next";
import Farpost from "@/components/Farpost";

export const metadata: Metadata = {
  title: "Farpost · Robin Samways",
};

export default function FarpostPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> <Farpost />
      </h1>
      <p className="mt-4 text-sm text-muted">// coming soon</p>
    </main>
  );
}
