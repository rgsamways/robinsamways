"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getStoredSession } from "./session";

// D6: rendered only when a real session exists at mount — this page's own
// small client check, distinct from the rail's attribute-driven approach,
// since this page needs the actual boolean now, not just a CSS toggle.
export default function AccountSignOut() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(getStoredSession() !== null);
  }, []);

  if (!signedIn) return null;

  function handleSignOut() {
    clearSession();
    // No hard reload needed — clearSession() already flips data-signed-in
    // directly, so a plain client-side navigation is enough (D4's side
    // benefit).
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="mt-4 rounded-md border border-foreground/20 px-4 py-2 text-sm hover:border-accent hover:text-accent"
    >
      Sign Out
    </button>
  );
}
