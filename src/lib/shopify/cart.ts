"use server";

/**
 * Stub cart actions. Replaced with real Shopify cart mutations in Prompt 8.
 *
 * For now: logs the request server-side and returns a fake success payload.
 * The client wires this to the Add to Cart button via React's useTransition.
 */

export type AddToCartResult = {
  ok: boolean;
  totalQuantity: number;
};

export async function addToCart(
  variantId: string,
  quantity = 1,
): Promise<AddToCartResult> {
  // Simulate a small network round-trip so the optimistic UI is visible.
  await new Promise((resolve) => setTimeout(resolve, 350));
  console.log(
    `[cart] add ${quantity} × ${variantId} — wired to Shopify in Prompt 8`,
  );
  return { ok: true, totalQuantity: quantity };
}
