import { ButtonLink } from "@/components/ui";

import { MarketingShell } from "./shell";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] bg-hero-deep text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="nf-drift absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,#1f6b4f_0%,transparent_52%),radial-gradient(ellipse_at_88%_70%,#0d3f30_0%,transparent_48%),linear-gradient(165deg,#0a2e22_0%,#134a36_45%,#0a2e22_100%)]" />
        <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="relative flex min-h-[100svh] flex-col">
        <MarketingShell className="flex flex-1 flex-col justify-center pt-28 pb-10 sm:pt-32 sm:pb-12">
          <div className="max-w-2xl">
            <p className="nf-rise font-display text-base tracking-[0.22em] text-white/90 uppercase sm:text-lg">
              NimbleFlow
            </p>
            <h1 className="nf-rise nf-rise-delay-1 mt-5 font-display text-[2rem] leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Все необходимое для создания вашего SaaS-сервиса или любого другого
              веб-приложения
            </h1>
            <p className="nf-rise nf-rise-delay-2 mt-5 max-w-md text-base text-white/75 sm:text-lg">
              Шаблон на Next.js: вход, кабинет, оплата и AI.
            </p>
            <div className="nf-rise nf-rise-delay-3 mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/login" size="lg" variant="inverse">
                Войти
              </ButtonLink>
              <ButtonLink href="/profile" size="lg" variant="onDark">
                Кабинет
              </ButtonLink>
            </div>
          </div>
        </MarketingShell>

        <div className="nf-fade relative w-full shrink-0 border-t border-white/10 bg-[#0d241c]">
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-3">
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="size-2.5 rounded-full bg-white/25" />
            <span className="ml-3 text-xs tracking-wide text-white/45">
              /profile · кабинет
            </span>
          </div>
          <MarketingShell className="grid gap-6 py-6 sm:grid-cols-[0.85fr_1.15fr] sm:py-8">
            <div className="space-y-3">
              <div className="h-3 w-20 rounded bg-white/20" />
              <div className="h-8 w-40 rounded bg-white/30" />
              <div className="h-3 w-28 rounded bg-white/15" />
              <div className="mt-6 space-y-2">
                <div className="h-10 rounded-lg bg-white/10" />
                <div className="h-10 rounded-lg bg-white/10" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-hero-mid p-5 sm:p-6">
                <div className="text-xs tracking-wide text-white/55 uppercase">
                  Подписка
                </div>
                <div className="mt-2 font-display text-2xl">Pro</div>
                <div className="mt-1 text-sm text-white/65">
                  Оплата · email · телефон
                </div>
              </div>
              <div className="border border-white/10 p-5 sm:p-6">
                <div className="text-xs tracking-wide text-white/55 uppercase">
                  AI-чат
                </div>
                <div className="mt-2 text-sm text-white/80">
                  Провайдер + API-ключ → готовый чат
                </div>
              </div>
            </div>
          </MarketingShell>
        </div>
      </div>
    </section>
  );
}
