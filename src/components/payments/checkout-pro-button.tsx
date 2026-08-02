"use client";

import { useActionState } from "react";

import { Button, type ButtonSize } from "@/components/ui";
import {
  startProCheckoutAction,
  type CheckoutActionState,
} from "@/lib/payments/actions";

const initialState: CheckoutActionState = {};

type CheckoutProButtonProps = {
  hasPro?: boolean;
  size?: ButtonSize;
  label?: string;
  className?: string;
};

export function CheckoutProButton({
  hasPro = false,
  size = "md",
  label = "Купить Pro",
  className,
}: CheckoutProButtonProps) {
  const [state, action, pending] = useActionState(
    startProCheckoutAction,
    initialState,
  );

  if (hasPro) {
    return <p className="text-sm text-accent">Pro уже активен</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <form action={action}>
        <Button type="submit" size={size} disabled={pending} className={className}>
          {pending ? "Создаём платёж…" : label}
        </Button>
      </form>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
    </div>
  );
}
