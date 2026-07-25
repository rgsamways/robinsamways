import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dev Log · Robin Samways",
};

const PAGES = [
  { href: "/dev-log/bug-log", label: "Bug Log" },
  { href: "/dev-log/metrics", label: "Metrics" },
  { href: "/dev-log/testing-verification", label: "Testing & Verification" },
  { href: "/dev-log/glossary", label: "Glossary" },
  { href: "/dev-log/code-showcase", label: "Code Showcase" },
  { href: "/dev-log/lightbulbs", label: "Lightbulbs" },
];

export default function DevLogPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Dev Log
      </h1>
      <p className="mt-2 text-sm text-muted">
        The unpolished, ongoing record — plain-language explanations, how
        this site actually gets verified, real code-metrics history, real
        bugs hit along the way, and the ideas that haven&rsquo;t become
        anything yet.
      </p>

      <ul className="mt-8 space-y-2 text-sm">
        {PAGES.map((page) => (
          <li key={page.href}>
            <Link href={page.href} className="text-accent hover:underline">
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
