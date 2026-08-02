import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import MailRu from "next-auth/providers/mailru";
import Vk from "next-auth/providers/vk";
import Yandex from "next-auth/providers/yandex";
import type { Provider } from "next-auth/providers";

import { getEnv } from "@/config/env";
import { getDb, getSchema } from "@/db";

function buildProviders(): Provider[] {
  const env = getEnv();
  const providers: Provider[] = [];

  if (env.AUTH_YANDEX_ID && env.AUTH_YANDEX_SECRET) {
    providers.push(
      Yandex({
        clientId: env.AUTH_YANDEX_ID,
        clientSecret: env.AUTH_YANDEX_SECRET,
        checks: ["state"],
      }),
    );
  }

  if (env.AUTH_VK_ID && env.AUTH_VK_SECRET) {
    providers.push(
      Vk({
        clientId: env.AUTH_VK_ID,
        clientSecret: env.AUTH_VK_SECRET,
        checks: ["state"],
      }),
    );
  }

  if (env.AUTH_MAILRU_ID && env.AUTH_MAILRU_SECRET) {
    providers.push(
      MailRu({
        clientId: env.AUTH_MAILRU_ID,
        clientSecret: env.AUTH_MAILRU_SECRET,
        checks: ["state"],
      }),
    );
  }

  return providers;
}

function providerIdField(
  provider: string,
): "yandexId" | "vkId" | "mailruId" | null {
  if (provider === "yandex") return "yandexId";
  if (provider === "vk") return "vkId";
  if (provider === "mailru") return "mailruId";
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
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          session.user.plan = user.plan ?? "free";
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

        const db = getDb() as {
          update: (table: unknown) => {
            set: (values: Record<string, string>) => {
              where: (condition: unknown) => Promise<unknown>;
            };
          };
        };
        const schema = getSchema();

        await db
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
    const db = getDb();
    const schema = getSchema();

    config.adapter = (
      DrizzleAdapter as (
        database: unknown,
        tables?: Record<string, unknown>,
      ) => NonNullable<NextAuthConfig["adapter"]>
    )(db, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    });
    config.session = { strategy: "database" };
  }

  return config;
}

export const { handlers, auth, signIn, signOut } = NextAuth(buildAuthConfig());
