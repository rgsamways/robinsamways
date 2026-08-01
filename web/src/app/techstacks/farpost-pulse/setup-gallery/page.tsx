import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";
import SetupGallery from "@/components/farpost-pulse/SetupGallery";

export const metadata: Metadata = {
  title: "Pulse Setup Gallery · Robin Samways",
};

export default function FarpostPulseSetupGalleryPage() {
  return (
    <main className="py-10">
      <PageHeading title="Pulse · Setup Gallery">
        The real Azure configuration work behind this piece.
      </PageHeading>

      <section>
        <SectionHeader title="SETUP_GALLERY" />
        <SetupGallery />
      </section>
    </main>
  );
}
