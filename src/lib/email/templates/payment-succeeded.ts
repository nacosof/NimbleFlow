import { site } from "@/config/site";
import type { SendEmailInput } from "@/lib/email/send";

export function paymentSucceededEmail(input: {
  to: string;
  name?: string | null;
  amount: string;
  currency: string;
  plan: string;
}): SendEmailInput {
  const name = input.name?.trim() || "друг";
  const plan = input.plan.toUpperCase();

  return {
    to: input.to,
    subject: `Оплата ${site.name} ${plan} прошла успешно`,
    text: `Привет, ${name}! Оплата ${input.amount} ${input.currency} прошла успешно. План ${plan} активирован. Кабинет: ${site.url}/profile`,
    html: `
      <p>Привет, <strong>${escapeHtml(name)}</strong>!</p>
      <p>Оплата <strong>${escapeHtml(input.amount)} ${escapeHtml(input.currency)}</strong> прошла успешно.</p>
      <p>План <strong>${escapeHtml(plan)}</strong> активирован.</p>
      <p><a href="${site.url}/profile">Открыть кабинет</a></p>
    `.trim(),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
