import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import ContactForm from "@/components/resume/ContactForm";

export const metadata: Metadata = {
  title: "Contact · Robin Samways",
};

export default function ContactPage() {
  return (
    <main className="py-10">
      <PageHeading title="Contact">
        Have a question, or want to work together? Send a message below.
      </PageHeading>

      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  );
}
