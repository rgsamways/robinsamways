"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";

type GalleryItem = {
  src: string;
  width: number;
  height: number;
  label: string;
  caption: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/images/salesforce-setup/flow.png",
    width: 2560,
    height: 1347,
    label: "The Decision Date Flow",
    caption:
      "The Record-Triggered Flow that stamps a Decision Date the instant a Loan Application's Status changes to Approved or Denied. It runs as a ‘Before Save’ flow — since it only needs to set a field on the record already being saved, there's no reason to pay the overhead of a separate ‘after save’ update. Two entry conditions (Status = Approved OR Status = Denied) keep it from evaluating on every save, and it's optimized for Fast Field Updates specifically because ‘set one field’ is exactly the operation that optimization exists for.",
  },
  {
    src: "/images/salesforce-setup/fields.png",
    width: 2560,
    height: 1348,
    label: "The Loan_Application__c object model",
    caption:
      "The full field list on the custom Loan_Application__c object: a lookup to the standard Contact object (Applicant), a lookup to the standard Account object, a Currency field for Amount Requested, a Status picklist, and two Date fields for Submitted Date and Decision Date. Deliberately unglamorous — the point of this case study isn't an exotic data model, it's demonstrating that the same Account/Contact/custom-object relationship pattern used in any real Salesforce implementation works end-to-end here, from Setup through to a live API.",
  },
  {
    src: "/images/salesforce-setup/oauth.png",
    width: 2560,
    height: 1347,
    label: "OAuth Client Credentials Flow config",
    caption:
      "The External Client App's OAuth configuration — Client Credentials Flow enabled, a dedicated ‘Run As’ integration user, and IP Relaxation allowing the API server's requests through. This is the server-to-server authentication described above in practice: no user ever logs in through a browser, and the FastAPI backend authenticates directly against this configuration on every token request.",
  },
  {
    src: "/images/salesforce-setup/record-details.png",
    width: 2560,
    height: 1340,
    label: "A real Loan Application record",
    caption:
      "A real Loan Application record — Jack Willis's $3,150 request against the Willis Estate account, currently Under Review. Every value shown, including the resolved Applicant and Account lookups, was created through this site's own live demo widget against this Salesforce org, not staged or mocked.",
  },
  {
    src: "/images/salesforce-setup/record-related.png",
    width: 2560,
    height: 1340,
    label: "Field History Tracking on that record",
    caption:
      "Salesforce's own Field History Tracking, not a derived or fabricated timeline: this record's Status moved from Submitted to Under Review, and Salesforce logged the transition automatically — old value, new value, the user who made the change, and a timestamp. This is the real audit trail behind the status history shown in the Relationship View above, built on the same ‘computed from actual events, not a stored score’ principle described in the Farpost parallel.",
  },
  {
    src: "/images/salesforce-setup/railway.png",
    width: 2560,
    height: 1344,
    label: "Railway production config vars",
    caption:
      "Production environment variables for the /api Railway service, values masked — SALESFORCE_DOMAIN, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, and ANTHROPIC_API_KEY among them. This is the only place real credentials exist outside Salesforce's and Anthropic's own consoles: never committed to the repo, never exposed to the browser, injected at deploy time.",
  },
];

export default function SetupGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openIndex]);

  const active = openIndex !== null ? GALLERY_ITEMS[openIndex] : null;

  return (
    <section>
      <SectionHeader id="setup-gallery" title="SETUP_GALLERY" />
      <p className="mb-4 text-sm leading-relaxed">
        The Setup work and live data behind this case study, for anyone who
        wants to dig deeper than the interactive demos above.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_ITEMS.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="text-left"
          >
            <Image
              src={item.src}
              alt={item.label}
              width={item.width}
              height={item.height}
              className="h-auto w-full border border-foreground/20 transition hover:border-accent"
            />
            <p className="mt-1 text-xs text-muted">{item.label}</p>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-auto border border-accent bg-background p-4"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center text-lg text-accent hover:bg-accent hover:text-background"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.label}
              className="max-h-[70vh] w-full object-contain"
            />
            <p className="mt-3 text-xs leading-relaxed">{active.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
