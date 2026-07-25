"use client";

import { useState, type FormEvent } from "react";

type Mode = "sign-in" | "sign-up";
type Status = "idle" | "unavailable";

// Passwordless by design — matches the account-auth capability already
// specified in openspec/changes/services-payments (magic-link email,
// mirroring Vocare's real better-auth config), not yet implemented in api/.
// Submitting shows an honest "not live yet" state rather than a fake
// success message, since there's no real backend to send a link.
export default function SignInForm() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("unavailable");
  };

  return (
    <div className="max-w-md">
      <div className="mb-4 flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => {
            setMode("sign-in");
            setStatus("idle");
          }}
          aria-pressed={mode === "sign-in"}
          className={
            mode === "sign-in" ? "font-semibold text-accent" : "text-muted hover:text-accent"
          }
        >
          Sign In
        </button>
        <span className="text-muted">/</span>
        <button
          type="button"
          onClick={() => {
            setMode("sign-up");
            setStatus("idle");
          }}
          aria-pressed={mode === "sign-up"}
          className={
            mode === "sign-up" ? "font-semibold text-accent" : "text-muted hover:text-accent"
          }
        >
          Sign Up
        </button>
      </div>

      {status === "unavailable" ? (
        <p className="text-sm">
          <span className="text-accent">›</span> Sign-in isn&rsquo;t live yet
          — check back soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-sm">
          <div>
            <label htmlFor="signin-email" className="block font-semibold text-accent">
              email
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted">
              No password — we&rsquo;ll email you a link instead.
            </p>
          </div>

          <button
            type="submit"
            className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background"
          >
            {mode === "sign-in" ? "Send sign-in link" : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
