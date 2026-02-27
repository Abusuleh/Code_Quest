import { z } from "zod";

export const childProfileSchema = z.object({
  username: z.string().min(3),
  displayName: z.string().min(2),
  dateOfBirth: z.string(),
  avatarConfig: z.record(z.unknown()),
});
