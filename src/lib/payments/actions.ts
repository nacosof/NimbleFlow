"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { isDevUserId } from "@/lib/auth/dev-login";
import { createCheckout } from "@/lib/payments";

export type CheckoutActionState = {
  error?: string;
};

export async function startProCheckoutAction(
  _prev: CheckoutActionState,
  _formData: FormData,
): Promise<CheckoutActionState> {
  const user = await requireUser();

  if (isDevUserId(user.id)) {
    return {
      error:
        "Dev-вход без БД: оплата недоступна. Войдите через OAuth с живой БД и ключами ЮKassa/Robokassa.",
    };
  }

  try {
    const checkout = await createCheckout({
      userId: user.id,
      plan: "pro",
    });
    redirect(checkout.redirectUrl);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      error:
        error instanceof Error ? error.message : "Не удалось создать платёж",
    };
  }
}