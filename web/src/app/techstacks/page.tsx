import type { Metadata } from "next";
import HamburgerMenu from "@/components/HamburgerMenu";
import TechStacksBrowser from "@/components/techstacks/TechStacksBrowser";

const TAGS = [
  "Salesforce",
  "OAuth 2.0",
  "Anthropic AI",
  "Azure",
  "Python",
  "TypeScript",
  "PostgreSQL",
  "AWS",
];

const PROJECTS = [
  {
    slug: "credential-flow",
    title: "Credential Flow",
    teaser:
      "Salesforce Loan Demo — a live Salesforce integration case study: OAuth 2.0 Client Credentials Flow, a custom Loan Application object model, AI-assisted recommendations, and a real Field History Tracking timeline.",
    tags: ["Salesforce", "OAuth 2.0", "Anthropic AI"],
  },
];

export const metadata: Metadata = {
  title: "Tech/Stacks · Robin Samways",
};

export default function TechStacksPage() {
  const projectLinks = PROJECTS.map((project) => ({
    href: `/techstacks/${project.slug}`,
    label: project.title,
  }));

  return (
    <main className="py-10">
      <div className="flex items-start gap-3">
        <HamburgerMenu links={projectLinks} ariaLabel="project pages menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Tech/Stacks
          </h1>
          <p className="mt-2 text-sm text-muted">
            Ideas with no relation to Farpost &mdash; a place to try a stack
            or a concept just to see if it can be built.
          </p>
        </div>
      </div>

      <TechStacksBrowser tags={TAGS} projects={PROJECTS} />
    </main>
  );
}
