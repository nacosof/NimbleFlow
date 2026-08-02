import { ButtonLink } from "@/components/ui";

import { MarketingShell } from "./shell";

export function FinalCta() {
  return (
    <section className="bg-hero-deep py-20 text-white sm:py-24">
      <MarketingShell className="max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Открой кабинет и продолжай
        </h2>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          Войди, настрой профиль, оплати Pro или подключи AI-чат.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/login" size="lg" variant="inverse">
            Войти
          </ButtonLink>
          <ButtonLink href="/profile" size="lg" variant="onDark">
            Кабинет
          </ButtonLink>
        </div>
      </MarketingShell>
    </section>
  );
}
