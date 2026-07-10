import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farpost Pulse · Robin Samways",
};

export default function FarpostPulsePage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Farpost Pulse
      </h1>
      <p className="mt-4 text-sm text-muted">// coming soon</p>
    </main>
  );
}
