import { eq } from "drizzle-orm";

import { db, tables } from "@/db/runtime";
import { paymentSucceededEmail, sendEmail } from "@/lib/email";
import { grantPlan } from "@/lib/subscription";
import { resolvePlanId } from "@/lib/subscription/access";

export type FinalizeSucceededPaymentInput = {
  paymentId: string;
  raw?: unknown;
};

export async function finalizeSucceededPayment(
  input: FinalizeSucceededPaymentInput,
) {
  const database = db();
  const schema = tables();

  const rows = await database
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.id, input.paymentId))
    .limit(1);

  const payment = rows[0];
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "succeeded") {
    return { payment, alreadyProcessed: true as const };
  }

  await database
    .update(schema.payments)
    .set({
      status: "succeeded",
      raw: (input.raw ?? payment.raw) as Record<string, unknown> | null,
    })
    .where(eq(schema.payments.id, payment.id));

  const plan = resolvePlanId(payment.plan);
  await grantPlan({ userId: payment.userId, plan });

  const users = await database
    .select({
      email: schema.users.email,
      name: schema.users.name,
    })
    .from(schema.users)
    .where(eq(schema.users.id, payment.userId))
    .limit(1);

  const email = users[0]?.email;
  if (email) {
    const amount = (payment.amountKopeks / 100).toFixed(2);
    try {
      await sendEmail(
        paymentSucceededEmail({
          to: email,
          name: users[0]?.name,
          amount,
          currency: payment.currency,
          plan,
        }),
      );
    } catch (error) {
      console.error("[email] payment-succeeded failed", error);
    }
  }

  return { payment, alreadyProcessed: false as const };
}

export async function markPaymentCanceled(input: {
  paymentId: string;
  raw?: unknown;
}) {
  const database = db();
  const schema = tables();

  const rows = await database
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.id, input.paymentId))
    .limit(1);

  const payment = rows[0];
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "succeeded") {
    return { payment, skipped: true as const };
  }

  await database
    .update(schema.payments)
    .set({
      status: "canceled",
      raw: (input.raw ?? payment.raw) as Record<string, unknown> | null,
    })
    .where(eq(schema.payments.id, payment.id));

  return { payment, skipped: false as const };
}
