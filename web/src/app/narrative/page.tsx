import type { Metadata } from "next";
import Link from "next/link";
import HamburgerMenu from "@/components/HamburgerMenu";

type Project = {
  slug: string;
  title: string;
  teaser: string;
  tags?: string[];
};

const PROJECTS: Project[] = [
  {
    slug: "credential-flow",
    title: "Credential Flow",
    teaser:
      "Salesforce Loan Demo — a live Salesforce integration case study: OAuth 2.0 Client Credentials Flow, a custom Loan Application object model, AI-assisted recommendations, and a real Field History Tracking timeline.",
    tags: ["Salesforce", "OAuth 2.0", "Anthropic AI"],
  },
  {
    slug: "farpost-pulse",
    title: "Farpost Pulse",
    teaser:
      "A field-tech coaching dashboard, built to get genuine hands-on experience with a stack I wanted to actually know — a real Azure Functions backend and Cosmos DB, called directly from a React frontend, coaching seeded field technicians on job-quality patterns.",
    tags: ["Azure Functions", "Cosmos DB", "React"],
  },
  {
    slug: "farpost-atlas",
    title: "Farpost Atlas",
    teaser:
      "A real geospatial join, not pins on a map — a live point-in-polygon query against real Statistics Canada 2021 Census boundary data, mapping seeded tracked buildings across North Hastings, Ontario and echoing Farpost's own staleness mechanic at a regional scale.",
    tags: ["FastAPI", "Shapely", "Leaflet"],
  },
];

export const metadata: Metadata = {
  title: "Narrative · Robin Samways",
};

export default function NarrativePage() {
  const projectLinks = PROJECTS.map((project) => ({
    href: `/narrative/${project.slug}`,
    label: project.title,
  }));

  return (
    <main className="py-10">
      <div className="flex items-start gap-3">
        <HamburgerMenu links={projectLinks} ariaLabel="project pages menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Narrative
          </h1>
          <p className="mt-2 text-sm text-muted">
            A showcase of pages that tell the story of something built for a
            specific real reason.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {PROJECTS.map((project) => (
          <Link
            key={project.slug}
            href={`/narrative/${project.slug}`}
            className="block border border-foreground/20 p-4 transition hover:border-accent"
          >
            <h2 className="text-sm font-bold text-accent">{project.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{project.teaser}</p>
            {project.tags && (
              <p className="mt-2 text-xs text-muted">{project.tags.join(" · ")}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
