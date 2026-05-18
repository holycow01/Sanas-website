"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Heart } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
};

function getSizeValue(variant: ProductVariant): string | undefined {
  return variant.selectedOptions.find((o) => o.name === "Size")?.value;
}

export function ProductInfo({ product }: Props) {
  const sizes = useMemo(
    () =>
      product.variants.map((v) => ({
        variant: v,
        size: getSizeValue(v) ?? v.title,
      })),
    [product.variants],
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    sizes[0]?.variant.id,
  );
  const selected = sizes.find((s) => s.variant.id === selectedVariantId);

  const price = selected?.variant.price ?? product.priceRange.minVariantPrice;
  const compareAt = selected?.variant.compareAtPrice ?? null;
  const onSale =
    compareAt && Number(compareAt.amount) > Number(price.amount);

  const { addLine, openCart } = useCart();
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  function onAdd() {
    if (!selectedVariantId) return;
    startTransition(async () => {
      // Small delay so the "Adding…" state is visible — matches eventual
      // network round-trip when this is wired to Shopify in Prompt 8.
      await new Promise((resolve) => setTimeout(resolve, 250));
      addLine(product, selectedVariantId, 1);
      setAdded(true);
      openCart();
      window.setTimeout(() => setAdded(false), 2200);
    });
  }

  return (
    <div className="flex flex-col">
      <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-accent-deep">
        {product.productType}
      </div>
      <h1 className="font-serif text-[clamp(34px,5vw,56px)] font-normal leading-[1.05] text-bayan-text">
        {product.title}
      </h1>

      <div className="mt-5 flex items-baseline gap-3 text-lg">
        {onSale ? (
          <>
            <span className="text-bayan-muted line-through">
              {formatPrice(compareAt!.amount, compareAt!.currencyCode)}
            </span>
            <span className="font-medium text-bayan-primary-dark">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
          </>
        ) : (
          <span className="font-medium text-bayan-text">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
        )}
      </div>

      <p className="mt-6 max-w-[440px] text-base leading-[1.85] text-bayan-muted">
        {product.description}
      </p>

      <div className="mt-9">
        <div className="mb-3 flex items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.28em]">
          <span className="text-bayan-text">Size</span>
          <span className="text-bayan-muted">
            {selected ? selected.size : "Choose a size"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map(({ variant, size }) => {
            const active = variant.id === selectedVariantId;
            const sold = !variant.availableForSale;
            return (
              <button
                key={variant.id}
                type="button"
                aria-pressed={active}
                disabled={sold}
                onClick={() => setSelectedVariantId(variant.id)}
                className={cn(
                  "h-11 min-w-[52px] rounded-full border px-4 text-[12px] font-medium tracking-[0.18em] transition-all duration-300",
                  active
                    ? "border-bayan-primary-dark bg-bayan-primary-dark text-bayan-bg"
                    : "border-bayan-line bg-transparent text-bayan-text hover:border-bayan-primary-dark/60",
                  sold && "cursor-not-allowed opacity-50 line-through",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-stretch gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={onAdd}
          className={cn(
            "inline-flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-full bg-bayan-primary-dark px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text hover:shadow-[0_14px_40px_-10px_rgba(42,46,37,0.4)]",
            pending && "opacity-70",
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={1.8} />
              Added to bag
            </>
          ) : pending ? (
            "Adding…"
          ) : (
            "Add to Cart"
          )}
        </button>
        <button
          type="button"
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setWishlisted((w) => !w)}
          className={cn(
            "inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-bayan-text bg-transparent transition-all duration-300 hover:bg-bayan-text hover:text-bayan-bg",
            wishlisted && "border-bayan-primary-dark bg-bayan-primary-dark text-bayan-bg",
          )}
        >
          <Heart
            className="h-5 w-5"
            strokeWidth={1.4}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  );
}
