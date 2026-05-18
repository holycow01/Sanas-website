/**
 * Shopify webhook endpoint. Revalidates Next.js fetch caches when products
 * or collections change in the admin so the storefront picks up edits
 * within seconds instead of on the next deploy.
 *
 * Setup (one-time, in Shopify admin):
 *   Settings → Notifications → Webhooks
 *     - "Product update" → POST to https://<domain>/api/revalidate
 *     - "Collection update" → same URL
 *   In the webhook secret field, paste the value of SHOPIFY_REVALIDATION_SECRET.
 */

import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { TAGS } from "@/lib/shopify";

type Topic =
  | "products/update"
  | "products/create"
  | "products/delete"
  | "collections/update"
  | "collections/create"
  | "collections/delete";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (
    !process.env.SHOPIFY_REVALIDATION_SECRET ||
    secret !== process.env.SHOPIFY_REVALIDATION_SECRET
  ) {
    return NextResponse.json(
      { ok: false, reason: "invalid secret" },
      { status: 401 },
    );
  }

  const topic = (request.headers.get("x-shopify-topic") ?? "") as Topic;
  const body = (await request.json().catch(() => ({}))) as {
    handle?: string;
  };

  if (topic.startsWith("products/")) {
    revalidateTag(TAGS.products, "max");
    if (body.handle) revalidateTag(TAGS.product(body.handle), "max");
  } else if (topic.startsWith("collections/")) {
    revalidateTag(TAGS.collections, "max");
    if (body.handle) revalidateTag(TAGS.collection(body.handle), "max");
  } else {
    return NextResponse.json(
      { ok: true, ignored: true, topic },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true, topic, now: Date.now() });
}
