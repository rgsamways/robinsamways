import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import TechStacksBrowser from "@/components/techstacks/TechStacksBrowser";

const TAGS = [
  "Salesforce",
  "OAuth 2.0",
  "Anthropic AI",
  "Azure",
  "Python",
  "TypeScript",
  "PostgreSQL",
  "AWS",
];

const PROJECTS = [
  {
    slug: "credential-flow",
    title: "Credential Flow",
    teaser:
      "Salesforce Loan Demo — a live Salesforce integration case study: OAuth 2.0 Client Credentials Flow, a custom Loan Application object model, AI-assisted recommendations, and a real Field History Tracking timeline.",
    tags: ["Salesforce", "OAuth 2.0", "Anthropic AI"],
  },
];

export const metadata: Metadata = {
  title: "Experiments · Robin Samways",
};

export default function TechStacksPage() {
  return (
    <main className="py-10">
      <PageHeading title="Experiments">
        Standalone technical experiments with no relation to a named,
        ongoing project like Farpost or Vocare &mdash; a place to try a
        stack or a concept just to see if it can be built.
      </PageHeading>

      <TechStacksBrowser tags={TAGS} projects={PROJECTS} />
    </main>
  );
}
