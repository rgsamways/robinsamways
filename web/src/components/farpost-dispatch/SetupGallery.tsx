"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type GalleryItem = {
  src: string;
  width: number;
  height: number;
  label: string;
  caption: string;
};

// Empty until Robin captures real Experience Cloud / Named Credential
// screenshots (per experiments-record-pages' design.md) — the component and
// page are complete and ready to render real items the moment they exist.
const GALLERY_ITEMS: GalleryItem[] = [];

export default function SetupGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openIndex]);

  const active = openIndex !== null ? GALLERY_ITEMS[openIndex] : null;

  if (GALLERY_ITEMS.length === 0) {
    return (
      <p className="text-sm leading-relaxed">
        Screenshots coming soon &mdash; the real Experience Cloud site setup,
        Partner Community licensing, and Named Credential configuration
        behind this piece haven&rsquo;t been captured yet. This page ships
        as an honest placeholder until they are, the same pattern as this
        site&rsquo;s Bug List when there&rsquo;s genuinely nothing logged
        yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_ITEMS.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="text-left"
          >
            <Image
              src={item.src}
              alt={item.label}
              width={item.width}
              height={item.height}
              className="h-auto w-full border border-foreground/20 transition hover:border-accent"
            />
            <p className="mt-1 text-xs text-muted">{item.label}</p>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-auto border border-accent bg-background p-4"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center text-lg text-accent hover:bg-accent hover:text-background"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.label}
              className="max-h-[70vh] w-full object-contain"
            />
            <p className="mt-3 text-xs leading-relaxed">{active.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
