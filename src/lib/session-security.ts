import { createHash, randomUUID } from "crypto";

export function generateSessionToken(): string {
  return randomUUID();
}

export function validateSessionToken(
  storedToken: string | null | undefined,
  sessionToken: string | null | undefined,
): boolean {
  if (!storedToken || !sessionToken) return false;
  return storedToken === sessionToken;
}

export function computeFingerprint(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
