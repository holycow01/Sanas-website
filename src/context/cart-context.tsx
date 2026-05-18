"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addCartLine,
  createCart,
  fetchCart,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify/cart-actions";
import type { Cart, CartItem, Money, Product } from "@/lib/shopify/types";

const STORAGE_KEY = "bayan-cart-id-v2";
const EMPTY_MONEY: Money = { amount: "0.0", currencyCode: "PKR" };

type CartContextValue = {
  ready: boolean;
  pending: boolean;
  cart: Cart | null;
  lines: CartItem[];
  totalQuantity: number;
  subtotal: Money;
  checkoutUrl: string | null;
  isOpen: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addLine: (product: Product, variantId: string, quantity?: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opsCount, setOpsCount] = useState(0);
  const pending = opsCount > 0;

  // Hold the latest cart.id in a ref so concurrent calls don't double-create.
  const cartIdRef = useRef<string | null>(null);
  useEffect(() => {
    cartIdRef.current = cart?.id ?? null;
  }, [cart]);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    (async () => {
      try {
        const id = localStorage.getItem(STORAGE_KEY);
        if (id) {
          const c = await fetchCart(id);
          if (c) {
            setCart(c);
          } else {
            // cart expired / deleted server-side
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (err) {
        console.warn("[cart] hydrate failed", err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Persist cart id on change.
  useEffect(() => {
    if (!ready) return;
    if (cart?.id) localStorage.setItem(STORAGE_KEY, cart.id);
    else localStorage.removeItem(STORAGE_KEY);
  }, [cart, ready]);

  // Body scroll lock while drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const wrap = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      setError(null);
      setOpsCount((c) => c + 1);
      try {
        return await fn();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Cart action failed";
        setError(msg);
        throw e;
      } finally {
        setOpsCount((c) => c - 1);
      }
    },
    [],
  );

  const addLine = useCallback(
    (_product: Product, variantId: string, quantity = 1) =>
      wrap(async () => {
        let cartId = cartIdRef.current;
        if (!cartId) {
          const created = await createCart();
          if (!created.id) throw new Error("Shopify did not return a cart id");
          cartId = created.id;
          cartIdRef.current = cartId;
        }
        const next = await addCartLine(cartId, variantId, quantity);
        setCart(next);
      }),
    [wrap],
  );

  const removeLine = useCallback(
    (lineId: string) =>
      wrap(async () => {
        const cartId = cartIdRef.current;
        if (!cartId) return;
        const next = await removeCartLine(cartId, lineId);
        setCart(next);
      }),
    [wrap],
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) =>
      wrap(async () => {
        const cartId = cartIdRef.current;
        if (!cartId) return;
        const next =
          quantity < 1
            ? await removeCartLine(cartId, lineId)
            : await updateCartLine(cartId, lineId, quantity);
        setCart(next);
      }),
    [wrap],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const lines = cart?.lines ?? [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  const subtotal = cart?.cost.subtotalAmount ?? EMPTY_MONEY;
  const checkoutUrl = cart?.checkoutUrl ?? null;

  const value = useMemo<CartContextValue>(
    () => ({
      ready,
      pending,
      cart,
      lines,
      totalQuantity,
      subtotal,
      checkoutUrl,
      isOpen,
      error,
      openCart,
      closeCart,
      addLine,
      removeLine,
      updateQuantity,
    }),
    [
      ready,
      pending,
      cart,
      lines,
      totalQuantity,
      subtotal,
      checkoutUrl,
      isOpen,
      error,
      openCart,
      closeCart,
      addLine,
      removeLine,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
