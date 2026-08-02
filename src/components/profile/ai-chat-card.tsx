"use client";

import { useState, type FormEvent } from "react";

import { Button, Card, Input, SectionTitle } from "@/components/ui";
import type { AiStatus } from "@/lib/ai";

type ChatItem = {
  role: "user" | "assistant";
  content: string;
};

type AiChatCardProps = {
  status: AiStatus;
};

export function AiChatCard({ status }: AiChatCardProps) {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || pending || !status.configured || status.needsBaseUrl) {
      return;
    }

    const nextMessages: ChatItem[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "Ты помощник в кабинете NimbleFlow. Отвечай кратко по-русски.",
            },
            ...nextMessages,
          ],
        }),
      });
      const payload = (await response.json()) as {
        content?: string;
        error?: string;
      };

      if (!response.ok || !payload.content) {
        throw new Error(payload.error || "Не удалось получить ответ");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.content as string },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка запроса");
      setMessages((current) => current.slice(0, -1));
      setDraft(content);
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <SectionTitle
        title="Нейросеть"
        description={`${status.label} · ${status.model}`}
        meta={
          <span className="text-sm text-muted">
            {status.configured && !status.needsBaseUrl
              ? "Ключ задан"
              : "Не настроено"}
          </span>
        }
      />

      {!status.configured ? (
        <p className="text-sm text-muted">
          Задайте в{" "}
          <code className="text-foreground">.env</code>:{" "}
          <code className="text-foreground">AI_PROVIDER</code> и{" "}
          <code className="text-foreground">AI_API_KEY</code>, затем
          перезапустите сервер.
        </p>
      ) : null}

      {status.needsBaseUrl ? (
        <p className="text-sm text-muted">
          Для{" "}
          <code className="text-foreground">openai_compatible</code> нужен{" "}
          <code className="text-foreground">AI_BASE_URL</code>.
        </p>
      ) : null}

      {status.configured && !status.needsBaseUrl ? (
        <>
          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto rounded-lg border border-border p-3">
            {messages.length === 0 ? (
              <p className="text-sm text-muted">
                Напишите сообщение — ответ придёт от выбранного провайдера.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "user"
                      ? "self-end rounded-lg bg-accent px-3 py-2 text-sm text-white"
                      : "self-start rounded-lg bg-surface px-3 py-2 text-sm"
                  }
                >
                  {message.content}
                </div>
              ))
            )}
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Сообщение нейросети…"
              disabled={pending}
            />
            <Button type="submit" size="sm" disabled={pending || !draft.trim()}>
              {pending ? "Ждём…" : "Отправить"}
            </Button>
          </form>
        </>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </Card>
  );
}
