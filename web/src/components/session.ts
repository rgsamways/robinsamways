// Client-side storage for the bearer session token account-auth's
// `/accounts/verify` route returns — see docs on why this is a token rather
// than a cookie: `web/src/lib` doesn't exist as a convention here, so this
// sits alongside `theme.ts`/`feedback.ts`'s small-shared-logic pattern.
const SESSION_TOKEN_KEY = "rsw_session_token";
const SESSION_EMAIL_KEY = "rsw_session_email";

export type StoredSession = { token: string; email: string };

export function getStoredSession(): StoredSession | null {
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  const email = localStorage.getItem(SESSION_EMAIL_KEY);
  if (!token || !email) return null;
  return { token, email };
}

// D4 (mobile-chrome-redesign): also flips `data-signed-in` on <html> at the
// same moment as the localStorage write, read live by globals.css's
// signed-in-only/signed-out-only rules — RightRail mounts once at the root
// layout and never remounts on client-side navigation, so a React state
// read on mount would go stale the instant a visitor signs in or out.
export function storeSession(token: string, email: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_EMAIL_KEY, email);
  document.documentElement.dataset.signedIn = "true";
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_EMAIL_KEY);
  delete document.documentElement.dataset.signedIn;
}
