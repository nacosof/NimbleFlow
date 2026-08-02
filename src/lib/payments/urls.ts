import { getEnv } from "@/config/env";

function appBaseUrl() {
  return getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

export function getPaymentSuccessUrl() {
  const env = getEnv();
  return (
    env.YOOKASSA_RETURN_URL ||
    env.ROBOKASSA_SUCCESS_URL ||
    `${appBaseUrl()}/payments/success`
  );
}

export function getPaymentFailUrl() {
  const env = getEnv();
  return env.ROBOKASSA_FAIL_URL || `${appBaseUrl()}/payments/fail`;
}
