"use client";

import { useActionState } from "react";

import { Button, Card, SectionTitle } from "@/components/ui";
import { plans } from "@/config/plans";
import {
  startProCheckoutAction,
  type CheckoutActionState,
} from "@/lib/payments/actions";

const initialState: CheckoutActionState = {};

type PayProButtonProps = {
  hasPro: boolean;
};

export function PayProButton({ hasPro }: PayProButtonProps) {
  const [state, action, pending] = useActionState(
    startProCheckoutAction,
    initialState,
  );

  return (
    <Card>
      <SectionTitle
        title="Подписка Pro"
        description={`${plans.pro.priceRub} ₽ / ${plans.pro.periodDays} дней`}
      />

      {hasPro ? (
        <p className="text-sm text-accent">Pro уже активен</p>
      ) : (
        <form action={action}>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Создаём платёж…" : "Оплатить Pro"}
          </Button>
        </form>
      )}

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
    </Card>
  );
}
