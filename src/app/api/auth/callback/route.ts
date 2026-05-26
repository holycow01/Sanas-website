import { NextResponse, type NextRequest } from "next/server";
import { exchangeCodeForTokens } from "@/lib/shopify/customer-account";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(`${origin}/account/login?error=auth`);
  }

  const ok = await exchangeCodeForTokens(origin, code, state);
  return NextResponse.redirect(
    `${origin}${ok ? "/account" : "/account/login?error=auth"}`,
  );
}
