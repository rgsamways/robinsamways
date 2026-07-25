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
  "Geospatial",
  "Experience Cloud",
];

const PROJECTS = [
  {
    slug: "credential-flow",
    title: "Credential Flow",
    teaser:
      "Salesforce Loan Demo — a live Salesforce integration case study: OAuth 2.0 Client Credentials Flow, a custom Loan Application object model, AI-assisted recommendations, and a real Field History Tracking timeline.",
    tags: ["Salesforce", "OAuth 2.0", "Anthropic AI"],
  },
  {
    slug: "farpost-atlas",
    title: "Farpost Atlas",
    teaser:
      "A real geospatial join against Statistics Canada census boundary data — real GIS work, not pins on a map. Explores an idea relevant to Farpost without being built as Farpost.",
    tags: ["Geospatial", "PostgreSQL", "TypeScript"],
  },
  {
    slug: "farpost-dispatch",
    title: "Farpost Dispatch",
    teaser:
      "A Salesforce-native partner network — Experience Cloud, Apex, and an AI-assisted matching service, built to prove Salesforce skills from inside the platform, not just integrating with it.",
    tags: ["Salesforce", "Experience Cloud", "Anthropic AI"],
  },
  {
    slug: "farpost-pulse",
    title: "Farpost Pulse",
    teaser:
      "A field-tech coaching dashboard — real Azure serverless, built to get genuine hands-on time with a stack worth actually knowing, not just reading about.",
    tags: ["Azure", "TypeScript", "Anthropic AI"],
  },
];

export const metadata: Metadata = {
  title: "Experiments · Robin Samways",
};

export default function TechStacksPage() {
  return (
    <main className="py-10">
      <PageHeading title="Experiments">
        Standalone technical experiments, whether or not the idea they
        explore relates to a named, ongoing project like Farpost or Vocare
        &mdash; a place to try a stack or a concept just to see if it can be
        built.
      </PageHeading>

      <TechStacksBrowser tags={TAGS} projects={PROJECTS} />
    </main>
  );
}
