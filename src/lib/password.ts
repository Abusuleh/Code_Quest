import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(value: string) {
  return bcrypt.hash(value, SALT_ROUNDS);
}

export async function comparePassword(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}
