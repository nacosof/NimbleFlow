import Link from "next/link";

import { getEnabledOAuthProviders } from "@/lib/auth";
import { signInWithDevLogin, signInWithProvider } from "@/lib/auth/actions";
import { isDevLoginEnabled } from "@/lib/auth/dev-login";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/profile";
  const providers = getEnabledOAuthProviders();
  const devLogin = isDevLoginEnabled();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-accent">
          NimbleFlow
        </Link>
        <h1 className="font-display text-3xl tracking-tight">Вход</h1>
        <p className="text-muted">Войдите через Яндекс или VK ID.</p>
      </div>

      {params.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Не удалось войти: {params.error}
        </p>
      ) : null}

      {devLogin ? (
        <form action={signInWithDevLogin.bind(null, callbackUrl)}>
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Войти как Dev (локально)
          </button>
        </form>
      ) : null}

      {providers.length > 0 ? (
        <div className="flex flex-col gap-3">
          {providers.map((provider) => (
            <form
              key={provider.id}
              action={signInWithProvider.bind(null, provider.id, callbackUrl)}
            >
              <button
                type="submit"
                className="w-full rounded-lg border border-border px-4 py-3 text-sm font-medium transition hover:bg-white/70"
              >
                Войти через {provider.name}
              </button>
            </form>
          ))}
        </div>
      ) : !devLogin ? (
        <p className="rounded-lg border border-border px-4 py-3 text-sm text-muted">
          OAuth ещё не настроен. Добавьте ключи Яндекс / VK ID в{" "}
          <code className="text-foreground">.env</code> или включите{" "}
          <code className="text-foreground">AUTH_DEV_LOGIN=true</code>.
        </p>
      ) : null}
    </main>
  );
}
