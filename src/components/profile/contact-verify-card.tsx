"use client";

import { useActionState, useState } from "react";

import { Button, Card, Input, SectionTitle } from "@/components/ui";
import type { IdentifierChannel } from "@/lib/auth/identifier";
import {
  confirmVerificationAction,
  sendVerificationAction,
  type VerificationActionState,
} from "@/lib/auth/verification/actions";

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
  const activeIdentifier =
    sendState.identifier || confirmState.identifier || identifier;
  const error = confirmState.error || sendState.error;
  const success =
    confirmState.success && !confirmState.sent
      ? confirmState.success
      : sendState.success;
  const isConfirmed = Boolean(
    confirmState.success && !confirmState.error && !confirmState.sent,
  );
  const showVerified = verified || isConfirmed;

  return (
    <Card>
      <SectionTitle
        title={label}
        meta={
          showVerified ? (
            <span className="text-sm text-accent">{verifiedLabel}</span>
          ) : (
            <span className="text-sm text-muted">Не подтверждён</span>
          )
        }
      />

      {showVerified && !sent ? (
        <p className="text-sm">{activeIdentifier || defaultValue}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <form action={sendAction} className="flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="channel" value={channel} />
            <Input
              name="identifier"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={placeholder}
              className="flex-1"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={sendPending}
            >
              {sendPending
                ? "Отправка…"
                : sent
                  ? "Отправить снова"
                  : "Отправить код"}
            </Button>
          </form>

          {sent ? (
            <form
              action={confirmAction}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input type="hidden" name="channel" value={channel} />
              <input type="hidden" name="identifier" value={activeIdentifier} />
              <Input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Код из сообщения"
                className="flex-1"
                required
              />
              <Button type="submit" size="sm" disabled={confirmPending}>
                {confirmPending ? "Проверка…" : "Подтвердить"}
              </Button>
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
    </Card>
  );
}
