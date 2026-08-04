import { createHash } from "node:crypto";

import { getEnv } from "@/config/env";
import {
  buildRobokassaReceiptJson,
  isReceiptEnabled,
} from "@/lib/payments/receipt";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
} from "@/lib/payments/types";
import { getPaymentFailUrl, getPaymentSuccessUrl } from "@/lib/payments/urls";

function requireRobokassaConfig() {
  const env = getEnv();
  if (!env.ROBOKASSA_MERCHANT_LOGIN || !env.ROBOKASSA_PASSWORD1) {
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
  receipt?: string;
}) {
  const parts = [
    input.merchantLogin,
    input.outSum,
    input.invId,
    ...(input.receipt !== undefined
      ? [encodeURIComponent(input.receipt)]
      : []),
    input.password1,
  ];
  return createHash("md5").update(parts.join(":")).digest("hex");
}

export function createRobokassaProvider(): PaymentProvider {
  return {
    id: "robokassa",
    async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
      const config = requireRobokassaConfig();
      const outSum = (input.amountKopeks / 100).toFixed(2);
      const invId = String(
        Math.floor(Date.now() / 1000) * 100 +
          (Math.floor(Math.random() * 100) % 100),
      );

      const receiptEnabled = isReceiptEnabled();
      const receiptJson = receiptEnabled
        ? buildRobokassaReceiptJson({
            description: input.description,
            amountRub: input.amountKopeks / 100,
            currency: input.currency,
          })
        : undefined;

      const signature = buildRobokassaSignature({
        merchantLogin: config.merchantLogin,
        outSum,
        invId,
        password1: config.password1,
        receipt: receiptJson,
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

      if (receiptJson) {
        params.set("Receipt", receiptJson);
      }

      const email = input.customer?.email?.trim();
      if (email) {
        params.set("Email", email);
      }

      if (config.isTest) {
        params.set("IsTest", "1");
      }

      params.set(
        "SuccessURL",
        config.successUrl || input.returnUrl || getPaymentSuccessUrl(),
      );
      params.set("FailURL", config.failUrl || getPaymentFailUrl());

      const redirectUrl = `https://auth.robokassa.ru/Merchant/Index.aspx?${params.toString()}`;

      return {
        redirectUrl,
        providerPaymentId: invId,
        raw: {
          invId,
          outSum,
          signature,
          receipt: receiptJson ?? null,
        },
      };
    },
  };
}
