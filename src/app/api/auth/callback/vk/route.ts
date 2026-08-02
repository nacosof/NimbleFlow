import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createSessionCookie,
  exchangeVkCode,
  fetchVkUserInfo,
  upsertVkUser,
} from "@/lib/auth/vk-id/oauth";

function loginErrorRedirect(origin: string, message: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const deviceId = url.searchParams.get("device_id");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    return loginErrorRedirect(
      origin,
      errorDescription || error || "vk_oauth_denied",
    );
  }

  const jar = await cookies();
  const expectedState = jar.get("vk_oauth_state")?.value;
  const codeVerifier = jar.get("vk_oauth_verifier")?.value;
  const callbackUrl = jar.get("vk_oauth_callback")?.value || "/profile";

  jar.delete("vk_oauth_state");
  jar.delete("vk_oauth_verifier");
  jar.delete("vk_oauth_callback");

  if (
    !code ||
    !state ||
    !deviceId ||
    !expectedState ||
    !codeVerifier ||
    state !== expectedState
  ) {
    return loginErrorRedirect(origin, "vk_oauth_state");
  }

  try {
    const tokens = await exchangeVkCode({
      code,
      codeVerifier,
      deviceId,
      state,
    });
    const profile = await fetchVkUserInfo(tokens.access_token);
    const user = await upsertVkUser(profile, tokens);
    const sessionCookie = await createSessionCookie(user);
    const response = NextResponse.redirect(new URL(callbackUrl, origin));
    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options,
    );
    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "vk_oauth_failed";
    return loginErrorRedirect(origin, message);
  }
}
