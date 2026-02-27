import { z } from "zod";

export const pinSchema = z.object({
  pin: z.string().length(4),
});

export const childProfileSchema = z.object({
  displayName: z.string().min(2),
  dateOfBirth: z.string(),
  avatarId: z.string().min(1),
  pin: z.string().length(4),
});
