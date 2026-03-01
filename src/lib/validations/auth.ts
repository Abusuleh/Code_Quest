import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
  name: z.string().min(2).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const childCreateSchema = z.object({
  username: z.string().min(3),
  displayName: z.string().min(2),
  dateOfBirth: z.string(),
  avatarConfig: z.record(z.string(), z.unknown()),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
});
