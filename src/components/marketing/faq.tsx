import { MarketingShell } from "./shell";

const items = [
  {
    q: "Как войти?",
    a: "Через Яндекс или VK ID на странице входа. В разработке можно включить Dev Login.",
  },
  {
    q: "Что есть в кабинете?",
    a: "План и оплата Pro, подтверждение email и телефона по OTP, чат с AI после настройки провайдера и API-ключа.",
  },
  {
    q: "Как оплатить Pro?",
    a: "На странице тарифов или в кабинете. Платёж идёт через ЮKassa или Robokassa — зависит от PAYMENT_PROVIDER.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-8 py-20 sm:py-24">
      <MarketingShell className="max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Вопросы
        </h2>
        <dl className="mt-10 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={item.q} className="py-7">
              <dt className="font-display text-lg tracking-tight">{item.q}</dt>
              <dd className="mt-3 leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </MarketingShell>
    </section>
  );
}
