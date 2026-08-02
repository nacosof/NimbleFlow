import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createCheckout } from "@/lib/payments";

export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const checkout = await createCheckout({ userId, plan: "pro" });
    return NextResponse.json(checkout);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось создать платёж";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
