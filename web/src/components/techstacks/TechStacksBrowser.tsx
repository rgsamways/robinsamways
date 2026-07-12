"use client";

import Link from "next/link";
import { useState } from "react";
import { filterProjectsByTags } from "./filterProjects";

type Project = {
  slug: string;
  title: string;
  teaser: string;
  tags: string[];
};

export default function TechStacksBrowser({
  tags,
  projects,
}: {
  tags: string[];
  projects: Project[];
}) {
  const [activeTags, setActiveTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]
    );
  }

  const visibleProjects = filterProjectsByTags(projects, activeTags);

  return (
    <>
      <div role="group" aria-label="filter by tag" className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleTag(tag)}
              className={
                isActive
                  ? "rounded-full border border-accent bg-accent px-4 py-1 text-xs font-semibold text-background"
                  : "rounded-full border border-foreground/20 px-4 py-1 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent"
              }
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-6">
        {visibleProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/techstacks/${project.slug}`}
            className="block border border-foreground/20 p-4 transition hover:border-accent"
          >
            <h2 className="text-sm font-bold text-accent">{project.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{project.teaser}</p>
            <p className="mt-2 text-xs text-muted">{project.tags.join(" · ")}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
