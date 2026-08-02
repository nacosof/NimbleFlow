import { getEnv } from "@/config/env";
import { createRobokassaProvider } from "@/lib/robokassa/client";
import { createYooKassaProvider } from "@/lib/yookassa/client";
import type { PaymentProvider } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  const provider = getEnv().PAYMENT_PROVIDER;

  if (provider === "robokassa") {
    return createRobokassaProvider();
  }

  return createYooKassaProvider();
}
