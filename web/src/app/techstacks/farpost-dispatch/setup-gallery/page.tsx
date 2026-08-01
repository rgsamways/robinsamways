import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";
import SetupGallery from "@/components/farpost-dispatch/SetupGallery";

export const metadata: Metadata = {
  title: "Dispatch Setup Gallery · Robin Samways",
};

export default function FarpostDispatchSetupGalleryPage() {
  return (
    <main className="py-10">
      <PageHeading title="Dispatch · Setup Gallery">
        The real Salesforce configuration work behind this piece.
      </PageHeading>

      <section>
        <SectionHeader title="SETUP_GALLERY" />
        <SetupGallery />
      </section>
    </main>
  );
}
