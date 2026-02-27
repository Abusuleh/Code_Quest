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
  displayName: z.string().min(2),
  dateOfBirth: z.string(),
  avatarId: z.string().min(1),
  pin: z.string().length(4),
});
