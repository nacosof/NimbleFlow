import Link from "next/link";

import { site } from "@/config/site";

import { MarketingShell } from "./shell";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <MarketingShell className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.18em] text-accent uppercase">
            {site.name}
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted">{site.description}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <a href="#features" className="transition hover:text-foreground">
            Возможности
          </a>
          <a href="#pricing" className="transition hover:text-foreground">
            Тарифы
          </a>
          <Link href="/login" className="transition hover:text-foreground">
            Войти
          </Link>
          <Link href="/profile" className="transition hover:text-foreground">
            Кабинет
          </Link>
          <Link href="/legal/terms" className="transition hover:text-foreground">
            Соглашение
          </Link>
          <Link href="/legal/offer" className="transition hover:text-foreground">
            Оферта
          </Link>
          <Link
            href="/legal/privacy"
            className="transition hover:text-foreground"
          >
            Конфиденциальность
          </Link>
        </nav>
      </MarketingShell>
    </footer>
  );
}
