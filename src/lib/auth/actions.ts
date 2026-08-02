"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInWithProvider(
  provider: "yandex" | "vk" | "mailru",
  callbackUrl = "/profile",
) {
  await signIn(provider, { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
