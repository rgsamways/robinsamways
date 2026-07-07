# Issues / QA notes

Quick "take a look at this and tell me what's missing or wrong" capture — screenshots, console warnings, small visual bugs. This is not the Sreditor R&D log (`docs/sreditor/`) and not a formal OpenSpec change — just a running list Robin flags as he spots things in the running app, for CLI to pick up and check off.

Each entry includes the literal handoff text given to CLI, not just a summary, so this file is a self-contained record of what CLI was actually told.

## Open

(none)

## Resolved

- [x] 2026-07-07 — Header shifts a couple of pixels when the menu toggle switches between ☰ and ✕ — the two glyphs have different natural widths in the monospace font, so the button (and everything to its right, including the "$ Robin Samways" title) reflows on toggle.

  **Handoff given to CLI (2026-07-07):**
  > Fix the layout shift in `web/src/components/MenuToggle.tsx`: the toggle button currently has no fixed width, so switching its content between "☰" and "✕" changes the button's width slightly (different glyph widths) and shifts the header text next to it by a couple of pixels. Give the button a fixed width/height (e.g. a fixed-size flex container with the glyph centered inside) so toggling never changes its footprint. Verify by toggling the menu open/closed repeatedly and confirming the header title doesn't move. Check off in `docs/issues.md` when done.

  **Resolution:** gave the toggle `<button>` a fixed `h-8 w-8` flex container (`flex items-center justify-center`) in `web/src/components/MenuToggle.tsx`, so its footprint no longer depends on the glyph's natural width. Verified by toggling the button 6 times via headless browser and measuring both the button's bounding box and the header title's x-position on each toggle — button stayed at a constant 32×32px, title x-position never moved (184px every time).

- [x] 2026-07-07 — Headshot image (`/images/headshot.png` via `next/image` in `Header.tsx`) throws a repeated console warning: "Image with src ... has either width or height modified, but not the other. ... include the styles 'width: \"auto\"' or 'height: \"auto\"'." Likely a Tailwind class constraining one dimension without the matching `auto`. Seen on every route (`/`, `/portfolio`, `/farpost`, `/thoughts`).

  **Handoff given to CLI (2026-07-07):**
  > Fix the console warning flagged in `docs/issues.md`: the headshot image (`web/src/components/Header.tsx`, `next/image` with `src="/images/headshot.png"`) throws a repeated Next.js warning on every route — "has either width or height modified, but not the other... include the styles `width: "auto"` or `height: "auto"`." Track down the Tailwind class constraining one dimension without the matching `auto` and fix it so the warning clears.
  >
  > Note: a root `CLAUDE.md` now exists in the repo with the Chat/CLI role split, the OpenSpec workflow, `docs/issues.md` (lightweight QA flags), and `docs/sreditor/` (contemporaneous SR&ED R&D notes — only log something there if it involves genuine technological uncertainty, not routine fixes like this one). Check off the item in `docs/issues.md` once resolved, verify no console warning on any of the four routes, and report back.

  **Resolution:** Root cause was Tailwind's preflight base layer, which sets `img { max-width: 100%; height: auto; }` globally. That `height: auto` fought the explicit `width={96} height={96}` props on the `next/image` element (nothing in `Header.tsx` set a matching CSS height), which is exactly the "one dimension modified, not the other" case Next.js warns about. Fixed by adding `h-24 w-24` (96px, matching the `width`/`height` props) to the image's className in `web/src/components/Header.tsx`, so both dimensions are explicitly and consistently set. Verified with a headless-browser console check across `/`, `/portfolio`, `/farpost`, `/thoughts` — zero warnings/errors on any route.

- [x] 2026-07-07 — Robin flagged (by eye, via screenshot) that the headshot still looked visually wrong after the console-warning fix above: a dark navy rounded-square shadow visible behind/below-left of the photo. Initially misdiagnosed as a stale Hot Module Reload paint artifact (a fresh headless-browser screenshot appeared clean at a glance); Robin's hard-refresh screenshot proved it was still there, and a closer high-DPI crop confirmed it.

  **Root cause:** the shadow was baked directly into the pixels of `web/public/images/headshot.png` itself — not a CSS bug at all. That file had been extracted from the embedded image inside `resume.pdf` in an earlier session; the PDF's design applied a drop-shadow + rounded-corner frame to the photo, and that got rasterized into the same bitmap before being embedded, so extracting "the headshot" from the PDF pulled out the shadow along with it.

  **Resolution:** cropped `headshot.png` down to just the photo content (300×300 region inset from the shadow/frame, trimmed to 293×294 with a small safety margin), removing the baked-in shadow entirely and letting the existing CSS (`rounded-xl` + `object-cover`) apply the rounded-corner treatment instead. Also had to clear Next's dev image-optimizer cache (`web/.next/dev/cache/images/`) — it was serving the old rasterized shadow from cache even after the source file changed, which is why the first re-check after the crop still showed the shadow. Verified with a fresh high-DPI screenshot of the rendered element (clean, no shadow) and a full console check across all four routes (zero warnings/errors).
