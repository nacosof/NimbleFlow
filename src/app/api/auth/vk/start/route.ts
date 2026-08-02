import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getEnv } from "@/config/env";
import {
  buildVkAuthorizeUrl,
  createPkcePair,
} from "@/lib/auth/vk-id/oauth";

export async function GET(request: Request) {
  const env = getEnv();
  if (!env.AUTH_VK_ID || !env.AUTH_VK_SECRET) {
    return NextResponse.json(
      { error: "VK ID is not configured" },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const callbackUrl = url.searchParams.get("callbackUrl") || "/profile";
  const { codeVerifier, codeChallenge, state } = createPkcePair();
  const jar = await cookies();

  jar.set("vk_oauth_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: env.NODE_ENV === "production",
  });
  jar.set("vk_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: env.NODE_ENV === "production",
  });
  jar.set("vk_oauth_callback", callbackUrl, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: env.NODE_ENV === "production",
  });

  return NextResponse.redirect(
    buildVkAuthorizeUrl({ codeChallenge, state }),
  );
}
