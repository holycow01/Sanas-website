"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SORTS, type Sort } from "@/lib/shop-filters";

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const current = (search.get("sort") as Sort | null) ?? "newest";

  function onChange(value: Sort) {
    const next = new URLSearchParams(search.toString());
    if (value === "newest") next.delete("sort");
    else next.set("sort", value);
    const qs = next.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="sort-select">
        Sort products
      </label>
      <select
        id="sort-select"
        value={current}
        onChange={(e) => onChange(e.target.value as Sort)}
        className="cursor-pointer appearance-none rounded-full border border-bayan-line bg-transparent py-2.5 pl-4 pr-9 text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-text outline-none transition-colors duration-300 hover:border-bayan-primary-dark/60 focus:border-bayan-primary-dark"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bayan-muted"
        strokeWidth={1.4}
      />
    </div>
  );
}
