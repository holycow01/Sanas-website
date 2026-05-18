"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterPanel } from "./FilterPanel";

type Props = {
  resultCount: number;
};

export function MobileFilterDrawer({ resultCount }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-bayan-line bg-transparent px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-text transition-colors duration-300 hover:border-bayan-primary-dark/60 md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} />
        Filter
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[55] bg-black/40 md:hidden"
          >
            <motion.div
              key="panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-bayan-bg pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex items-center justify-between border-b border-bayan-line px-6 py-5">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text">
                  Filter
                </h2>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setOpen(false)}
                  className="-mr-2 flex h-9 w-9 items-center justify-center text-bayan-text"
                >
                  <X className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </div>
              <div className="px-6">
                <FilterPanel inline />
              </div>
              <div className="sticky bottom-0 bg-bayan-bg/95 px-6 py-4 backdrop-blur">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-bayan-primary-dark py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-colors hover:bg-bayan-text"
                >
                  Show {resultCount} {resultCount === 1 ? "result" : "results"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
