import Link from "next/link";

import { ButtonLink } from "@/components/ui";

import { MarketingShell } from "./shell";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <MarketingShell className="flex items-center justify-between py-5">
        <a
          href="#top"
          className="font-display text-sm tracking-[0.18em] text-white uppercase"
        >
          NimbleFlow
        </a>
        <nav className="flex items-center gap-4 text-sm text-white/80">
          <a href="#features" className="hidden transition hover:text-white sm:inline">
            Возможности
          </a>
          <Link href="/pricing" className="hidden transition hover:text-white sm:inline">
            Тарифы
          </Link>
          <ButtonLink href="/login" size="sm" variant="inverse">
            Войти
          </ButtonLink>
        </nav>
      </MarketingShell>
    </header>
  );
}
