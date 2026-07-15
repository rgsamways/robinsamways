"use client";

import Link from "next/link";
import { useState } from "react";
import PillBar from "@/components/PillBar";
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
  const pills = tags.map((tag) => ({ id: tag, label: tag }));

  return (
    <>
      <PillBar
        pills={pills}
        activeIds={activeTags}
        onToggle={toggleTag}
        ariaLabel="filter by tag"
      />

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
