import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "bayan_customer_token";

/** Protect /account/* — redirect to login when there's no auth token. */
export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname === "/account/login" || pathname === "/account/register";

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
