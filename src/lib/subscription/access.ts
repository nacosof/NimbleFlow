import { isPlanId, type PlanId } from "@/config/plans";

export type SubscriptionSnapshot = {
  plan: string;
  planExpiresAt?: Date | null;
};

export function hasProAccess(
  user: SubscriptionSnapshot,
  now: Date = new Date(),
): boolean {
  if (user.plan !== "pro") {
    return false;
  }

  if (!user.planExpiresAt) {
    return true;
  }

  return user.planExpiresAt.getTime() > now.getTime();
}

export function getEffectivePlan(
  user: SubscriptionSnapshot,
  now: Date = new Date(),
): PlanId {
  return hasProAccess(user, now) ? "pro" : "free";
}

export function resolvePlanId(value: string): PlanId {
  if (isPlanId(value)) {
    return value;
  }
  return "free";
}
