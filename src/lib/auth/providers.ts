import { getEnv } from "@/config/env";

export type OAuthProviderOption = {
  id: "yandex" | "vk";
  name: string;
};

export function getEnabledOAuthProviders(): OAuthProviderOption[] {
  const env = getEnv();
  const providers: OAuthProviderOption[] = [];

  if (env.AUTH_YANDEX_ID && env.AUTH_YANDEX_SECRET) {
    providers.push({ id: "yandex", name: "Яндекс" });
  }

  if (env.AUTH_VK_ID && env.AUTH_VK_SECRET) {
    providers.push({ id: "vk", name: "VK ID" });
  }

  return providers;
}
