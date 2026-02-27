import { describe, expect, it } from "vitest";
import { signEmailToken, verifyEmailToken } from "@/lib/tokens";

describe("email token helpers", () => {
  it("signs and verifies tokens", () => {
    const token = signEmailToken({ userId: "user_123" });
    const payload = verifyEmailToken(token);
    expect(payload.userId).toBe("user_123");
  });
});
