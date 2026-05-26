import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "bayan_ca_access";
const REFRESH_COOKIE = "bayan_ca_refresh";

/** Protect /account/* — redirect to login when there's no session. */
export function middleware(request: NextRequest) {
  // Access tokens are short-lived; a refresh token still counts as a session
  // (the server refreshes the access token on demand).
  const token =
    request.cookies.get(ACCESS_COOKIE)?.value ??
    request.cookies.get(REFRESH_COOKIE)?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/account/login";

  if (!token && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/account/login";
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
