import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import VerifySignIn from "@/components/VerifySignIn";

export const metadata: Metadata = {
  title: "Verifying Sign-In · Robin Samways",
};

export default async function VerifySignInPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="py-10">
      <PageHeading title="Sign In" />

      <div className="mt-8">
        <VerifySignIn token={token ?? null} />
      </div>
    </main>
  );
}
