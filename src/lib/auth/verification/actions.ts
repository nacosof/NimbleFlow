"use server";

import { requireUser } from "@/lib/auth/session";
import type { IdentifierChannel } from "@/lib/auth/identifier";
import {
  confirmContactVerificationCode,
  sendContactVerificationCode,
} from "@/lib/auth/verification/service";

export type VerificationActionState = {
  error?: string;
  success?: string;
  sent?: boolean;
  channel?: IdentifierChannel;
  identifier?: string;
};

export async function sendVerificationAction(
  _prev: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const user = await requireUser();
  const channel = String(formData.get("channel") ?? "") as IdentifierChannel;
  const identifier = String(formData.get("identifier") ?? "");

  if (channel !== "email" && channel !== "phone") {
    return { error: "Некорректный канал" };
  }

  try {
    const result = await sendContactVerificationCode({
      userId: user.id,
      channel,
      identifier,
    });
    return {
      sent: true,
      channel: result.channel,
      identifier: result.identifier,
      success: "Код отправлен",
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Не удалось отправить код",
    };
  }
}

export async function confirmVerificationAction(
  _prev: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const user = await requireUser();
  const channel = String(formData.get("channel") ?? "") as IdentifierChannel;
  const identifier = String(formData.get("identifier") ?? "");
  const code = String(formData.get("code") ?? "");

  if (channel !== "email" && channel !== "phone") {
    return { error: "Некорректный канал" };
  }

  if (!code.trim()) {
    return { error: "Введите код", sent: true, channel, identifier };
  }

  try {
    await confirmContactVerificationCode({
      userId: user.id,
      channel,
      identifier,
      code,
    });
    return {
      success:
        channel === "email" ? "Email подтверждён" : "Телефон подтверждён",
      channel,
      identifier,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Не удалось подтвердить",
      sent: true,
      channel,
      identifier,
    };
  }
}
