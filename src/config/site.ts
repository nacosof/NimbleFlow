export const site = {
  name: "NimbleFlow",
  title: "NimbleFlow",
  description:
    "Шаблон Next.js: регистрация и вход, профиль, оплата и подключение нейросетей.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "ru-RU",
} as const;

export { plans, type PlanId } from "./plans";
