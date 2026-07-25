"use client";

import { useEffect, useState, type FormEvent } from "react";
import { clearSession, getStoredSession, storeSession, type StoredSession } from "./session";

type Status = "idle" | "submitting" | "sent" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function SignInForm() {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [portalStatus, setPortalStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(`${API_URL}/accounts/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!response.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const handleSignOut = () => {
    clearSession();
    setSession(null);
  };

  const handleManageSubscription = async () => {
    if (!session) return;
    setPortalStatus("loading");
    try {
      const response = await fetch(`${API_URL}/billing/portal-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
      });
      if (!response.ok) throw new Error("request failed");
      const data = await response.json();
      window.location.href = data.portal_url;
    } catch {
      setPortalStatus("error");
    }
  };

  if (session) {
    return (
      <div className="max-w-md space-y-4 text-sm">
        <p>
          <span className="text-accent">›</span> Signed in as{" "}
          <span className="font-semibold">{session.email}</span>.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleManageSubscription}
            disabled={portalStatus === "loading"}
            className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
          >
            {portalStatus === "loading" ? "Loading…" : "Manage subscription"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="border border-foreground/20 px-4 py-2 font-semibold text-muted transition hover:border-accent hover:text-accent"
          >
            Sign out
          </button>
        </div>
        {portalStatus === "error" && (
          <p className="text-xs">
            Couldn&rsquo;t open subscription management — you may not have an active
            subscription yet, or something went wrong. Try again shortly.
          </p>
        )}
      </div>
    );
  }

  if (status === "sent") {
    return (
      <p className="max-w-md text-sm">
        <span className="text-accent">›</span> Check your email for a sign-in link. It expires
        in 15 minutes and can only be used once.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4 text-sm">
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
          No password — we&rsquo;ll email you a link instead. New here? Signing in creates
          your account automatically.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send sign-in link"}
      </button>

      {status === "error" && (
        <p className="text-xs">Enter a valid email address and try again.</p>
      )}
    </form>
  );
}
