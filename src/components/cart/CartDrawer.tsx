"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartLine } from "./CartLine";
import { CartSummary } from "./CartSummary";

export function CartDrawer() {
  const { isOpen, closeCart, lines, totalQuantity, subtotal, ready, checkoutUrl } = useCart();
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeCart}
          className="fixed inset-0 z-[70] bg-black/40"
          aria-hidden="true"
        >
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-bayan-bg text-bayan-text shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.25)]"
          >
            <header className="flex items-center justify-between border-b border-bayan-line px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
                <h2 className="text-[11px] font-medium uppercase tracking-[0.28em]">
                  Your Bag
                  {ready && totalQuantity > 0 ? (
                    <span className="ml-2 text-bayan-muted">({totalQuantity})</span>
                  ) : null}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={closeCart}
                className="-mr-2 flex h-9 w-9 items-center justify-center text-bayan-text"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {!ready ? null : lines.length === 0 ? (
                <CartEmpty onContinue={closeCart} />
              ) : (
                <div className="divide-bayan-line">
                  {lines.map((line) => (
                    <CartLine
                      key={line.id}
                      line={line}
                      onNavigate={closeCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {ready && lines.length > 0 ? (
              <footer className="border-t border-bayan-line bg-bayan-bg/95 px-6 py-5 backdrop-blur">
                <CartSummary
                  subtotal={subtotal}
                  empty={lines.length === 0 || !checkoutUrl}
                  onCheckout={() => {
                    if (checkoutUrl) window.location.href = checkoutUrl;
                  }}
                />
              </footer>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CartEmpty({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <ShoppingBag
        className="h-10 w-10 text-bayan-muted"
        strokeWidth={1.2}
      />
      <h3 className="font-serif text-2xl text-bayan-text">Your bag is empty.</h3>
      <p className="max-w-[280px] text-sm text-bayan-muted">
        Pieces you love will rest here until you&rsquo;re ready.
      </p>
      <Link
        href="/shop"
        onClick={onContinue}
        className="mt-2 inline-flex items-center rounded-full border border-bayan-text px-6 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text hover:text-bayan-bg"
      >
        Continue shopping
      </Link>
    </div>
  );
}
