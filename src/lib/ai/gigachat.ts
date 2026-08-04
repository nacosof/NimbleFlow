import { randomUUID } from "node:crypto";

import { getEnv } from "@/config/env";

const DEFAULT_AUTH_URL =
  "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const DEFAULT_API_BASE = "https://api.giga.chat/v1";

type TokenCache = {
  token: string;
  expiresAtMs: number;
};

let tokenCache: TokenCache | null = null;

function authorizationHeaderValue(rawKey: string) {
  const key = rawKey.trim();
  return key.toLowerCase().startsWith("basic ") ? key : `Basic ${key}`;
}

function normalizeExpiresAt(expiresAt: number) {
  return expiresAt > 1_000_000_000_000 ? expiresAt : expiresAt * 1000;
}

export function getGigaChatApiBaseUrl() {
  const env = getEnv();
  return (env.AI_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, "");
}

export async function getGigaChatAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAtMs - 60_000 > now) {
    return tokenCache.token;
  }

  const env = getEnv();
  const apiKey = env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("Задайте AI_API_KEY (ключ авторизации GigaChat) в .env");
  }

  const scope = env.GIGACHAT_SCOPE;
  const authUrl = env.GIGACHAT_AUTH_URL || DEFAULT_AUTH_URL;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      RqUID: randomUUID(),
      Authorization: authorizationHeaderValue(apiKey),
    },
    body: new URLSearchParams({ scope }),
  });

  const payload = (await response.json()) as {
    access_token?: string;
    expires_at?: number;
    message?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !payload.access_token || !payload.expires_at) {
    throw new Error(
      payload.message ||
        payload.error_description ||
        payload.error ||
        `GigaChat OAuth failed (${response.status})`,
    );
  }

  tokenCache = {
    token: payload.access_token,
    expiresAtMs: normalizeExpiresAt(payload.expires_at),
  };

  return tokenCache.token;
}
