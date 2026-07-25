"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { storeSession } from "./session";

type Status = "verifying" | "success" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function VerifySignIn({ token }: { token: string | null }) {
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`${API_URL}/accounts/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!response.ok) throw new Error("request failed");
        const data = await response.json();
        if (cancelled) return;
        storeSession(data.session_token, data.email);
        setStatus("success");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "verifying") {
    return <p className="text-sm text-muted">Verifying your sign-in link…</p>;
  }

  if (status === "success") {
    return (
      <p className="text-sm">
        <span className="text-accent">›</span> You&rsquo;re signed in. Head back to{" "}
        <Link href="/sign-in" className="text-accent underline">
          Sign In
        </Link>{" "}
        to manage your subscription.
      </p>
    );
  }

  return (
    <p className="text-sm">
      This sign-in link is invalid, expired, or already used.{" "}
      <Link href="/sign-in" className="text-accent underline">
        Request a new one
      </Link>
      .
    </p>
  );
}
