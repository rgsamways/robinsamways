import type { Metadata } from "next";
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
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Sign In
      </h1>

      <div className="mt-8">
        <VerifySignIn token={token ?? null} />
      </div>
    </main>
  );
}
