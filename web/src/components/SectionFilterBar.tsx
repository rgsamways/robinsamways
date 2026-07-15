"use client";

import { Fragment, useState, type ReactNode } from "react";
import PillBar from "./PillBar";
import { filterSections } from "./filterSections";

type Section = {
  id: string;
  label: string;
  node: ReactNode;
};

export default function SectionFilterBar({
  sections,
  ariaLabel,
}: {
  sections: Section[];
  ariaLabel: string;
}) {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  function toggleId(id: string) {
    setActiveIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  const visibleSections = filterSections(sections, activeIds);
  const pills = sections.map((section) => ({ id: section.id, label: section.label }));

  return (
    <>
      <PillBar pills={pills} activeIds={activeIds} onToggle={toggleId} ariaLabel={ariaLabel} />

      {visibleSections.map((section) => (
        <Fragment key={section.id}>{section.node}</Fragment>
      ))}
    </>
  );
}
