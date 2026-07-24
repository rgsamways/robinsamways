import { Archivo_Black, Inter, Playfair_Display, Poppins, Work_Sans } from "next/font/google";

// Only used inside the /prototype mock. The real site stays JetBrains
// Mono-only (see app/layout.tsx) — this exists to demo the handoff doc's
// own assumption (design-system-handoff.md §1) that a reference-style page
// wants a sans body/heading font, reserving mono for code/commands.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Third mock theme ("Ad") — a bold poster-style display face for headings
// paired with a friendlier geometric sans for body copy, distinct from the
// handoff theme's Inter so the two "sans" themes don't read as the same.
export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ad-heading",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-ad-body",
});

// Fourth mock theme ("Vocare") — modeled on vocare.ca's warm, editorial
// therapy-app look: an italic serif wordmark/headings paired with a plain
// humanist sans for body copy.
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-vocare-heading",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-vocare-body",
});
