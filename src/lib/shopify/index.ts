/**
 * Shopify client. Real Storefront API when env vars are set, mock otherwise.
 *
 * Function signatures are stable — pages don't change when the data source flips.
 */

import {
  collectionMembership,
  collections as mockCollections,
  products as mockProducts,
} from "./mock";
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
} from "./queries";
import {
  flatten,
  reshapeCollection,
  reshapeProduct,
} from "./reshape";
import { isShopifyConfigured, shopifyFetch } from "./shopify-fetch";
import type { Collection, Product, ProductSortKey } from "./types";

let mockWarned = false;
function warnMock(action: string) {
  if (mockWarned) return;
  mockWarned = true;
  console.warn(
    `[shopify] ${action}: SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN missing — falling back to mock data. Set them in .env.local to use the real API.`,
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
    warnMock("getProducts");
    return mockGetProducts(options);
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
    warnMock("getProduct");
    return mockProducts.find((p) => p.handle === handle);
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
    warnMock("getRelatedProducts");
    const source = mockProducts.find((p) => p.id === productId);
    if (!source) return [];
    return mockProducts
      .filter((p) => p.id !== productId && p.productType === source.productType)
      .slice(0, 4);
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
    warnMock("getCollections");
    return mockCollections;
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
    warnMock("getCollection");
    return mockCollections.find((c) => c.handle === handle);
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
    warnMock("getCollectionProducts");
    const handles = collectionMembership[handle];
    if (!handles) return [];
    let result = mockProducts.filter((p) => handles.includes(p.handle));
    if (options.first) result = result.slice(0, options.first);
    return result;
  }
  // Storefront's ProductCollectionSortKeys is a different enum than ProductSortKeys,
  // but the overlap (CREATED, PRICE, TITLE, BEST_SELLING, RELEVANCE) covers our cases.
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

// ───────────────────────────────────────────── mock-only helpers

async function mockGetProducts(
  options: GetProductsOptions,
): Promise<Product[]> {
  let result = [...mockProducts];
  if (options.query) {
    const q = options.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (options.sortKey === "CREATED_AT") {
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (options.sortKey === "PRICE") {
    result.sort(
      (a, b) =>
        Number(a.priceRange.minVariantPrice.amount) -
        Number(b.priceRange.minVariantPrice.amount),
    );
  } else if (options.sortKey === "TITLE") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (options.reverse) result.reverse();
  if (options.first) result = result.slice(0, options.first);
  return result;
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
