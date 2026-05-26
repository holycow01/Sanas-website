import { NextResponse, type NextRequest } from "next/server";
import { buildLogoutUrl } from "@/lib/shopify/customer-account";

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  // Clears local auth cookies and returns Shopify's end-session URL.
  const logoutUrl = await buildLogoutUrl(origin);
  return NextResponse.redirect(logoutUrl);
}
