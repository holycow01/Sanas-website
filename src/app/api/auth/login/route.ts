import { NextResponse, type NextRequest } from "next/server";
import {
  buildAuthorizationUrl,
  isCustomerAccountsConfigured,
} from "@/lib/shopify/customer-account";

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  if (!isCustomerAccountsConfigured()) {
    return NextResponse.redirect(`${origin}/account/login?error=config`);
  }
  const authUrl = await buildAuthorizationUrl(origin);
  return NextResponse.redirect(authUrl);
}
