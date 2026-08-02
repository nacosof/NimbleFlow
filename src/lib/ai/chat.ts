import { getEnv } from "@/config/env";
import { getAiProviderConfig } from "@/lib/ai/providers";
import type {
  AiProviderId,
  ChatCompletionResult,
  ChatMessage,
} from "@/lib/ai/types";

function resolveModel(providerId: AiProviderId, override?: string) {
  const env = getEnv();
  const config = getAiProviderConfig(providerId);
  return override || env.AI_MODEL || config.defaultModel;
}

function resolveBaseUrl(providerId: AiProviderId) {
  const env = getEnv();
  const config = getAiProviderConfig(providerId);

  if (providerId === "openai_compatible") {
    if (!env.AI_BASE_URL) {
      throw new Error(
        "AI_BASE_URL обязателен при AI_PROVIDER=openai_compatible",
      );
    }
    return env.AI_BASE_URL.replace(/\/$/, "");
  }

  return (env.AI_BASE_URL || config.baseUrl).replace(/\/$/, "");
}

function requireApiKey() {
  const key = getEnv().AI_API_KEY;
  if (!key) {
    throw new Error("Задайте AI_API_KEY в .env");
  }
  return key;
}

async function chatOpenAiCompatible(input: {
  providerId: AiProviderId;
  messages: ChatMessage[];
  model: string;
}): Promise<ChatCompletionResult> {
  const apiKey = requireApiKey();
  const baseUrl = resolveBaseUrl(input.providerId);
  const env = getEnv();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  if (input.providerId === "openrouter") {
    headers["HTTP-Referer"] = env.NEXT_PUBLIC_APP_URL;
    headers["X-Title"] = "NimbleFlow";
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: input.model,
      messages: input.messages,
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
    model?: string;
  };

  if (!response.ok) {
    throw new Error(
      payload.error?.message ||
        `AI request failed (${response.status})`,
    );
  }

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Пустой ответ модели");
  }

  return {
    content,
    model: payload.model || input.model,
    provider: input.providerId,
  };
}

async function chatAnthropic(input: {
  messages: ChatMessage[];
  model: string;
}): Promise<ChatCompletionResult> {
  const apiKey = requireApiKey();
  const baseUrl = resolveBaseUrl("anthropic");
  const system = input.messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");
  const messages = input.messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    }));

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: input.model,
      max_tokens: 1024,
      system: system || undefined,
      messages,
    }),
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    content?: Array<{ type?: string; text?: string }>;
    model?: string;
  };

  if (!response.ok) {
    throw new Error(
      payload.error?.message ||
        `Anthropic request failed (${response.status})`,
    );
  }

  const content = payload.content
    ?.filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("\n")
    .trim();

  if (!content) {
    throw new Error("Пустой ответ модели");
  }

  return {
    content,
    model: payload.model || input.model,
    provider: "anthropic",
  };
}

export async function chatCompletion(input: {
  messages: ChatMessage[];
  model?: string;
}): Promise<ChatCompletionResult> {
  const providerId = getEnv().AI_PROVIDER;
  const config = getAiProviderConfig(providerId);
  const model = resolveModel(providerId, input.model);

  if (!input.messages.length) {
    throw new Error("Нужно хотя бы одно сообщение");
  }

  if (config.kind === "anthropic") {
    return chatAnthropic({ messages: input.messages, model });
  }

  return chatOpenAiCompatible({
    providerId,
    messages: input.messages,
    model,
  });
}
