import { eq } from "drizzle-orm";

import { plans, type PlanId } from "@/config/plans";
import { db, tables } from "@/db/runtime";
import { resolvePlanId } from "@/lib/subscription/access";

export type GrantPlanInput = {
  userId: string;
  plan: PlanId | string;
  now?: Date;
  periodDays?: number | null;
};

export async function grantPlan(input: GrantPlanInput) {
  const plan = resolvePlanId(input.plan);
  const now = input.now ?? new Date();
  const database = db();
  const schema = tables();

  let planExpiresAt: Date | null = null;

  if (plan !== "free") {
    const days =
      input.periodDays === undefined
        ? plans[plan].periodDays
        : input.periodDays;

    if (days != null && days > 0) {
      planExpiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    }
  }

  await database
    .update(schema.users)
    .set({
      plan,
      planExpiresAt,
    })
    .where(eq(schema.users.id, input.userId));

  return {
    userId: input.userId,
    plan,
    planExpiresAt,
  };
}

export async function revokePlan(userId: string) {
  return grantPlan({ userId, plan: "free" });
}

export async function getUserSubscription(userId: string) {
  const database = db();
  const schema = tables();

  const rows = await database
    .select({
      id: schema.users.id,
      plan: schema.users.plan,
      planExpiresAt: schema.users.planExpiresAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  return rows[0] ?? null;
}
