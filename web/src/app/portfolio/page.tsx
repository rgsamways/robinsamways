import type { Metadata } from "next";
import Link from "next/link";
import HamburgerMenu from "@/components/HamburgerMenu";

type Project = {
  slug: string;
  title: string;
  teaser: string;
};

const PROJECTS: Project[] = [
  {
    slug: "salesforce-loan-demo",
    title: "Salesforce Loan Demo",
    teaser:
      "A live Salesforce integration case study — OAuth 2.0 Client Credentials Flow, a custom Loan Application object model, AI-assisted recommendations, and a real Field History Tracking timeline.",
  },
];

export const metadata: Metadata = {
  title: "Portfolio · Robin Samways",
};

export default function PortfolioPage() {
  const projectLinks = PROJECTS.map((project) => ({
    href: `/portfolio/${project.slug}`,
    label: project.title,
  }));

  return (
    <main className="py-10">
      <div className="flex items-start gap-3">
        <HamburgerMenu links={projectLinks} ariaLabel="project pages menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Portfolio
          </h1>
          <p className="mt-2 text-sm text-muted">
            A showcase of individual project pieces — each its own dedicated
            page.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {PROJECTS.map((project) => (
          <Link
            key={project.slug}
            href={`/portfolio/${project.slug}`}
            className="block border border-foreground/20 p-4 transition hover:border-accent"
          >
            <h2 className="text-sm font-bold text-accent">{project.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{project.teaser}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
