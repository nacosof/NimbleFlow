import type { AiProviderConfig, AiProviderId } from "@/lib/ai/types";

const providers: Record<AiProviderId, AiProviderConfig> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    kind: "openai",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    kind: "openai",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "openai/gpt-4o-mini",
  },
  mistral: {
    id: "mistral",
    label: "Mistral",
    kind: "openai",
    baseUrl: "https://api.mistral.ai/v1",
    defaultModel: "mistral-small-latest",
  },
  genapi: {
    id: "genapi",
    label: "GenAPI",
    kind: "openai",
    baseUrl: "https://api.gen-api.ru/api/v1",
    defaultModel: "gpt-4o-mini",
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    kind: "openai",
    baseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    kind: "anthropic",
    baseUrl: "https://api.anthropic.com",
    defaultModel: "claude-3-5-haiku-latest",
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    kind: "openai",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.0-flash",
  },
  grok: {
    id: "grok",
    label: "Grok",
    kind: "openai",
    baseUrl: "https://api.x.ai/v1",
    defaultModel: "grok-2-latest",
  },
  openai_compatible: {
    id: "openai_compatible",
    label: "OpenAI-compatible",
    kind: "openai",
    baseUrl: "",
    defaultModel: "gpt-4o-mini",
  },
};

export function getAiProviderConfig(id: AiProviderId): AiProviderConfig {
  return providers[id];
}
