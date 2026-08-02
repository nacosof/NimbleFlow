export const site = {
  name: "NimbleFlow",
  title: "NimbleFlow",
  description:
    "Open-source шаблон Next.js: вход через Яндекс и VK ID, кабинет, оплата, подтверждение контактов и AI-чат.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  githubUrl: "https://github.com/nacosof/NimbleFlow",
  locale: "ru-RU",
} as const;

export { plans, type PlanId } from "./plans";
