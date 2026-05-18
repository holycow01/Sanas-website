/**
 * Generic Storefront API fetcher.
 *
 * Reads SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN from env.
 * If either is missing, `isShopifyConfigured()` returns false — callers in
 * `index.ts` fall back to the mock client.
 */

const API_VERSION = "2025-01";

export function isShopifyConfigured(): boolean {
  return !!(
    process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}

type FetchOptions<V> = {
  query: string;
  variables?: V;
  /** Tags for Next.js's fetch cache — pass them through revalidateTag(). */
  tags?: string[];
  cache?: RequestCache;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: unknown }>;
};

export async function shopifyFetch<T, V = Record<string, unknown>>({
  query,
  variables,
  tags,
  cache,
}: FetchOptions<V>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) {
    throw new Error(
      "Shopify is not configured — set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local",
    );
  }

  const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
    ...(cache ? { cache } : {}),
    ...(tags ? { next: { tags } } : {}),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Shopify ${res.status} ${res.statusText}: ${body}`);
  }

  const json = (await res.json()) as ShopifyResponse<T>;
  if (json.errors?.length) {
    throw new Error(
      `Shopify GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!json.data) {
    throw new Error("Shopify GraphQL: empty data");
  }
  return json.data;
}
