import { getEnv } from "@/config/env";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
} from "@/lib/payments/types";

type YooKassaPaymentResponse = {
  id: string;
  status?: string;
  confirmation?: {
    type?: string;
    confirmation_url?: string;
  };
  amount?: { value: string; currency: string };
  description?: string;
  metadata?: Record<string, string>;
};

function requireYooKassaConfig() {
  const env = getEnv();
  if (!env.YOOKASSA_SHOP_ID || !env.YOOKASSA_SECRET_KEY) {
    throw new Error("ЮKassa: задайте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY");
  }

  return {
    shopId: env.YOOKASSA_SHOP_ID,
    secretKey: env.YOOKASSA_SECRET_KEY,
    returnUrl:
      env.YOOKASSA_RETURN_URL ||
      `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/profile?paid=1`,
  };
}

export function createYooKassaProvider(): PaymentProvider {
  return {
    id: "yookassa",
    async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
      const config = requireYooKassaConfig();
      const amountValue = (input.amountKopeks / 100).toFixed(2);
      const auth = Buffer.from(
        `${config.shopId}:${config.secretKey}`,
      ).toString("base64");

      const response = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          "Idempotence-Key": input.externalId,
        },
        body: JSON.stringify({
          amount: {
            value: amountValue,
            currency: input.currency,
          },
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: input.returnUrl || config.returnUrl,
          },
          description: input.description.slice(0, 128),
          metadata: {
            paymentId: input.paymentId,
            userId: input.userId,
            plan: input.plan,
            externalId: input.externalId,
          },
        }),
      });

      const payload = (await response.json()) as YooKassaPaymentResponse & {
        type?: string;
        description?: string;
        code?: string;
      };

      if (!response.ok || !payload.id) {
        throw new Error(
          payload.description ||
            payload.code ||
            `ЮKassa create payment failed (${response.status})`,
        );
      }

      const redirectUrl = payload.confirmation?.confirmation_url;
      if (!redirectUrl) {
        throw new Error("ЮKassa не вернула confirmation_url");
      }

      return {
        redirectUrl,
        providerPaymentId: payload.id,
        raw: payload,
      };
    },
  };
}
