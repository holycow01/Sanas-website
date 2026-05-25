"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Real FAQ content supplied by the brand owner. */
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What sizes do you offer?",
    a: "We currently offer stitched outfits in Small (S), Medium (M), and Large (L). A detailed size chart is available for guidance.",
  },
  {
    q: "Are the measurements exact?",
    a: "Measurements may vary slightly (0.5–1 inch) due to manual stitching and the nature of the fabric.",
  },
  {
    q: "How do I know which size will fit me best?",
    a: "You can compare our size chart measurements with your own outfit for a better understanding. You can also send us a WhatsApp message or Instagram DM and we will help you choose the best size.",
  },
  {
    q: "Can I request custom stitching or size changes?",
    a: "At the moment, we only offer standard stitched sizes and do not provide custom alterations.",
  },
  {
    q: "What fabric do you use?",
    a: "Fabric details for every article are mentioned separately in the product post or description.",
  },
  {
    q: "Will the outfit color look exactly the same in real life?",
    a: "We try to keep colors as accurate as possible, but slight variations may occur because of lighting, editing, and screen brightness.",
  },
  {
    q: "How can I place an order?",
    a: "Orders can be placed directly through Instagram DM, WhatsApp, or our website. Orders placed through the website will be catered to first.",
  },
  {
    q: "What is your payment policy?",
    a: "We require 50% advance payment to confirm and process the order. The remaining 50% is to be paid at the time of delivery. Cash on delivery only applies to the remaining 50% amount.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are usually delivered within 3–5 working days for major cities and 5–7 working days for other areas.",
  },
  {
    q: "Can I cancel my order after placing it?",
    a: "If you refuse to receive the parcel after paying the 50% advance amount, the order will only be canceled once we receive the parcel back in good condition. Delivery charges and any additional expenses will be deducted, and the remaining advance amount will then be refunded.",
  },
  {
    q: "How should I wash the outfit?",
    a: "For longer fabric life, we recommend gentle hand wash or dry clean, avoiding bleach, and ironing on low heat.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-bayan-line">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-bayan-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span
                className={cn(
                  "font-serif text-lg transition-colors duration-300 md:text-xl",
                  isOpen ? "text-bayan-primary-dark" : "text-bayan-text",
                )}
              >
                {item.q}
              </span>
              <Plus
                className={cn(
                  "h-4 w-4 shrink-0 text-bayan-muted transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
                strokeWidth={1.6}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[640px] pb-6 text-[15px] leading-[1.85] text-bayan-muted">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
