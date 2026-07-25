import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import DrawerNav from "@/components/DrawerNav";
import FeedbackWidget from "@/components/FeedbackWidget";
import Header from "@/components/Header";
import RightRail from "@/components/RightRail";
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
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-20 h-16 bg-background xl:hidden"
        />
        <div className="mx-auto flex max-w-6xl">
          <DrawerNav />
          <div className="min-w-0 flex-1 px-6 pb-10 pt-16 xl:px-10 xl:pt-10">
            <div className="max-w-3xl">
              <Header />
              {children}
              <FeedbackWidget />
            </div>
          </div>
          <RightRail />
        </div>
      </body>
    </html>
  );
}
