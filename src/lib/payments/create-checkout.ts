import { eq } from "drizzle-orm";

import { plans, type PlanId } from "@/config/plans";
import { db, tables } from "@/db/runtime";
import { getPaymentProvider } from "@/lib/payments/provider";
import type { PaymentProviderId } from "@/lib/payments/types";
import { getPaymentSuccessUrl } from "@/lib/payments/urls";

export async function createCheckout(input: {
  userId: string;
  plan?: PlanId;
}) {
  const planId = input.plan ?? "pro";
  const plan = plans[planId];

  if (planId === "free" || plan.priceRub <= 0) {
    throw new Error("Нельзя оплатить бесплатный план");
  }

  const provider = getPaymentProvider();
  const database = db();
  const schema = tables();

  const paymentId = crypto.randomUUID();
  const externalId = crypto.randomUUID();
  const amountKopeks = plan.priceRub * 100;
  const returnUrl = getPaymentSuccessUrl();

  await database.insert(schema.payments).values({
    id: paymentId,
    userId: input.userId,
    provider: provider.id,
    status: "pending",
    amountKopeks,
    currency: "RUB",
    plan: planId,
    externalId,
  });

  try {
    const created = await provider.createPayment({
      paymentId,
      externalId,
      userId: input.userId,
      plan: planId,
      amountKopeks,
      currency: "RUB",
      description: `NimbleFlow ${plan.name}`,
      returnUrl,
    });

    const patch: {
      raw: unknown;
      yookassaPaymentId?: string;
      robokassaInvId?: string;
    } = {
      raw: created.raw ?? null,
    };

    if (provider.id === "yookassa") {
      patch.yookassaPaymentId = created.providerPaymentId;
    } else {
      patch.robokassaInvId = created.providerPaymentId;
    }

    await database
      .update(schema.payments)
      .set(patch)
      .where(eq(schema.payments.id, paymentId));

    return {
      paymentId,
      provider: provider.id as PaymentProviderId,
      redirectUrl: created.redirectUrl,
    };
  } catch (error) {
    await database
      .update(schema.payments)
      .set({ status: "failed" })
      .where(eq(schema.payments.id, paymentId));
    throw error;
  }
}
