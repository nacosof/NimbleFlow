import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value,
  );
}

export function proxy(request: NextRequest) {
  const isLoggedIn = hasSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/profile") && !isLoggedIn) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/login"],
};
