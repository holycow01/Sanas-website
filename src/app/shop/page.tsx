import type { Metadata } from "next";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product-card";
import { ClearFiltersLink, FilterPanel } from "@/components/shop/FilterPanel";
import { SortSelect } from "@/components/shop/SortSelect";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import {
  applyClientFilters,
  isDefault,
  parseFilters,
  sortToShopify,
} from "@/lib/shop-filters";

export const metadata: Metadata = {
  title: "Shop — Bayan",
  description:
    "Browse the full Bayan collection — pret, formals and festive ethnic wear, hand-finished in Pakistan.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const { sortKey, reverse } = sortToShopify(filters.sort);

  const sorted = await getProducts({ sortKey, reverse });
  const products = applyClientFilters(sorted, filters);
  const total = products.length;

  return (
    <section className="px-6 pb-24 pt-12 md:px-9">
      <header className="mx-auto mb-10 max-w-[1400px]">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
          The Collection
        </div>
        <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.05] text-bayan-text">
          Shop
        </h1>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-[240px_1fr] md:gap-16">
        <aside className="hidden md:block">
          <FilterPanel />
        </aside>

        <div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MobileFilterDrawer resultCount={total} />
              <p className="text-[11px] uppercase tracking-[0.22em] text-bayan-muted">
                {total} {total === 1 ? "piece" : "pieces"}
              </p>
            </div>
            <SortSelect />
          </div>

          {total === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 xl:gap-7">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {!isDefault(filters) && total > 0 ? (
            <div className="mt-12 flex justify-center">
              <ClearFiltersLink />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 px-6 py-24 text-center">
      <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-accent-deep">
        Empty rail
      </div>
      <h2 className="font-serif text-3xl text-bayan-text">
        Nothing matches your filters.
      </h2>
      <p className="max-w-[420px] text-sm text-bayan-muted">
        Try widening the price, removing a size, or browsing all categories.
      </p>
      <ClearFiltersLink className="mt-2" />
    </div>
  );
}
