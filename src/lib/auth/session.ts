import { redirect } from "next/navigation";

import { auth } from "./config";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  return user;
}
