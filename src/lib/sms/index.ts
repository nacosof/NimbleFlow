import { getEnv } from "@/config/env";

export async function sendSms(to: string, text: string) {
  const env = getEnv();

  if (env.SMS_PROVIDER === "console") {
    if (env.NODE_ENV === "production") {
      throw new Error(
        "SMS_PROVIDER=console нельзя в production. Укажите SMS_PROVIDER=smsru и SMSRU_API_ID.",
      );
    }
    console.info(`[sms:console] to=${to} text=${text}`);
    return;
  }

  if (!env.SMSRU_API_ID) {
    throw new Error("SMSRU_API_ID is required when SMS_PROVIDER=smsru");
  }

  const body = new URLSearchParams({
    api_id: env.SMSRU_API_ID,
    to: to.replace(/^\+/, ""),
    msg: text,
    json: "1",
  });

  if (env.SMSRU_FROM) {
    body.set("from", env.SMSRU_FROM);
  }

  const response = await fetch("https://sms.ru/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`SMS.ru request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    status?: string;
    status_text?: string;
  };
  if (payload.status !== "OK") {
    throw new Error(payload.status_text || "SMS.ru rejected the message");
  }
}
