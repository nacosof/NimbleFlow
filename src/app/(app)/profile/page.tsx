import Link from "next/link";

import { AiChatCard } from "@/components/profile/ai-chat-card";
import { ContactVerifyCard } from "@/components/profile/contact-verify-card";
import { PayProButton } from "@/components/profile/pay-pro-button";
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

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const contact = await getProfileContact(sessionUser.id);
  const subscription = isDevUserId(sessionUser.id)
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

  return (
    <Container className="gap-6 py-16">
      <SectionHeader
        title="Профиль"
        description={contact?.name || contact?.email || "Пользователь"}
        action={
          <form action={signOutAction}>
            <Button type="submit" variant="secondary" size="sm">
              Выйти
            </Button>
          </form>
        }
      />

      <dl className="grid gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted">План</dt>
          <dd className="uppercase">{effectivePlan}</dd>
        </div>
      </dl>

      <PayProButton hasPro={hasPro} />

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

      <Link href="/" className="text-sm text-accent">
        На главную
      </Link>
    </Container>
  );
}
