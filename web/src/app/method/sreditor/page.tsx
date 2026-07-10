import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sreditor · Robin Samways",
};

export default function SreditorPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Sreditor
      </h1>
      <p className="mt-4 text-sm text-muted">// coming soon</p>
    </main>
  );
}
