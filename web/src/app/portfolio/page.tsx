import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio · Robin Samways",
};

export default function PortfolioPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Portfolio
      </h1>
      <p className="mt-4 text-sm text-muted">// coming soon</p>
    </main>
  );
}
