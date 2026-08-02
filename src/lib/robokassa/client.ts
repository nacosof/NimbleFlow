import { createHash } from "node:crypto";

import { getEnv } from "@/config/env";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
} from "@/lib/payments/types";

function requireRobokassaConfig() {
  const env = getEnv();
  if (
    !env.ROBOKASSA_MERCHANT_LOGIN ||
    !env.ROBOKASSA_PASSWORD1
  ) {
    throw new Error(
      "Robokassa: задайте ROBOKASSA_MERCHANT_LOGIN и ROBOKASSA_PASSWORD1",
    );
  }

  return {
    merchantLogin: env.ROBOKASSA_MERCHANT_LOGIN,
    password1: env.ROBOKASSA_PASSWORD1,
    isTest: env.ROBOKASSA_IS_TEST,
    successUrl: env.ROBOKASSA_SUCCESS_URL,
    failUrl: env.ROBOKASSA_FAIL_URL,
  };
}

export function buildRobokassaSignature(input: {
  merchantLogin: string;
  outSum: string;
  invId: string;
  password1: string;
}) {
  const source = `${input.merchantLogin}:${input.outSum}:${input.invId}:${input.password1}`;
  return createHash("md5").update(source).digest("hex");
}

export function createRobokassaProvider(): PaymentProvider {
  return {
    id: "robokassa",
    async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
      const config = requireRobokassaConfig();
      const outSum = (input.amountKopeks / 100).toFixed(2);
      const invId = String(
        Math.floor(Date.now() / 1000) * 100 + (Math.floor(Math.random() * 100) % 100),
      );

      const signature = buildRobokassaSignature({
        merchantLogin: config.merchantLogin,
        outSum,
        invId,
        password1: config.password1,
      });

      const params = new URLSearchParams({
        MerchantLogin: config.merchantLogin,
        OutSum: outSum,
        InvId: invId,
        Description: input.description.slice(0, 100),
        SignatureValue: signature,
        Culture: "ru",
        Encoding: "utf-8",
      });

      if (config.isTest) {
        params.set("IsTest", "1");
      }

      if (config.successUrl) {
        params.set("SuccessURL", config.successUrl);
      }
      if (config.failUrl) {
        params.set("FailURL", config.failUrl);
      }

      const redirectUrl = `https://auth.robokassa.ru/Merchant/Index.aspx?${params.toString()}`;

      return {
        redirectUrl,
        providerPaymentId: invId,
        raw: {
          invId,
          outSum,
          signature,
        },
      };
    },
  };
}
