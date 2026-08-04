import { getEnv } from "@/config/env";

export const receiptSnoValues = [
  "osn",
  "usn_income",
  "usn_income_outcome",
  "esn",
  "patent",
] as const;

export type ReceiptSno = (typeof receiptSnoValues)[number];

export const receiptVatValues = [
  "none",
  "vat0",
  "vat10",
  "vat20",
  "vat22",
  "vat110",
  "vat120",
  "vat122",
  "vat5",
  "vat7",
  "vat105",
  "vat107",
] as const;

export type ReceiptVat = (typeof receiptVatValues)[number];

const yooKassaTaxSystemCode: Record<ReceiptSno, number> = {
  osn: 1,
  usn_income: 2,
  usn_income_outcome: 3,
  esn: 5,
  patent: 6,
};

const yooKassaVatCode: Record<ReceiptVat, number> = {
  none: 1,
  vat0: 2,
  vat10: 3,
  vat20: 4,
  vat110: 5,
  vat120: 6,
  vat5: 7,
  vat7: 8,
  vat105: 9,
  vat107: 10,
  vat22: 11,
  vat122: 12,
};

export type ReceiptCustomer = {
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
};

export type ReceiptLineInput = {
  description: string;
  amountRub: number;
  currency: string;
};

export function isReceiptEnabled() {
  return getEnv().RECEIPT_ENABLED;
}

export function normalizeReceiptPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    return undefined;
  }
  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }
  return digits;
}

export function hasReceiptCustomerContact(customer: ReceiptCustomer) {
  return Boolean(customer.email?.trim() || customer.phone?.trim());
}

export function assertReceiptCustomer(customer: ReceiptCustomer) {
  if (!hasReceiptCustomerContact(customer)) {
    throw new Error(
      "Для чека 54-ФЗ укажите email или телефон в профиле (подтверждение контакта)",
    );
  }
}

export function buildYooKassaReceipt(
  customer: ReceiptCustomer,
  line: ReceiptLineInput,
) {
  assertReceiptCustomer(customer);
  const env = getEnv();
  const email = customer.email?.trim() || undefined;
  const phone = customer.phone
    ? normalizeReceiptPhone(customer.phone)
    : undefined;
  const fullName = customer.fullName?.trim() || undefined;

  return {
    customer: {
      ...(fullName ? { full_name: fullName.slice(0, 256) } : {}),
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
    },
    items: [
      {
        description: line.description.slice(0, 128),
        quantity: 1.0,
        amount: {
          value: line.amountRub.toFixed(2),
          currency: line.currency,
        },
        vat_code: yooKassaVatCode[env.RECEIPT_VAT],
        payment_mode: "full_payment" as const,
        payment_subject: "service" as const,
      },
    ],
    tax_system_code: yooKassaTaxSystemCode[env.RECEIPT_SNO],
  };
}

export function buildRobokassaReceiptJson(line: ReceiptLineInput) {
  const env = getEnv();

  return JSON.stringify({
    sno: env.RECEIPT_SNO,
    items: [
      {
        name: line.description.slice(0, 128),
        quantity: 1,
        sum: Number(line.amountRub.toFixed(2)),
        payment_method: "full_payment",
        payment_object: "service",
        tax: env.RECEIPT_VAT,
      },
    ],
  });
}
