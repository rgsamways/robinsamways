import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import { THEME_STORAGE_KEY } from "@/components/theme";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Robin Samways",
  description: "Senior Application Developer · Founder, Farpost",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
                  var theme =
                    stored === "light" || stored === "dark"
                      ? stored
                      : window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "light";
                  if (theme === "dark") document.documentElement.classList.add("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
