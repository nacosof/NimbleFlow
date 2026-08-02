import { MarketingShell } from "./shell";

const features = [
  {
    title: "Вход через Яндекс и VK ID",
    text: "OAuth уже подключён. Для локальной разработки — Dev Login без базы.",
  },
  {
    title: "Кабинет с оплатой и подтверждениями",
    text: "Профиль, план Free/Pro, ЮKassa или Robokassa, OTP для email и телефона.",
  },
  {
    title: "Письма и SMS",
    text: "SMTP или Unisender, SMS.ru или консоль — welcome и коды подтверждения.",
  },
  {
    title: "Чат с AI",
    text: "Выбираешь провайдера, вставляешь API-ключ — в кабинете готовый чат с нейросетью.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="scroll-mt-8 py-20 sm:py-24">
      <MarketingShell>
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Возможности
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          База для SaaS: авторизация, биллинг, уведомления и AI.
        </p>
        <ol className="mt-12 divide-y divide-border border-y border-border">
          {features.map((feature, index) => (
            <li
              key={feature.title}
              className="grid gap-3 py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8"
            >
              <span className="font-display text-sm tracking-widest text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-2xl text-muted">{feature.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </MarketingShell>
    </section>
  );
}
