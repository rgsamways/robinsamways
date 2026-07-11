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
    slug: "sreditor",
    title: "Sreditor",
    teaser:
      "A CLI tool that judges SR&ED tax-credit eligibility from a project's own OpenSpec change history, in near real time — contemporaneous documentation instead of reconstructing a claim from memory months later.",
    tags: ["TypeScript", "Node.js", "Claude API", "OpenSpec"],
  },
];

export const metadata: Metadata = {
  title: "Method · Robin Samways",
};

export default function MethodPage() {
  const projectLinks = PROJECTS.map((project) => ({
    href: `/method/${project.slug}`,
    label: project.title,
  }));

  return (
    <main className="py-10">
      <div className="flex items-start gap-3">
        <HamburgerMenu links={projectLinks} ariaLabel="project pages menu" />
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-accent">$</span> Method
          </h1>
          <p className="mt-2 text-sm text-muted">
            A showcase of pages that document resolving a genuine technical
            uncertainty through hands-on experimentation.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {PROJECTS.map((project) => (
          <Link
            key={project.slug}
            href={`/method/${project.slug}`}
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
