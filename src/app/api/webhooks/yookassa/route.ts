import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db, tables } from "@/db/runtime";
import {
  finalizeSucceededPayment,
  markPaymentCanceled,
} from "@/lib/payments/finalize";
import {
  assertYooKassaWebhookIp,
  fetchYooKassaPayment,
} from "@/lib/yookassa/webhook";

type YooKassaNotification = {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    status?: string;
    metadata?: Record<string, string>;
  };
};

export async function POST(request: Request) {
  try {
    assertYooKassaWebhookIp(request);

    const body = (await request.json()) as YooKassaNotification;
    const event = body.event;
    const objectId = body.object?.id;

    if (!event || !objectId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (
      event !== "payment.succeeded" &&
      event !== "payment.canceled" &&
      event !== "payment.waiting_for_capture"
    ) {
      return NextResponse.json({ ok: true });
    }

    const verified = await fetchYooKassaPayment(objectId);
    const database = db();
    const schema = tables();

    const byProvider = await database
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.yookassaPaymentId, verified.id))
      .limit(1);

    let payment = byProvider[0];

    if (!payment && verified.metadata?.paymentId) {
      const byId = await database
        .select()
        .from(schema.payments)
        .where(eq(schema.payments.id, verified.metadata.paymentId))
        .limit(1);
      payment = byId[0];
    }

    if (!payment && verified.metadata?.externalId) {
      const byExternal = await database
        .select()
        .from(schema.payments)
        .where(eq(schema.payments.externalId, verified.metadata.externalId))
        .limit(1);
      payment = byExternal[0];
    }

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (
      verified.amount?.value != null &&
      Number(verified.amount.value) !== Number((payment.amountKopeks / 100).toFixed(2))
    ) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    if (verified.status === "succeeded") {
      await finalizeSucceededPayment({
        paymentId: payment.id,
        raw: { event, object: verified },
      });
    } else if (verified.status === "canceled") {
      await markPaymentCanceled({
        paymentId: payment.id,
        raw: { event, object: verified },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
