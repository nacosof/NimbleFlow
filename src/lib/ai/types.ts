import type { Env } from "@/config/env";

export type AiProviderId = Env["AI_PROVIDER"];

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatCompletionResult = {
  content: string;
  model: string;
  provider: AiProviderId;
};

export type AiProviderConfig = {
  id: AiProviderId;
  label: string;
  kind: "openai" | "anthropic";
  baseUrl: string;
  defaultModel: string;
};
