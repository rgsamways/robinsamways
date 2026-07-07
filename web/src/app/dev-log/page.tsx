import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Log · Robin Samways",
};

export default function DevLogPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Dev Log
      </h1>
      <p className="mt-4 text-sm text-muted">// coming soon</p>
    </main>
  );
}
