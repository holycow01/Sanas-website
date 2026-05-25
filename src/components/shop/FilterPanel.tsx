"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PRICE_MAX, PRICE_MIN, SIZES, parseFilters } from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

type Props = {
  /** When true, omit the heading + outer padding (drawer wraps these itself). */
  inline?: boolean;
};

export function FilterPanel({ inline = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const filters = useMemo(
    () => parseFilters(Object.fromEntries(search.entries())),
    [search],
  );

  const [localPriceMax, setLocalPriceMax] = useState<number | null>(null);
  const priceMaxDisplay = localPriceMax ?? filters.priceMax;

  const updateUrl = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(search.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, search],
  );

  const toggleInList = useCallback(
    (key: "size", value: string) => {
      const current = (search.get(key) ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateUrl({ [key]: next.length ? next.join(",") : null });
    },
    [search, updateUrl],
  );

  const commitPriceMax = useCallback(
    (max: number) => {
      setLocalPriceMax(null);
      updateUrl({ priceMax: max === PRICE_MAX ? null : String(max) });
    },
    [updateUrl],
  );

  return (
    <div className={cn(inline ? "" : "max-w-[260px] py-2")}>
      {inline ? null : (
        <h2 className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text">
          Filter
        </h2>
      )}

      <FilterGroup label="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const active = filters.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => toggleInList("size", s)}
                className={cn(
                  "h-9 min-w-[44px] rounded-full border px-3 text-[12px] font-medium tracking-[0.18em] transition-all duration-300",
                  active
                    ? "border-bayan-primary-dark bg-bayan-primary-dark text-bayan-bg"
                    : "border-bayan-line bg-transparent text-bayan-text hover:border-bayan-primary-dark/60",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Price">
        <div className="mb-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.18em] text-bayan-muted">
          <span>Up to</span>
          <span className="font-medium text-bayan-text">
            PKR {priceMaxDisplay.toLocaleString("en-PK")}
          </span>
        </div>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={priceMaxDisplay}
          onChange={(e) => setLocalPriceMax(Number(e.target.value))}
          onPointerUp={(e) =>
            commitPriceMax(Number((e.target as HTMLInputElement).value))
          }
          onKeyUp={(e) =>
            commitPriceMax(Number((e.target as HTMLInputElement).value))
          }
          className="w-full accent-bayan-primary-dark"
          aria-label="Maximum price"
        />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group border-b border-bayan-line py-5 last:border-b-0">
      <summary className="flex cursor-pointer items-center justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown
          className="h-4 w-4 text-bayan-muted transition-transform duration-300 group-open:rotate-180"
          strokeWidth={1.4}
        />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

type ResetProps = { className?: string; children?: React.ReactNode };

export function ClearFiltersLink({ className, children = "Clear filters" }: ResetProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { scroll: false })}
      className={cn(
        "text-[11px] uppercase tracking-[0.28em] text-bayan-muted underline-offset-4 transition-colors hover:text-bayan-text hover:underline",
        className,
      )}
    >
      {children}
    </button>
  );
}
