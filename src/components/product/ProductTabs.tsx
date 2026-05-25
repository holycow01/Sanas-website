"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/shopify/types";
import { SizeChart } from "./SizeChart";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
};

const FABRIC_DEFAULT =
  "Hand-finished lawn / cotton / silk blends sourced from mills in Faisalabad and Karachi. All embroidery is done by hand in our atelier.";

const CARE_DEFAULT =
  "Dry clean recommended. For light freshening, hand wash in cold water with mild detergent. Lay flat to dry, away from direct sunlight. Iron on low heat from the reverse.";

export function ProductTabs({ product }: Props) {
  const tabs: Array<{ id: string; label: string; content: ReactNode }> = [
    { id: "description", label: "Description", content: product.description },
    { id: "fabric", label: "Fabric & Craft", content: FABRIC_DEFAULT },
    { id: "care", label: "Care", content: CARE_DEFAULT },
    { id: "size", label: "Size Guide", content: <SizeChart /> },
  ];

  // Desktop: tab strip; Mobile: collapsible accordion (default collapsed)
  const [activeDesktop, setActiveDesktop] = useState<string>("description");
  const [openMobile, setOpenMobile] = useState<string | null>(null);

  return (
    <div className="mt-12 border-t border-bayan-line pt-2">
      {/* Desktop tabs */}
      <div className="hidden md:block">
        <div className="flex gap-8 border-b border-bayan-line">
          {tabs.map((t) => {
            const active = activeDesktop === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveDesktop(t.id)}
                className={cn(
                  "relative -mb-px py-4 text-[11px] font-medium uppercase tracking-[0.28em] transition-colors duration-300",
                  active
                    ? "text-bayan-text"
                    : "text-bayan-muted hover:text-bayan-text",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "absolute -bottom-px left-0 h-px bg-bayan-primary-dark transition-all duration-300",
                    active ? "w-full" : "w-0",
                  )}
                />
              </button>
            );
          })}
        </div>
        <div className="min-h-[120px] py-7 text-[15px] leading-[1.85] text-bayan-muted">
          {tabs.find((t) => t.id === activeDesktop)?.content}
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden">
        {tabs.map((t) => {
          const open = openMobile === t.id;
          return (
            <div key={t.id} className="border-b border-bayan-line">
              <button
                type="button"
                onClick={() => setOpenMobile(open ? null : t.id)}
                aria-expanded={open}
                className="flex w-full items-center justify-between py-5 text-left text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text"
              >
                {t.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-bayan-muted transition-transform duration-300",
                    open && "rotate-180",
                  )}
                  strokeWidth={1.4}
                />
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 text-[15px] leading-[1.85] text-bayan-muted">
                      {t.content}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
