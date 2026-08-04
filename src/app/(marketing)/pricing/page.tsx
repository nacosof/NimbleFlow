import Link from "next/link";

import { CheckoutProButton } from "@/components/payments/checkout-pro-button";
import { ButtonLink, Container, SectionHeader } from "@/components/ui";
import { plans } from "@/config/plans";
import { getCurrentUser } from "@/lib/auth";
import { isDevUserId } from "@/lib/auth/dev-login";
import { createPageMetadata } from "@/lib/seo";
import {
  getEffectivePlan,
  getUserSubscription,
  hasProAccess,
} from "@/lib/subscription";

export const metadata = createPageMetadata({
  title: "Тарифы",
  description: "Free и Pro: демо оплаты через ЮKassa или Robokassa.",
  path: "/pricing",
});


export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const user = await getCurrentUser();
  let hasPro = false;
  let effectivePlan: "free" | "pro" = "free";

  if (user?.id) {
    const subscription = isDevUserId(user.id)
      ? {
          plan: user.plan ?? "free",
          planExpiresAt: null as Date | null,
        }
      : ((await getUserSubscription(user.id)) ?? {
          plan: user.plan ?? "free",
          planExpiresAt: null,
        });
    effectivePlan = getEffectivePlan(subscription);
    hasPro = hasProAccess(subscription);
  }

  return (
    <Container className="gap-10 py-16">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-accent">
          NimbleFlow
        </Link>
        <SectionHeader
          title="Тарифы"
          description="Демо платного контура для SaaS, который вы соберёте на шаблоне."
        />
      </div>

      {user ? (
        <p className="text-sm text-muted">
          Сейчас у вас план{" "}
          <span className="font-medium uppercase text-foreground">
            {effectivePlan}
          </span>
          .
        </p>
      ) : null}

      <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <div className="font-display text-sm tracking-[0.18em] text-accent uppercase">
            {plans.free.name}
          </div>
          <div className="font-display text-4xl tracking-tight">0 ₽</div>
          <p className="text-muted">
            Вход, профиль и базовый каркас приложения без оплаты.
          </p>
          <div className="pt-2">
            <ButtonLink
              href={user ? "/profile" : "/login?callbackUrl=/profile"}
              variant="secondary"
            >
              {user ? "В кабинет" : "Начать"}
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
            Оплата через ЮKassa или Robokassa. После webhook план в кабинете
            станет Pro.
          </p>
          <div className="pt-2">
            {user ? (
              <CheckoutProButton hasPro={hasPro} label="Купить Pro" />
            ) : (
              <ButtonLink href="/login?callbackUrl=/pricing">
                Войти и купить Pro
              </ButtonLink>
            )}
          </div>
        </div>
      </div>

      <p className="max-w-2xl text-sm text-muted">
        Нужны ключи платёжки в{" "}
        <code className="text-foreground">.env</code> и живая БД. Dev-вход без
        БД оплату не создаёт.
      </p>
    </Container>
  );
}
