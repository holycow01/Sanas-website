/**
 * Shopify client — real Storefront API only.
 *
 * If the env vars are missing, each function logs a warning and returns empty
 * results (never fake/mock data). The storefront shows only what lives in the
 * connected Shopify store.
 */

import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
} from "./queries";
import { flatten, reshapeCollection, reshapeProduct } from "./reshape";
import { isShopifyConfigured, shopifyFetch } from "./shopify-fetch";
import type { Collection, Product, ProductSortKey } from "./types";

let warned = false;
function warnUnconfigured(action: string) {
  if (warned) return;
  warned = true;
  console.warn(
    `[shopify] ${action}: SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN missing — returning empty results. Set them in .env.local.`,
  );
}

export const TAGS = {
  products: "shopify-products",
  product: (handle: string) => `shopify-product-${handle}`,
  collections: "shopify-collections",
  collection: (handle: string) => `shopify-collection-${handle}`,
} as const;

// ───────────────────────────────────────────── products

export type GetProductsOptions = {
  first?: number;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  query?: string;
};

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    warnUnconfigured("getProducts");
    return [];
  }
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: Parameters<typeof reshapeProduct>[0] }> };
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: {
      first: options.first ?? 100,
      sortKey: options.sortKey ?? "CREATED_AT",
      reverse: options.reverse ?? false,
      query: options.query,
    },
    tags: [TAGS.products],
  });
  return flatten(data.products).map(reshapeProduct);
}

export async function getProduct(
  handle: string,
): Promise<Product | undefined> {
  if (!isShopifyConfigured()) {
    warnUnconfigured("getProduct");
    return undefined;
  }
  const data = await shopifyFetch<{
    product: Parameters<typeof reshapeProduct>[0] | null;
  }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    tags: [TAGS.product(handle), TAGS.products],
  });
  return data.product ? reshapeProduct(data.product) : undefined;
}

export async function getRelatedProducts(
  productId: string,
): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    warnUnconfigured("getRelatedProducts");
    return [];
  }
  const data = await shopifyFetch<{
    productRecommendations: Array<Parameters<typeof reshapeProduct>[0]> | null;
  }>({
    query: GET_PRODUCT_RECOMMENDATIONS_QUERY,
    variables: { productId },
    tags: [TAGS.products],
  });
  return (data.productRecommendations ?? []).slice(0, 4).map(reshapeProduct);
}

// ───────────────────────────────────────────── collections

export async function getCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) {
    warnUnconfigured("getCollections");
    return [];
  }
  const data = await shopifyFetch<{
    collections: {
      edges: Array<{ node: Parameters<typeof reshapeCollection>[0] }>;
    };
  }>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first: 50 },
    tags: [TAGS.collections],
  });
  return flatten(data.collections).map(reshapeCollection);
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  if (!isShopifyConfigured()) {
    warnUnconfigured("getCollection");
    return undefined;
  }
  const data = await shopifyFetch<{
    collection: Parameters<typeof reshapeCollection>[0] | null;
  }>({
    query: GET_COLLECTION_BY_HANDLE_QUERY,
    variables: { handle },
    tags: [TAGS.collection(handle)],
  });
  return data.collection ? reshapeCollection(data.collection) : undefined;
}

export async function getCollectionProducts(
  handle: string,
  options: Pick<GetProductsOptions, "sortKey" | "reverse" | "first"> = {},
): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    warnUnconfigured("getCollectionProducts");
    return [];
  }
  const data = await shopifyFetch<{
    collection: {
      products: {
        edges: Array<{ node: Parameters<typeof reshapeProduct>[0] }>;
      };
    } | null;
  }>({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: {
      handle,
      first: options.first ?? 100,
      sortKey:
        options.sortKey === "CREATED_AT"
          ? "CREATED"
          : options.sortKey ?? "COLLECTION_DEFAULT",
      reverse: options.reverse ?? false,
    },
    tags: [TAGS.collection(handle)],
  });
  if (!data.collection) return [];
  return flatten(data.collection.products).map(reshapeProduct);
}

// ───────────────────────────────────────────── re-exports

export type {
  Cart,
  CartItem,
  Collection,
  Image,
  Money,
  Product,
  ProductOption,
  ProductSortKey,
  ProductVariant,
  SEO,
  SelectedOption,
} from "./types";
export { isShopifyConfigured } from "./shopify-fetch";
