import type { Metadata } from "next";
import AccountSignOut from "@/components/AccountSignOut";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "Account · Robin Samways",
};

export default function AccountPage() {
  return (
    <main className="py-10">
      <PageHeading title="Account">
        Isn&rsquo;t live yet — check back soon.
      </PageHeading>
      <AccountSignOut />
    </main>
  );
}
