import { getEnv } from "@/config/env";
import { getAiProviderConfig } from "@/lib/ai/providers";

export function getAiStatus() {
  const env = getEnv();
  const config = getAiProviderConfig(env.AI_PROVIDER);
  const model = env.AI_MODEL || config.defaultModel;

  return {
    provider: config.id,
    label: config.label,
    model,
    configured: Boolean(env.AI_API_KEY),
    needsBaseUrl:
      config.id === "openai_compatible" && !env.AI_BASE_URL,
  };
}

export type AiStatus = ReturnType<typeof getAiStatus>;
