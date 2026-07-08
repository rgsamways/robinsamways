"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function InfoTooltip({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || focused || pinned;

  const id = useId();
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHovered(false);
        setFocused(false);
        setPinned(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setPinned(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        aria-label="More info"
        onClick={() => setPinned((value) => !value)}
        onFocus={(event) => {
          // Only keyboard/programmatic focus should open the tooltip via
          // this path — a mouse click naturally focuses the button too
          // (in Chromium), which would otherwise keep it open after the
          // click that was meant to un-pin it.
          if (event.target.matches(":focus-visible")) setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        className="mx-1 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-accent align-middle text-[10px] leading-none text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        ⓘ
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-20 mt-2 w-72 max-w-[80vw] -translate-x-1/2 border border-accent bg-skills-bg px-3 py-2 text-xs font-normal leading-relaxed text-foreground shadow-md"
        >
          {text}
        </span>
      )}
    </span>
  );
}
