import { createHash, randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { encode } from "next-auth/jwt";

import { getEnv } from "@/config/env";
import { db, tables } from "@/db/runtime";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export type VkIdUserInfo = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

function base64Url(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function createPkcePair() {
  const codeVerifier = base64Url(randomBytes(32));
  const codeChallenge = base64Url(
    createHash("sha256").update(codeVerifier).digest(),
  );
  const state = base64Url(randomBytes(16));
  return { codeVerifier, codeChallenge, state };
}

export function getVkRedirectUri() {
  const env = getEnv();
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return `${base}/api/auth/callback/vk`;
}

export function buildVkAuthorizeUrl(input: {
  codeChallenge: string;
  state: string;
}) {
  const env = getEnv();
  if (!env.AUTH_VK_ID) {
    throw new Error("AUTH_VK_ID is required");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.AUTH_VK_ID,
    redirect_uri: getVkRedirectUri(),
    state: input.state,
    code_challenge: input.codeChallenge,
    code_challenge_method: "s256",
    scope: "email",
  });

  return `https://id.vk.com/authorize?${params.toString()}`;
}

export async function exchangeVkCode(input: {
  code: string;
  codeVerifier: string;
  deviceId: string;
  state: string;
}) {
  const env = getEnv();
  if (!env.AUTH_VK_ID || !env.AUTH_VK_SECRET) {
    throw new Error("AUTH_VK_ID and AUTH_VK_SECRET are required");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: input.code,
    code_verifier: input.codeVerifier,
    client_id: env.AUTH_VK_ID,
    client_secret: env.AUTH_VK_SECRET,
    redirect_uri: getVkRedirectUri(),
    device_id: input.deviceId,
    state: input.state,
  });

  const response = await fetch("https://id.vk.com/oauth2/auth", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user_id?: number | string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !payload.access_token) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        `VK token exchange failed (${response.status})`,
    );
  }

  return payload as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    user_id?: number | string;
  };
}

export async function fetchVkUserInfo(accessToken: string) {
  const env = getEnv();
  if (!env.AUTH_VK_ID) {
    throw new Error("AUTH_VK_ID is required");
  }

  const response = await fetch("https://id.vk.com/oauth2/user_info", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: accessToken,
      client_id: env.AUTH_VK_ID,
    }),
  });

  const payload = (await response.json()) as {
    user?: VkIdUserInfo;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !payload.user?.user_id) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "VK user_info request failed",
    );
  }

  return payload.user;
}

export async function upsertVkUser(
  profile: VkIdUserInfo,
  tokens: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  },
) {
  const database = db();
  const schema = tables();
  const providerAccountId = String(profile.user_id);
  const name =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() ||
    `VK ${providerAccountId}`;
  const email = profile.email?.trim().toLowerCase() || null;

  const existingAccounts = await database
    .select()
    .from(schema.accounts)
    .where(
      and(
        eq(schema.accounts.provider, "vk"),
        eq(schema.accounts.providerAccountId, providerAccountId),
      ),
    )
    .limit(1);

  const expiresAt = tokens.expires_in
    ? Math.floor(Date.now() / 1000) + tokens.expires_in
    : null;

  if (existingAccounts[0]) {
    const userId = existingAccounts[0].userId;

    await database
      .update(schema.accounts)
      .set({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        expires_at: expiresAt,
        token_type: "bearer",
        type: "oauth",
      })
      .where(
        and(
          eq(schema.accounts.provider, "vk"),
          eq(schema.accounts.providerAccountId, providerAccountId),
        ),
      );

    await database
      .update(schema.users)
      .set({
        name,
        image: profile.avatar ?? null,
        vkId: providerAccountId,
        ...(email ? { email } : {}),
      })
      .where(eq(schema.users.id, userId));

    const users = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    return users[0]!;
  }

  if (email) {
    const byEmail = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (byEmail[0]) {
      const userId = byEmail[0].id;
      await database.insert(schema.accounts).values({
        userId,
        type: "oauth",
        provider: "vk",
        providerAccountId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        expires_at: expiresAt,
        token_type: "bearer",
      });
      await database
        .update(schema.users)
        .set({
          name,
          image: profile.avatar ?? null,
          vkId: providerAccountId,
        })
        .where(eq(schema.users.id, userId));

      const users = await database
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1);

      return users[0]!;
    }
  }

  const userId = crypto.randomUUID();
  await database.insert(schema.users).values({
    id: userId,
    name,
    email,
    image: profile.avatar ?? null,
    vkId: providerAccountId,
    plan: "free",
  });

  await database.insert(schema.accounts).values({
    userId,
    type: "oauth",
    provider: "vk",
    providerAccountId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    expires_at: expiresAt,
    token_type: "bearer",
  });

  const users = await database
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  return users[0]!;
}

export async function createSessionCookie(user: {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  plan?: string | null;
}) {
  const env = getEnv();
  if (!env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required");
  }

  const useSecure = env.NODE_ENV === "production";
  const cookieName = useSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const value = await encode({
    token: {
      sub: user.id,
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      picture: user.image ?? undefined,
      plan: user.plan ?? "free",
    },
    secret: env.AUTH_SECRET,
    maxAge: SESSION_MAX_AGE,
    salt: cookieName,
  });

  return {
    name: cookieName,
    value,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: useSecure,
      maxAge: SESSION_MAX_AGE,
    },
  };
}
