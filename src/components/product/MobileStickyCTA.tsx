"use client";

import { useEffect, useState, useTransition } from "react";
import { Check } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
};

export function MobileStickyCTA({ product }: Props) {
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const { addLine, openCart } = useCart();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 320);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onAdd() {
    const first = product.variants[0];
    if (!first) return;
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      addLine(product, first.id, 1);
      setAdded(true);
      openCart();
      window.setTimeout(() => setAdded(false), 2200);
    });
  }

  const price = product.priceRange.minVariantPrice;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-bayan-line bg-bayan-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-serif text-base text-bayan-text">
            {product.title}
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-bayan-muted">
            {formatPrice(price.amount, price.currencyCode)}
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={pending}
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-bayan-primary-dark px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-bg transition-colors hover:bg-bayan-text",
            pending && "opacity-70",
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={1.8} />
              Added
            </>
          ) : pending ? (
            "Adding…"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
