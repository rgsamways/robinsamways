import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "Settings · Robin Samways",
};

export default function SettingsPage() {
  return (
    <main className="py-10">
      <PageHeading title="Settings">
        Isn&rsquo;t live yet — check back soon.
      </PageHeading>
    </main>
  );
}
