"use client";

import { useActionState } from "react";

import {
  startProCheckoutAction,
  type CheckoutActionState,
} from "@/lib/payments/actions";
import { plans } from "@/config/plans";

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
    <section className="flex flex-col gap-3 border-t border-border pt-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">Подписка Pro</h2>
        <p className="text-sm text-muted">
          {plans.pro.priceRub} ₽ / {plans.pro.periodDays} дней
        </p>
      </div>

      {hasPro ? (
        <p className="text-sm text-accent">Pro уже активен</p>
      ) : (
        <form action={action}>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Создаём платёж…" : "Оплатить Pro"}
          </button>
        </form>
      )}

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
    </section>
  );
}
