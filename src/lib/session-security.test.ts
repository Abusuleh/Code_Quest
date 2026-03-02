import { describe, expect, it } from "vitest";
import {
  computeFingerprint,
  generateSessionToken,
  validateSessionToken,
} from "@/lib/session-security";

describe("session security helpers", () => {
  it("generateSessionToken returns a valid UUID v4", () => {
    const token = generateSessionToken();
    expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it("validateSessionToken returns true when tokens match", () => {
    expect(validateSessionToken("abc", "abc")).toBe(true);
  });

  it("validateSessionToken returns false when tokens differ", () => {
    expect(validateSessionToken("abc", "def")).toBe(false);
  });

  it("validateSessionToken returns false when storedToken is null", () => {
    expect(validateSessionToken(null, "abc")).toBe(false);
  });

  it("computeFingerprint returns consistent SHA-256 for same inputs", () => {
    const first = computeFingerprint("ua|1280|720|UTC");
    const second = computeFingerprint("ua|1280|720|UTC");
    expect(first).toBe(second);
  });

  it("computeFingerprint returns different SHA-256 for different inputs", () => {
    const first = computeFingerprint("ua|1280|720|UTC");
    const second = computeFingerprint("ua|1280|720|Africa/Lagos");
    expect(first).not.toBe(second);
  });
});
