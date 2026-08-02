import { MarketingShell } from "./shell";

export function Problem() {
  return (
    <section className="border-b border-border bg-surface py-20 sm:py-24">
      <MarketingShell className="max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Всё нужное — уже в продукте
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Вход, кабинет, оплата, подтверждение контактов и AI-чат собраны в одном
          каркасе. Меняешь тексты и ключи под свой бренд — и запускаешь сервис.
        </p>
      </MarketingShell>
    </section>
  );
}
