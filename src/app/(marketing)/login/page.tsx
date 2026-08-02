import Link from "next/link";

import { Button, Container, SectionHeader } from "@/components/ui";
import { getEnabledOAuthProviders } from "@/lib/auth";
import { signInWithDevLogin, signInWithProvider } from "@/lib/auth/actions";
import { isDevLoginEnabled } from "@/lib/auth/dev-login";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Вход",
  description: "Войдите через Яндекс или VK ID.",
  path: "/login",
});

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
    <Container size="sm" className="justify-center gap-8 py-16">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-accent">
          NimbleFlow
        </Link>
        <SectionHeader
          title="Вход"
          description="Войдите через Яндекс или VK ID."
          className="items-stretch"
        />
      </div>

      {params.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Не удалось войти: {params.error}
        </p>
      ) : null}

      {devLogin ? (
        <form action={signInWithDevLogin.bind(null, callbackUrl)}>
          <Button type="submit" className="w-full">
            Войти как Dev (локально)
          </Button>
        </form>
      ) : null}

      {providers.length > 0 ? (
        <div className="flex flex-col gap-3">
          {providers.map((provider) => (
            <form
              key={provider.id}
              action={signInWithProvider.bind(null, provider.id, callbackUrl)}
            >
              <Button type="submit" variant="secondary" className="w-full">
                Войти через {provider.name}
              </Button>
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
    </Container>
  );
}
