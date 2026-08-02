import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { signOutAction } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl tracking-tight">Профиль</h1>
          <p className="text-muted">
            {user.name || user.email || "Пользователь"}
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

      <dl className="grid gap-4 border-t border-border pt-6 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted">Email</dt>
          <dd>{user.email || "—"}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted">План</dt>
          <dd className="uppercase">{user.plan}</dd>
        </div>
      </dl>

      <Link href="/" className="text-sm text-accent">
        На главную
      </Link>
    </main>
  );
}
