import Link from "next/link";

import { getEnabledOAuthProviders } from "@/lib/auth";
import { signInWithProvider } from "@/lib/auth/actions";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/profile";
  const providers = getEnabledOAuthProviders();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-accent">
          NimbleFlow
        </Link>
        <h1 className="font-display text-3xl tracking-tight">Вход</h1>
        <p className="text-muted">
          Войдите удобным способом. Первый вход создаёт аккаунт.
        </p>
      </div>

      {providers.length === 0 ? (
        <div className="rounded-lg border border-border bg-white/60 px-4 py-3 text-sm text-muted">
          OAuth-провайдеры не настроены. Заполните ключи в{" "}
          <code className="text-foreground">.env</code>:{" "}
          <code className="text-foreground">AUTH_YANDEX_*</code>,{" "}
          <code className="text-foreground">AUTH_VK_*</code> или{" "}
          <code className="text-foreground">AUTH_MAILRU_*</code>.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {providers.map((provider) => (
            <form
              key={provider.id}
              action={signInWithProvider.bind(null, provider.id, callbackUrl)}
            >
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Войти через {provider.name}
              </button>
            </form>
          ))}
        </div>
      )}
    </main>
  );
}
