import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In · Robin Samways",
};

export default function SignInPage() {
  return (
    <main className="py-10">
      <PageHeading title="Sign In">
        Passwordless — enter your email and we&rsquo;ll send you a link. New
        here? Signing in creates your account automatically.
      </PageHeading>

      <div className="mt-8">
        <SignInForm />
      </div>
    </main>
  );
}
