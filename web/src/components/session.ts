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

export function storeSession(token: string, email: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_EMAIL_KEY, email);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_EMAIL_KEY);
}
