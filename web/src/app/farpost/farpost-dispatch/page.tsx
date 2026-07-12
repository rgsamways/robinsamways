import type { Metadata } from "next";
import FarpostTabBar from "@/components/farpost/FarpostTabBar";

export const metadata: Metadata = {
  title: "Farpost Dispatch · Robin Samways",
};

export default function FarpostDispatchPage() {
  return (
    <main className="py-10">
      <FarpostTabBar />
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Dispatch
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed">
        Coming soon &mdash; a Salesforce Experience Cloud partner portal
        matching field professionals to jobs across rural coverage areas, a
        direct callback to Farpost&rsquo;s own founding story: the rural
        service-availability gap that started all of this. Proves building{" "}
        <em>inside</em> Salesforce, not just integrating with it from the
        outside, the way Credential Flow does.
      </p>
    </main>
  );
}
