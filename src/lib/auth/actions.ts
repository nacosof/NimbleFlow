"use server";

import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";
import { isDevLoginEnabled } from "@/lib/auth/dev-login";

export async function signInWithProvider(
  provider: "yandex" | "vk",
  callbackUrl = "/profile",
) {
  if (provider === "vk") {
    redirect(
      `/api/auth/vk/start?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  await signIn(provider, { redirectTo: callbackUrl });
}

export async function signInWithDevLogin(callbackUrl = "/profile") {
  if (!isDevLoginEnabled()) {
    throw new Error("Dev login is disabled");
  }

  await signIn("dev-login", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
