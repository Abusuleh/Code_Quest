import type { Subscription } from "@prisma/client";

export function canAccessLesson(
  subscription: Subscription | null,
  moduleOrder: number,
  phaseNumber = 1,
): boolean {
  if (phaseNumber === 2 || phaseNumber === 3) {
    if (!subscription) return false;
    if (subscription.plan !== "CHAMPION") return false;
    if (subscription.status === "CANCELLED" || subscription.status === "PAST_DUE") return false;
    return true;
  }

  if (!subscription || subscription.plan === "FREE") return moduleOrder === 1;
  if (subscription.status === "CANCELLED") return moduleOrder === 1;
  if (subscription.status === "PAST_DUE") return moduleOrder === 1;
  return true;
}
