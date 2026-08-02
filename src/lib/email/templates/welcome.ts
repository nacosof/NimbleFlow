import { site } from "@/config/site";
import type { SendEmailInput } from "@/lib/email/send";

export function welcomeEmail(input: {
  to: string;
  name?: string | null;
}): SendEmailInput {
  const name = input.name?.trim() || "друг";

  return {
    to: input.to,
    subject: `Добро пожаловать в ${site.name}`,
    text: `Привет, ${name}! Аккаунт в ${site.name} создан. Зайдите в кабинет: ${site.url}/profile`,
    html: `
      <p>Привет, <strong>${escapeHtml(name)}</strong>!</p>
      <p>Аккаунт в <strong>${escapeHtml(site.name)}</strong> создан.</p>
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
