"use client";

import { useActionState, useState } from "react";

import {
  confirmVerificationAction,
  sendVerificationAction,
  type VerificationActionState,
} from "@/lib/auth/verification/actions";
import type { IdentifierChannel } from "@/lib/auth/identifier";

type ContactVerifyCardProps = {
  channel: IdentifierChannel;
  label: string;
  placeholder: string;
  defaultValue: string;
  verified: boolean;
  verifiedLabel: string;
};

const initialState: VerificationActionState = {};

export function ContactVerifyCard({
  channel,
  label,
  placeholder,
  defaultValue,
  verified,
  verifiedLabel,
}: ContactVerifyCardProps) {
  const [identifier, setIdentifier] = useState(defaultValue);
  const [sendState, sendAction, sendPending] = useActionState(
    sendVerificationAction,
    initialState,
  );
  const [confirmState, confirmAction, confirmPending] = useActionState(
    confirmVerificationAction,
    initialState,
  );

  const sent = Boolean(sendState.sent || confirmState.sent);
  const activeIdentifier = sendState.identifier || confirmState.identifier || identifier;
  const error = confirmState.error || sendState.error;
  const success = confirmState.success && !confirmState.sent ? confirmState.success : sendState.success;
  const isConfirmed = Boolean(
    confirmState.success && !confirmState.error && !confirmState.sent,
  );
  const showVerified = verified || isConfirmed;

  return (
    <section className="flex flex-col gap-3 border-t border-border pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium">{label}</h2>
        {showVerified ? (
          <span className="text-sm text-accent">{verifiedLabel}</span>
        ) : (
          <span className="text-sm text-muted">Не подтверждён</span>
        )}
      </div>

      {showVerified && !sent ? (
        <p className="text-sm">{activeIdentifier || defaultValue}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <form action={sendAction} className="flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="channel" value={channel} />
            <input
              name="identifier"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={placeholder}
              className="w-full flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
              required
            />
            <button
              type="submit"
              disabled={sendPending}
              className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-white/70 disabled:opacity-60"
            >
              {sendPending ? "Отправка…" : sent ? "Отправить снова" : "Отправить код"}
            </button>
          </form>

          {sent ? (
            <form action={confirmAction} className="flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="channel" value={channel} />
              <input type="hidden" name="identifier" value={activeIdentifier} />
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Код из сообщения"
                className="w-full flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
                required
              />
              <button
                type="submit"
                disabled={confirmPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {confirmPending ? "Проверка…" : "Подтвердить"}
              </button>
            </form>
          ) : null}
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success && !isConfirmed ? (
        <p className="text-sm text-muted">{success}</p>
      ) : null}
      {isConfirmed ? (
        <p className="text-sm text-accent">{confirmState.success}</p>
      ) : null}
    </section>
  );
}
