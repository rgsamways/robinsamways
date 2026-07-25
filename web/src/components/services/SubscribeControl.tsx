"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getStoredSession } from "../session";

type Status = "idle" | "submitting" | "invalid-email" | "request-failed";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function SubscribeControl() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setSessionEmail(getStoredSession()?.email ?? null);
  }, []);

  const startCheckout = async (checkoutEmail: string) => {
    setStatus("submitting");
    try {
      const response = await fetch(`${API_URL}/billing/checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: checkoutEmail }),
      });
      if (!response.ok) throw new Error("request failed");
      const data = await response.json();
      window.location.href = data.checkout_url;
    } catch {
      setStatus("request-failed");
    }
  };

  if (sessionEmail) {
    return (
      <div className="mt-4 text-sm">
        <button
          type="button"
          onClick={() => startCheckout(sessionEmail)}
          disabled={status === "submitting"}
          className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
        >
          {status === "submitting" ? "Redirecting…" : "Subscribe — $12/year"}
        </button>
        {status === "request-failed" && (
          <p className="mt-2 text-xs">Something went wrong — please try again.</p>
        )}
      </div>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("invalid-email");
      return;
    }
    startCheckout(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 max-w-sm space-y-3 text-sm">
      <div>
        <label htmlFor="subscribe-email" className="block font-semibold text-accent">
          email
        </label>
        <input
          id="subscribe-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full border border-foreground/20 bg-transparent px-3 py-2 focus:border-accent focus:outline-none"
        />
        <p className="mt-1 text-xs text-muted">
          No account yet? Subscribing creates one automatically.
        </p>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-accent px-4 py-2 font-semibold text-accent transition hover:bg-accent hover:text-background disabled:opacity-50"
      >
        {status === "submitting" ? "Redirecting…" : "Subscribe — $12/year"}
      </button>
      {status === "invalid-email" && (
        <p className="text-xs">Enter a valid email address and try again.</p>
      )}
      {status === "request-failed" && (
        <p className="text-xs">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
