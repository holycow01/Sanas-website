"use server";

/**
 * Cart server actions wrapping Shopify Storefront mutations.
 *
 * The client cart context (src/context/cart-context.tsx) calls these from
 * `useTransition`, stores the returned cart in React state, and persists the
 * cart id in localStorage.
 *
 * If Shopify isn't configured, these throw — the cart context detects the
 * env via `isShopifyConfigured()` and falls back to a local-only cart.
 */

import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
} from "./mutations";
import { GET_CART_QUERY } from "./queries";
import { reshapeCart } from "./reshape";
import { shopifyFetch } from "./shopify-fetch";
import type { Cart } from "./types";

type UserError = { field: string[] | null; message: string; code: string | null };
type CartMutationResult = {
  cart: Parameters<typeof reshapeCart>[0] | null;
  userErrors: UserError[];
};

function ensureCart(result: CartMutationResult, fallbackMsg: string): Cart {
  if (result.userErrors?.length) {
    throw new Error(
      result.userErrors.map((e) => e.message).join("; ") || fallbackMsg,
    );
  }
  if (!result.cart) {
    throw new Error(fallbackMsg);
  }
  return reshapeCart(result.cart);
}

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartMutationResult }>({
    query: CART_CREATE_MUTATION,
    variables: { input: {} },
    cache: "no-store",
  });
  return ensureCart(data.cartCreate, "Could not create cart");
}

export async function fetchCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{
    cart: Parameters<typeof reshapeCart>[0] | null;
  }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: "no-store",
  });
  return data.cart ? reshapeCart(data.cart) : null;
}

export async function addCartLine(
  cartId: string,
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResult }>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    cache: "no-store",
  });
  return ensureCart(data.cartLinesAdd, "Could not add line");
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResult }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: "no-store",
  });
  return ensureCart(data.cartLinesUpdate, "Could not update line");
}

export async function removeCartLine(
  cartId: string,
  lineId: string,
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResult }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds: [lineId],
    },
    cache: "no-store",
  });
  return ensureCart(data.cartLinesRemove, "Could not remove line");
}
