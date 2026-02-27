import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "@/lib/password";

describe("password helpers", () => {
  it("hashes and verifies passwords", async () => {
    const plain = "QuestPass123";
    const hash = await hashPassword(plain);
    expect(hash).not.toBe(plain);
    await expect(comparePassword(plain, hash)).resolves.toBe(true);
    await expect(comparePassword("WrongPass", hash)).resolves.toBe(false);
  });
});
