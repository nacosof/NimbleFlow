export const site = {
  name: "NimbleFlow",
  title: "NimbleFlow",
  description:
    "Шаблон Next.js: регистрация и вход, профиль, оплата и подключение нейросетей.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "ru-RU",
} as const;

export const plans = {
  free: {
    id: "free",
    name: "Free",
    priceRub: 0,
    periodDays: null,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceRub: 990,
    periodDays: 30,
  },
} as const;

export type PlanId = keyof typeof plans;
