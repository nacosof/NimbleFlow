import type { Metadata } from "next";
import Link from "next/link";

import { AccountSummary, PlanStatus } from "@/components/app";
import { AiChatCard } from "@/components/profile/ai-chat-card";
import { ContactVerifyCard } from "@/components/profile/contact-verify-card";
import { Button, Container, SectionHeader } from "@/components/ui";
import { getAiStatus } from "@/lib/ai";
import { requireUser } from "@/lib/auth";
import { signOutAction } from "@/lib/auth/actions";
import { isDevUserId } from "@/lib/auth/dev-login";
import { getProfileContact } from "@/lib/auth/verification/service";
import {
  getEffectivePlan,
  getUserSubscription,
  hasProAccess,
} from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Кабинет",
  description: "Профиль, подписка, подтверждение контактов и AI-чат.",
};

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  searchParams: Promise<{
    paid?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const sessionUser = await requireUser();
  const isDevSession = isDevUserId(sessionUser.id);
  const contact = await getProfileContact(sessionUser.id);
  const subscription = isDevSession
    ? {
        plan: sessionUser.plan ?? "free",
        planExpiresAt: null as Date | null,
      }
    : ((await getUserSubscription(sessionUser.id)) ?? {
        plan: contact?.plan ?? sessionUser.plan ?? "free",
        planExpiresAt: null,
      });
  const effectivePlan = getEffectivePlan(subscription);
  const hasPro = hasProAccess(subscription);
  const aiStatus = getAiStatus();
  const showPaidHint = params.paid === "1" && !hasPro;

  return (
    <Container className="gap-6 py-16">
      <SectionHeader
        title="Кабинет"
        description={contact?.name || contact?.email || "Профиль"}
        action={
          <form action={signOutAction}>
            <Button type="submit" variant="secondary" size="sm">
              Выйти
            </Button>
          </form>
        }
      />

      {hasPro ? (
        <p className="rounded-lg border border-accent/20 bg-surface px-4 py-3 text-sm text-accent">
          Подписка Pro активна
          {subscription.planExpiresAt
            ? ` до ${subscription.planExpiresAt.toLocaleDateString("ru-RU")}`
            : ""}
          .
        </p>
      ) : null}

      {showPaidHint ? (
        <p className="rounded-lg border border-border px-4 py-3 text-sm text-muted">
          Платёж принят на стороне провайдера. Статус Pro появится после
          webhook — обновите страницу через несколько секунд.
        </p>
      ) : null}

      <AccountSummary
        name={contact?.name ?? sessionUser.name ?? null}
        email={contact?.email ?? sessionUser.email ?? null}
        phone={contact?.phone ?? null}
        emailVerified={Boolean(contact?.emailVerified)}
        phoneVerified={Boolean(contact?.phoneVerifiedAt)}
      />

      <PlanStatus
        plan={effectivePlan}
        hasPro={hasPro}
        expiresAt={subscription.planExpiresAt ?? null}
        isDevSession={isDevSession}
      />

      <AiChatCard status={aiStatus} />

      <ContactVerifyCard
        channel="email"
        label="Email"
        placeholder="you@example.ru"
        defaultValue={contact?.email ?? ""}
        verified={Boolean(contact?.emailVerified)}
        verifiedLabel="Подтверждён"
      />

      <ContactVerifyCard
        channel="phone"
        label="Телефон"
        placeholder="+79001234567"
        defaultValue={contact?.phone ?? ""}
        verified={Boolean(contact?.phoneVerifiedAt)}
        verifiedLabel="Подтверждён"
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/" className="text-accent">
          На главную
        </Link>
        <Link href="/pricing" className="text-accent">
          Тарифы
        </Link>
      </div>
    </Container>
  );
}
