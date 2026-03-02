import type { Subscription } from "@prisma/client";

export function canAccessLesson(subscription: Subscription | null, moduleOrder: number): boolean {
  if (!subscription || subscription.plan === "FREE") return moduleOrder === 1;
  if (subscription.status === "CANCELLED") return moduleOrder === 1;
  if (subscription.status === "PAST_DUE") return moduleOrder === 1;
  return true;
}
