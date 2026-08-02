import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db, tables } from "@/db/runtime";
import { finalizeSucceededPayment } from "@/lib/payments/finalize";
import { verifyRobokassaResultSignature } from "@/lib/robokassa/webhook";

async function readParams(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as Record<string, unknown>;
    return {
      outSum: String(json.OutSum ?? json.out_sum ?? ""),
      invId: String(json.InvId ?? json.inv_id ?? ""),
      signatureValue: String(
        json.SignatureValue ?? json.signature_value ?? "",
      ),
    };
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    return {
      outSum: String(form.get("OutSum") ?? ""),
      invId: String(form.get("InvId") ?? ""),
      signatureValue: String(form.get("SignatureValue") ?? ""),
    };
  }

  const url = new URL(request.url);
  return {
    outSum: url.searchParams.get("OutSum") ?? "",
    invId: url.searchParams.get("InvId") ?? "",
    signatureValue: url.searchParams.get("SignatureValue") ?? "",
  };
}

async function handleResult(request: Request) {
  const params = await readParams(request);

  if (!params.outSum || !params.invId || !params.signatureValue) {
    return new NextResponse("bad request", { status: 400 });
  }

  const valid = verifyRobokassaResultSignature({
    outSum: params.outSum,
    invId: params.invId,
    signatureValue: params.signatureValue,
  });

  if (!valid) {
    return new NextResponse("bad signature", { status: 400 });
  }

  const database = db();
  const schema = tables();

  const rows = await database
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.robokassaInvId, params.invId))
    .limit(1);

  const payment = rows[0];
  if (!payment) {
    return new NextResponse("payment not found", { status: 404 });
  }

  const expectedSum = (payment.amountKopeks / 100).toFixed(2);
  if (Number(params.outSum) !== Number(expectedSum)) {
    return new NextResponse("bad amount", { status: 400 });
  }

  await finalizeSucceededPayment({
    paymentId: payment.id,
    raw: params,
  });

  return new NextResponse(`OK${params.invId}`);
}

export async function POST(request: Request) {
  return handleResult(request);
}

export async function GET(request: Request) {
  return handleResult(request);
}
