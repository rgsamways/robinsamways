import type { Metadata } from "next";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "Vocare · Robin Samways",
};

const PAGES = [
  { href: "/vocare/build-plan", label: "Build Plan" },
  { href: "/vocare/feature-list", label: "Feature List" },
  { href: "/vocare/tech-stack", label: "Tech Stack" },
  { href: "/vocare/upgrade-path", label: "Upgrade Path" },
  { href: "/vocare/current-metrics", label: "Current Metrics" },
  { href: "/vocare/outlook", label: "Outlook" },
];

export default function VocarePage() {
  return (
    <main className="py-10">
      <PageHeading
        title="Vocare"
        descriptionClassName="mt-2 text-sm leading-relaxed text-muted"
      >
        Vocare is an AI-conversational career/interview practice app, sold as
        a $29 one-time lifetime fee — not a subscription, unlike every named
        competitor. A person just talks about what they&rsquo;ve done, what
        they&rsquo;re doing, and what they want next, with no trivia and no
        scoring pressure in the moment; feedback happens only after the
        conversation, never during it. It&rsquo;s a fully independent
        product Robin owns and operates, on its own infrastructure, separate
        from this site and from Farpost.
      </PageHeading>

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
