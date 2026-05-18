"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartLine } from "@/components/cart/CartLine";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { lines, totalQuantity, subtotal, ready, checkoutUrl } = useCart();

  return (
    <section className="px-6 pb-24 pt-12 md:px-9 md:pt-16">
      <header className="mx-auto mb-10 max-w-[1100px]">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
          Your Bag
        </div>
        <h1 className="font-serif text-[clamp(34px,5vw,56px)] font-normal leading-[1.05] text-bayan-text">
          Checkout
        </h1>
        {ready && totalQuantity > 0 ? (
          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-bayan-muted">
            {totalQuantity} {totalQuantity === 1 ? "piece" : "pieces"} in your bag
          </p>
        ) : null}
      </header>

      {!ready ? null : lines.length === 0 ? (
        <div className="mx-auto flex max-w-[480px] flex-col items-center gap-5 py-16 text-center">
          <ShoppingBag
            className="h-12 w-12 text-bayan-muted"
            strokeWidth={1.2}
          />
          <h2 className="font-serif text-3xl text-bayan-text">
            Your bag is empty.
          </h2>
          <p className="max-w-[360px] text-sm text-bayan-muted">
            Browse the latest arrivals — pieces you love will rest here until
            you&rsquo;re ready.
          </p>
          <Link
            href="/shop"
            className="mt-2 inline-flex items-center rounded-full bg-bayan-primary-dark px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-colors hover:bg-bayan-text"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 md:grid-cols-[1fr_360px]">
          <div className="md:border-r md:border-bayan-line md:pr-12">
            {lines.map((line) => (
              <CartLine key={line.id} line={line} />
            ))}
          </div>
          <aside>
            <div className="rounded-md border border-bayan-line p-6">
              <h2 className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text">
                Order Summary
              </h2>
              <CartSummary
                subtotal={subtotal}
                empty={lines.length === 0 || !checkoutUrl}
                onCheckout={() => {
                  if (checkoutUrl) window.location.href = checkoutUrl;
                }}
              />
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
