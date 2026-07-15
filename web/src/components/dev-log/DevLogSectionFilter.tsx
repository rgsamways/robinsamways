"use client";

import { Fragment, useState, type ReactNode } from "react";
import { filterSections } from "./filterSections";

type Section = {
  id: string;
  label: string;
  node: ReactNode;
};

export default function DevLogSectionFilter({ sections }: { sections: Section[] }) {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  function toggleId(id: string) {
    setActiveIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  const visibleSections = filterSections(sections, activeIds);

  return (
    <>
      <div role="group" aria-label="filter dev log sections" className="mt-8 flex flex-wrap gap-2">
        {sections.map((section) => {
          const isActive = activeIds.includes(section.id);
          return (
            <button
              key={section.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleId(section.id)}
              className={
                isActive
                  ? "rounded-full border border-accent bg-accent px-4 py-1 text-xs font-semibold text-background"
                  : "rounded-full border border-foreground/20 px-4 py-1 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent"
              }
            >
              {section.label}
            </button>
          );
        })}
      </div>

      {visibleSections.map((section) => (
        <Fragment key={section.id}>{section.node}</Fragment>
      ))}
    </>
  );
}
