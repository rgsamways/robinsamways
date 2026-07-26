import { afterEach, describe, expect, test } from "vitest";
import { clearSession, getStoredSession, storeSession } from "../session";

describe("storeSession / clearSession — data-signed-in attribute (D4)", () => {
  afterEach(() => {
    clearSession();
  });

  test("storeSession sets data-signed-in and getStoredSession returns the real session", () => {
    storeSession("token-123", "robin@example.com");

    expect(document.documentElement.dataset.signedIn).toBe("true");
    expect(getStoredSession()).toEqual({ token: "token-123", email: "robin@example.com" });
  });

  test("clearSession removes data-signed-in and getStoredSession returns null", () => {
    storeSession("token-123", "robin@example.com");
    clearSession();

    expect(document.documentElement.dataset.signedIn).toBeUndefined();
    expect(getStoredSession()).toBeNull();
  });

  test("clearSession is a no-op when no session was ever stored", () => {
    clearSession();

    expect(document.documentElement.dataset.signedIn).toBeUndefined();
    expect(getStoredSession()).toBeNull();
  });
});
