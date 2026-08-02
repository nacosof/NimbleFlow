import type { PlanId } from "@/config/plans";

export type PaymentProviderId = "yookassa" | "robokassa";

export type PaymentStatus = "pending" | "succeeded" | "canceled" | "failed";

export type CreatePaymentInput = {
  paymentId: string;
  externalId: string;
  userId: string;
  plan: PlanId;
  amountKopeks: number;
  currency: string;
  description: string;
  returnUrl: string;
};

export type CreatePaymentResult = {
  redirectUrl: string;
  providerPaymentId: string;
  raw?: unknown;
};

export type PaymentProvider = {
  id: PaymentProviderId;
  createPayment: (input: CreatePaymentInput) => Promise<CreatePaymentResult>;
};
