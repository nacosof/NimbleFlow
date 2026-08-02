import nodemailer from "nodemailer";

import { getEnv } from "@/config/env";

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const env = getEnv();

  if (env.EMAIL_PROVIDER === "unisender") {
    if (!env.UNISENDER_API_KEY || !env.UNISENDER_SENDER_EMAIL) {
      throw new Error(
        "Unisender: задайте UNISENDER_API_KEY и UNISENDER_SENDER_EMAIL",
      );
    }

    const response = await fetch(
      "https://api.unisender.com/ru/api/sendEmail?format=json",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          api_key: env.UNISENDER_API_KEY,
          email: input.to,
          sender_name: "NimbleFlow",
          sender_email: env.UNISENDER_SENDER_EMAIL,
          subject: input.subject,
          body: input.html,
          list_id: "1",
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Unisender request failed with status ${response.status}`);
    }

    return;
  }

  if (!env.SMTP_HOST || !env.EMAIL_FROM) {
    if (env.NODE_ENV === "production") {
      throw new Error(
        "Почта не настроена. Для production укажите SMTP_* или EMAIL_PROVIDER=unisender.",
      );
    }
    console.info(
      `[email:console] to=${input.to} subject=${input.subject} text=${input.text ?? input.html}`,
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
  });

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
