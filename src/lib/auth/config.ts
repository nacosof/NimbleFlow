import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import Yandex from "next-auth/providers/yandex";
import type { Provider } from "next-auth/providers";

import { getEnv } from "@/config/env";
import { getDb, getSchema } from "@/db";
import { getDevUser, isDevLoginEnabled } from "@/lib/auth/dev-login";

function buildProviders(): Provider[] {
  const env = getEnv();
  const providers: Provider[] = [];

  if (isDevLoginEnabled()) {
    providers.push(
      Credentials({
        id: "dev-login",
        name: "Dev",
        credentials: {},
        async authorize() {
          if (!isDevLoginEnabled()) {
            return null;
          }

          return getDevUser();
        },
      }),
    );
  }

  if (env.AUTH_YANDEX_ID && env.AUTH_YANDEX_SECRET) {
    providers.push(
      Yandex({
        clientId: env.AUTH_YANDEX_ID,
        clientSecret: env.AUTH_YANDEX_SECRET,
        checks: ["state"],
        authorization: {
          url: "https://oauth.yandex.ru/authorize",
          params: {
            scope: "login:info login:email login:avatar",
            response_type: "code",
          },
        },
      }),
    );
  }

  return providers;
}

function providerIdField(provider: string): "yandexId" | "vkId" | null {
  if (provider === "yandex") return "yandexId";
  if (provider === "vk") return "vkId";
  return null;
}

function buildAuthConfig(): NextAuthConfig {
  const env = getEnv();

  const config: NextAuthConfig = {
    providers: buildProviders(),
    pages: {
      signIn: "/login",
    },
    trustHost: true,
    session: { strategy: "jwt" },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id;
          token.plan = user.plan ?? "free";
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
          session.user.plan = (token.plan as string | undefined) ?? "free";
        }
        return session;
      },
    },
    events: {
      async signIn({ user, account }) {
        if (!user.id || !account?.provider || !account.providerAccountId) {
          return;
        }

        const field = providerIdField(account.provider);
        if (!field) {
          return;
        }

        const database = getDb() as {
          update: (table: unknown) => {
            set: (values: Record<string, string>) => {
              where: (condition: unknown) => Promise<unknown>;
            };
          };
        };
        const schema = getSchema();

        await database
          .update(schema.users)
          .set({ [field]: account.providerAccountId })
          .where(eq(schema.users.id, user.id));
      },
    },
  };

  if (env.AUTH_SECRET) {
    config.secret = env.AUTH_SECRET;
  }

  if (env.DATABASE_URL) {
    const database = getDb();
    const schema = getSchema();

    config.adapter = (
      DrizzleAdapter as (
        database: unknown,
        tables?: Record<string, unknown>,
      ) => NonNullable<NextAuthConfig["adapter"]>
    )(database, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    });
  }

  return config;
}

export const { handlers, auth, signIn, signOut } = NextAuth(buildAuthConfig());
