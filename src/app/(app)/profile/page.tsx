import Link from "next/link";

import { ContactVerifyCard } from "@/components/profile/contact-verify-card";
import { requireUser } from "@/lib/auth";
import { signOutAction } from "@/lib/auth/actions";
import { getProfileContact } from "@/lib/auth/verification/service";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const contact = await getProfileContact(sessionUser.id);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl tracking-tight">Профиль</h1>
          <p className="text-muted">
            {contact?.name || contact?.email || "Пользователь"}
          </p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-white/70"
          >
            Выйти
          </button>
        </form>
      </div>

      <dl className="grid gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted">План</dt>
          <dd className="uppercase">{contact?.plan ?? sessionUser.plan}</dd>
        </div>
      </dl>

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

      <p className="border-t border-border pt-6 text-sm text-muted">
        Оплата тарифа появится здесь на следующем шаге.
      </p>

      <Link href="/" className="text-sm text-accent">
        На главную
      </Link>
    </main>
  );
}
