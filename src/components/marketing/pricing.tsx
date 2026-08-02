import { ButtonLink } from "@/components/ui";
import { plans } from "@/config/plans";

import { MarketingShell } from "./shell";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-8 border-y border-border bg-surface py-20 sm:py-24"
    >
      <MarketingShell>
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Тарифы
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Старт бесплатно. Pro открывает платный контур продукта.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-16">
          <div className="flex flex-col gap-4 border-t border-border pt-6">
            <div className="font-display text-sm tracking-[0.18em] text-accent uppercase">
              {plans.free.name}
            </div>
            <div className="font-display text-4xl tracking-tight">0 ₽</div>
            <p className="text-muted">
              Вход, профиль и базовый доступ к приложению.
            </p>
            <div className="pt-2">
              <ButtonLink href="/login" variant="secondary">
                Начать
              </ButtonLink>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t-2 border-accent pt-6">
            <div className="font-display text-sm tracking-[0.18em] text-accent uppercase">
              {plans.pro.name}
            </div>
            <div className="font-display text-4xl tracking-tight">
              {plans.pro.priceRub} ₽
              <span className="ml-2 text-base font-sans tracking-normal text-muted">
                / {plans.pro.periodDays} дней
              </span>
            </div>
            <p className="text-muted">
              Оплата через ЮKassa или Robokassa. Статус Pro обновляется в
              кабинете после webhook.
            </p>
            <div className="pt-2">
              <ButtonLink href="/pricing">Купить Pro</ButtonLink>
            </div>
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}
