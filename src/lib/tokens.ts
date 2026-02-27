import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET ?? "dev_secret";

export function signEmailToken(payload: { userId: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
}

export function verifyEmailToken(token: string): { userId: string } {
  return jwt.verify(token, SECRET) as { userId: string };
}
