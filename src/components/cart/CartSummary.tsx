"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import type { Money } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  subtotal: Money;
  /** Disables the checkout button when there are no items. */
  empty?: boolean;
  /** Click handler for the checkout button (drawer or page may differ). */
  onCheckout?: () => void;
  className?: string;
};

export function CartSummary({ subtotal, empty, onCheckout, className }: Props) {
  const [explainerOpen, setExplainerOpen] = useState(false);

  const advance: Money = {
    amount: (Number(subtotal.amount) / 2).toFixed(2),
    currencyCode: subtotal.currencyCode,
  };
  const balance = advance;

  return (
    <div className={cn("flex flex-col gap-4 text-sm", className)}>
      <Row label="Subtotal" value={formatPrice(subtotal.amount, subtotal.currencyCode)} />

      <hr className="border-bayan-line" />

      <Row
        label="Advance (50%)"
        valueLabel="payable now"
        emphasis
        value={formatPrice(advance.amount, advance.currencyCode)}
      />
      <Row
        label="Balance (50%)"
        valueLabel="payable on delivery"
        value={formatPrice(balance.amount, balance.currencyCode)}
        labelTrailing={
          <button
            type="button"
            aria-label="How the 50% advance works"
            aria-expanded={explainerOpen}
            onClick={() => setExplainerOpen((v) => !v)}
            className="inline-flex h-5 w-5 items-center justify-center text-bayan-muted transition-colors hover:text-bayan-text"
          >
            <Info className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
        }
      />

      <AnimatePresence initial={false}>
        {explainerOpen ? (
          <motion.div
            key="explainer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="rounded bg-bayan-bg-alt p-3 text-[12px] leading-[1.7] text-bayan-muted">
              You pay <strong className="text-bayan-text">50% as an advance</strong> to
              confirm your order via bank transfer or JazzCash. The remaining{" "}
              <strong className="text-bayan-text">50% is collected in cash</strong>{" "}
              when your order arrives. It is our way of letting you try the
              fabric in person before committing fully.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <hr className="border-bayan-line" />

      <button
        type="button"
        disabled={empty}
        onClick={onCheckout}
        className={cn(
          "inline-flex w-full flex-col items-center justify-center rounded-full bg-bayan-primary-dark px-6 py-4 text-bayan-bg transition-all duration-300",
          empty
            ? "cursor-not-allowed opacity-50"
            : "hover:-translate-y-0.5 hover:bg-bayan-text hover:shadow-[0_14px_40px_-10px_rgba(42,46,37,0.4)]",
        )}
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.28em]">
          Proceed to Checkout
        </span>
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-bayan-bg/70">
          Pay 50% Now — {formatPrice(advance.amount, advance.currencyCode)}
        </span>
      </button>
    </div>
  );
}

type RowProps = {
  label: string;
  value: string;
  valueLabel?: string;
  labelTrailing?: React.ReactNode;
  emphasis?: boolean;
};

function Row({ label, value, valueLabel, labelTrailing, emphasis }: RowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            emphasis
              ? "font-medium text-bayan-accent-deep"
              : "text-bayan-text",
          )}
        >
          {label}
        </span>
        {labelTrailing}
      </div>
      <div className="text-right">
        <div
          className={cn(
            "tabular-nums",
            emphasis
              ? "font-semibold text-bayan-accent-deep"
              : "font-medium text-bayan-text",
          )}
        >
          {value}
        </div>
        {valueLabel ? (
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-bayan-muted">
            ← {valueLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
