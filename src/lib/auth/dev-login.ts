import { getEnv } from "@/config/env";

export const DEV_USER_ID = "dev-user";
export const DEV_USER_EMAIL = "dev@nimbleflow.local";
export const DEV_USER_NAME = "Dev User";

export function isDevLoginEnabled() {
  const env = getEnv();
  return env.NODE_ENV !== "production" && env.AUTH_DEV_LOGIN;
}

export function isDevUserId(userId: string) {
  return userId === DEV_USER_ID;
}

export function getDevUser() {
  return {
    id: DEV_USER_ID,
    email: DEV_USER_EMAIL,
    name: DEV_USER_NAME,
    plan: "free",
  };
}

export function getDevProfileContact() {
  return {
    email: DEV_USER_EMAIL,
    emailVerified: null as Date | null,
    phone: null as string | null,
    phoneVerifiedAt: null as Date | null,
    name: DEV_USER_NAME,
    plan: "free",
  };
}
