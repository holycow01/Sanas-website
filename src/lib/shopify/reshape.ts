/**
 * Helpers to reshape the raw Shopify Storefront GraphQL response into our
 * flatter, easier-to-consume types. Specifically: GraphQL Connections
 * (`{ edges: [{ node }] }`) get flattened to plain arrays.
 */

import type {
  Cart,
  CartItem,
  Collection,
  Image,
  Product,
} from "./types";

type Connection<T> = { edges: Array<{ node: T }> } | null | undefined;

export function flatten<T>(connection: Connection<T>): T[] {
  return connection?.edges.map((e) => e.node) ?? [];
}

type ShopifyProductNode = Omit<Product, "variants" | "images"> & {
  variants: Connection<Product["variants"][number]>;
  images: Connection<Image>;
};

export function reshapeProduct(node: ShopifyProductNode): Product {
  return {
    ...node,
    variants: flatten(node.variants),
    images: flatten(node.images),
    // Shopify returns `featuredImage: null` for products without one — fall
    // back to the first gallery image, or a 1x1 transparent stub.
    featuredImage:
      node.featuredImage ?? flatten(node.images)[0] ?? {
        url: "data:image/gif;base64,R0lGODlhAQABAAAAACw=",
        altText: node.title,
        width: 1,
        height: 1,
      },
  };
}

export function reshapeCollection(
  node: Omit<Collection, "path">,
): Collection {
  return { ...node, path: `/collections/${node.handle}` };
}

type ShopifyCartLineNode = {
  id: string;
  quantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{ name: string; value: string }>;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
  };
};

type ShopifyCartNode = Omit<Cart, "lines"> & {
  lines: Connection<ShopifyCartLineNode>;
};

export function reshapeCart(cart: ShopifyCartNode): Cart {
  return {
    ...cart,
    cost: {
      ...cart.cost,
      totalTaxAmount: cart.cost.totalTaxAmount ?? {
        amount: "0.0",
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
    },
    lines: flatten(cart.lines).map<CartItem>((line) => ({
      id: line.id,
      quantity: line.quantity,
      cost: line.cost,
      merchandise: {
        id: line.merchandise.id,
        title: line.merchandise.title,
        selectedOptions: line.merchandise.selectedOptions,
        product: {
          id: line.merchandise.product.id,
          handle: line.merchandise.product.handle,
          title: line.merchandise.product.title,
          featuredImage:
            line.merchandise.product.featuredImage ?? {
              url: "data:image/gif;base64,R0lGODlhAQABAAAAACw=",
              altText: line.merchandise.product.title,
              width: 1,
              height: 1,
            },
        },
      },
    })),
  };
}
