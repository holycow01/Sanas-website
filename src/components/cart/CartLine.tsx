"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem } from "@/lib/shopify/types";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";

type Props = {
  line: CartItem;
  /** Called after a link inside the line is clicked (e.g., to close a drawer). */
  onNavigate?: () => void;
};

export function CartLine({ line, onNavigate }: Props) {
  const { removeLine, updateQuantity } = useCart();
  const size = line.merchandise.selectedOptions.find((o) => o.name === "Size")
    ?.value;
  const href = `/product/${line.merchandise.product.handle}`;

  return (
    <div className="flex gap-4 border-b border-bayan-line py-5">
      <Link
        href={href}
        onClick={onNavigate}
        className="relative block aspect-[3/4] w-20 shrink-0 overflow-hidden rounded bg-bayan-bg-alt"
        aria-label={`View ${line.merchandise.product.title}`}
      >
        <Image
          src={line.merchandise.product.featuredImage.url}
          alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={href}
              onClick={onNavigate}
              className="font-serif text-base text-bayan-text hover:text-bayan-primary-dark"
            >
              {line.merchandise.product.title}
            </Link>
            {size ? (
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-bayan-muted">
                Size · {size}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Remove from bag"
            onClick={() => line.id && removeLine(line.id)}
            className="-mr-1 -mt-1 flex h-7 w-7 items-center justify-center text-bayan-muted transition-colors hover:text-bayan-text"
          >
            <X className="h-4 w-4" strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-bayan-line">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() =>
                line.id && updateQuantity(line.id, line.quantity - 1)
              }
              className="flex h-8 w-8 items-center justify-center text-bayan-text transition-colors hover:text-bayan-primary-dark"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
            <span className="min-w-[20px] text-center text-[12px] font-medium tabular-nums text-bayan-text">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() =>
                line.id && updateQuantity(line.id, line.quantity + 1)
              }
              className="flex h-8 w-8 items-center justify-center text-bayan-text transition-colors hover:text-bayan-primary-dark"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          </div>
          <div className="text-sm font-medium tracking-[0.06em] text-bayan-text">
            {formatPrice(
              line.cost.totalAmount.amount,
              line.cost.totalAmount.currencyCode,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
