import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SectionHeader from "@/components/SectionHeader";
import SetupGallery from "@/components/credential-flow/SetupGallery";

export const metadata: Metadata = {
  title: "Credential Flow Setup Gallery · Robin Samways",
};

export default function CredentialFlowSetupGalleryPage() {
  return (
    <main className="py-10">
      <PageHeading title="Credential Flow · Setup Gallery">
        The Setup work and live data behind this case study, for anyone who
        wants to dig deeper than the interactive demos.
      </PageHeading>

      <section>
        <SectionHeader title="SETUP_GALLERY" />
        <SetupGallery />
      </section>
    </main>
  );
}
