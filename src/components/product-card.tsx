"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  className?: string;
};

function pickBadge(tags: string[]): string | null {
  if (tags.includes("limited")) return "Limited";
  if (tags.includes("new")) return "New";
  if (tags.includes("sale")) return "Sale";
  return null;
}

export function ProductCard({ product, className }: Props) {
  const badge = pickBadge(product.tags);
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.variants[0]?.compareAtPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);

  return (
    <Link
      href={`/product/${product.handle}`}
      className={cn("group block transition-transform duration-500 hover:-translate-y-1", className)}
    >
      <div className="relative mb-[18px] aspect-[3/4] overflow-hidden rounded bg-bayan-bg-alt">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, rgba(193,165,114,0.18), transparent 50%), radial-gradient(circle at 70% 80%, rgba(111,129,97,0.15), transparent 50%)",
          }}
        />
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        {badge ? (
          <span className="absolute left-3.5 top-3.5 z-[2] rounded-full bg-bayan-bg px-2.5 py-[5px] text-[10px] uppercase tracking-[0.2em] text-bayan-text">
            {badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={`Quick add ${product.title}`}
          className="absolute inset-x-3 bottom-3 z-[2] translate-y-2 rounded-full bg-bayan-bg-dark px-3 py-3 text-[10px] uppercase tracking-[0.28em] text-bayan-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          + Quick Add
        </button>
      </div>

      <div className="px-1">
        <div className="font-serif text-xl font-medium text-bayan-text">
          {product.title}
        </div>
        <div className="mb-2.5 mt-1 text-[11px] uppercase tracking-[0.18em] text-bayan-muted">
          {product.productType}
        </div>
        <div className="text-sm font-medium tracking-[0.08em] text-bayan-text">
          {onSale ? (
            <>
              <span className="mr-2 font-normal text-bayan-muted line-through">
                {formatPrice(compareAt!.amount, compareAt!.currencyCode)}
              </span>
              <span className="text-bayan-primary-dark">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
            </>
          ) : (
            <span>{formatPrice(price.amount, price.currencyCode)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
