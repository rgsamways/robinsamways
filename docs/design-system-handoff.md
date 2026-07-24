# Design System Handoff — "Reference Page" Template

Source: the Linux reference page (dark / teal / amber, sticky TOC, concept + quick-ref pattern).
Target: `robinsamways.ca` — Next.js 16 (App Router, Turbopack), React, TypeScript, Tailwind CSS v4, JetBrains Mono via `next/font`.

This doc is written to be dropped into the `web/` repo and worked on there (in Claude Code or an editor) — it can't be verified against your actual file structure from outside the repo. Treat every path below as a *suggested* location, not a confirmed one.

---

## 1. Design tokens → Tailwind v4 `@theme`

Tailwind v4 configures via CSS, not `tailwind.config.js`. These tokens go in your global stylesheet (likely `app/globals.css`) inside an `@theme` block:

```css
@theme {
  --color-bg: #12151a;
  --color-panel: #181c22;
  --color-border: #2a2f38;
  --color-text: #dce1e8;
  --color-muted: #7d8794;
  --color-accent: #5fb4a2;
  --color-accent-dim: #3a6b60;
  --color-concept: #c98a3a;
  --color-concept-dim: #6b4d24;
  --color-code-bg: #0d0f13;
}
```

This makes classes like `bg-bg`, `text-muted`, `border-accent-dim`, `bg-concept/10` (opacity modifier) available directly — no separate config file to maintain.

**Fonts:** JetBrains Mono is already self-hosted via `next/font` — reuse that binding for all `<code>`/`<pre>` content rather than re-declaring it. Add a sans-serif (Inter is what the original page assumed) the same way if not already present, and expose both as CSS variables the `@theme` block can reference (`--font-mono`, `--font-sans`), consistent with how `next/font` typically hands you a variable to wire into Tailwind.

---

## 2. Component scaffold

Suggested breakdown — each is a small, composable piece rather than one monolithic page component:

```
components/reference/
  ReferenceLayout.tsx     — two-column shell: sticky TOC + main content
  TocSidebar.tsx          — sticky nav, takes a list of {id, label} + optional legend
  ReferenceSection.tsx    — <section id=...> wrapper with heading + optional "unreviewed" badge
  ConceptBlock.tsx        — the amber "why/judgment" callout
  QuickRefEntry.tsx       — the teal "syntax" block (desc + <pre><code>)
  TroubleshootTable.tsx   — symptom → numbered steps → command table
  DraftFlag.tsx           — small badge ("unreviewed", "draft", etc.)
```

### `ReferenceLayout.tsx` (sketch)

```tsx
type TocItem = { id: string; label: string };

export function ReferenceLayout({
  toc,
  legend,
  children,
}: {
  toc: TocItem[];
  legend?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-w-6xl mx-auto">
      <TocSidebar toc={toc} legend={legend} />
      <main className="flex-1 px-10 pb-20 pt-6 min-w-0">{children}</main>
    </div>
  );
}
```

### `TocSidebar.tsx` (sketch)

```tsx
export function TocSidebar({ toc, legend }: { toc: TocItem[]; legend?: React.ReactNode }) {
  return (
    <nav className="sticky top-0 self-start h-screen overflow-y-auto w-[230px] shrink-0
                     border-r border-border px-4 py-6">
      <h2 className="text-xs uppercase tracking-wider text-muted mb-3">Contents</h2>
      <ul>
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block px-2 py-1.5 rounded text-text text-sm hover:bg-panel hover:text-accent"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {legend && <div className="mt-7 pt-4 border-t border-border">{legend}</div>}
    </nav>
  );
}
```

### `ConceptBlock.tsx` / `QuickRefEntry.tsx` (sketch)

```tsx
export function ConceptBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-concept/[0.06] border border-concept-dim border-l-[3px] border-l-concept
                     rounded-md px-[18px] py-3.5 mb-5 text-[0.92rem]">
      <span className="inline-block text-[0.65rem] uppercase tracking-wider font-semibold
                        px-1.5 py-0.5 rounded mb-2 text-concept bg-concept/10 border border-concept-dim">
        Concept
      </span>
      {children}
    </div>
  );
}

export function QuickRefEntry({ desc, code }: { desc: React.ReactNode; code: React.ReactNode }) {
  return (
    <div className="mb-5">
      <span className="inline-block text-[0.65rem] uppercase tracking-wider font-semibold
                        px-1.5 py-0.5 rounded mb-2 text-accent bg-accent/10 border border-accent-dim">
        Quick ref
      </span>
      <div className="text-[0.92rem] text-muted mb-1.5">{desc}</div>
      <pre className="bg-code-bg border border-border border-l-[3px] border-l-accent-dim
                       rounded-md px-3.5 py-3 overflow-x-auto">
        <code className="font-mono text-[0.87rem]">{code}</code>
      </pre>
    </div>
  );
}
```

`TroubleshootTable` and `DraftFlag` follow the same pattern — lift the markup straight from the HTML source, convert `class` → `className`, convert inline `style` attributes to Tailwind classes or `@theme`-driven utility classes, and swap raw CSS values for the token names above wherever they match.

---

## 3. What's genuinely reusable vs. what needs rework

**Ports over cleanly:**
- Color palette and semantic meaning (teal = reference, amber = judgment/concept)
- The concept/quick-ref content pattern itself
- The troubleshooting table structure (symptom → step → command)
- Sticky sidebar TOC behavior

**Needs real rework, not just a class-name swap:**
- Anchor-link navigation may behave differently inside Next.js App Router depending on whether sections live on one page or are routed — if content spans multiple pages, in-page anchors won't work across routes and this needs either a single long page per topic or a different nav pattern
- Any inline `<style>` custom properties become Tailwind's `@theme` tokens (done above) — the raw CSS file itself isn't the artifact that moves over, the *tokens* are
- Responsive breakpoints were hand-rolled in the original CSS; Tailwind's default breakpoint scale may need double-checking against the original mobile behavior (single-column collapse under ~800px)

---

## 4. Plan for converting existing pages

1. **Land the tokens first.** Add the `@theme` block and confirm the color/font tokens render correctly on one throwaway test page before touching real content — this de-risks the rest of the migration.
2. **Build the component set** (section 2) against that test page, not live content, so breakage doesn't touch anything real.
3. **Pick one low-stakes existing page as the pilot conversion** — ideally something short and non-critical — and convert it fully to the new components. This surfaces integration issues (routing, layout conflicts with any existing global layout/header/footer) cheaply.
4. **Establish the content pattern per page type.** Not every page needs Concept + Quick Ref + Troubleshooting — decide per page which of the three component types actually apply, rather than forcing all three everywhere.
5. **Convert remaining pages one at a time**, in order of simplicity rather than importance, so any recurring integration problem gets solved on an easy page rather than the one that matters most.
6. **Retrofit the layout shell last** — once 2-3 pages use the new components successfully, consider whether the sticky-TOC two-column shell becomes the site's shared layout (e.g. a `layout.tsx` at the relevant route segment) rather than something each page wires up individually.

---

## Handoff note

This document is a starting scaffold, not tested code — none of the TSX above has been run against your actual repo structure (App Router file conventions, existing global layout, whatever's already in `app/globals.css`). The right next step is opening this alongside the real `web/` project — Claude Code in that repo could actually wire the tokens into your existing `globals.css`, scaffold the components against your real file layout, and convert the pilot page for real, rather than guessing at paths from outside the project.
