import type { Metadata } from "next";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In · Robin Samways",
};

export default function SignInPage() {
  return (
    <main className="py-10">
      <h1 className="text-xl font-bold">
        <span className="text-accent">$</span> Sign In
      </h1>
      <p className="mt-2 text-sm text-muted">
        Passwordless — enter your email and we&rsquo;ll send you a link. New
        here? Signing in creates your account automatically.
      </p>

      <div className="mt-8">
        <SignInForm />
      </div>
    </main>
  );
}
