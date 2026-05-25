import type { Product, ProductSortKey } from "./shopify/types";

export const SIZES = ["S", "M", "L"] as const;
export type Size = (typeof SIZES)[number];

export const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price · Low to High" },
  { value: "price-desc", label: "Price · High to Low" },
] as const;
export type Sort = (typeof SORTS)[number]["value"];

export const PRICE_MIN = 0;
export const PRICE_MAX = 20000;

export type ParsedFilters = {
  sizes: Size[];
  priceMax: number;
  sort: Sort;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr.flatMap((v) => v.split(",").map((s) => s.trim()).filter(Boolean));
}

export function parseFilters(searchParams: RawSearchParams): ParsedFilters {
  const sizes = asList(searchParams.size).filter((s): s is Size =>
    (SIZES as readonly string[]).includes(s),
  );
  const rawMax = Number(searchParams.priceMax);
  const priceMax =
    Number.isFinite(rawMax) && rawMax >= PRICE_MIN && rawMax <= PRICE_MAX
      ? rawMax
      : PRICE_MAX;
  const sortRaw = Array.isArray(searchParams.sort)
    ? searchParams.sort[0]
    : searchParams.sort;
  const sort: Sort = (SORTS as readonly { value: string }[]).some(
    (s) => s.value === sortRaw,
  )
    ? (sortRaw as Sort)
    : "newest";
  return { sizes, priceMax, sort };
}

export function sortToShopify(sort: Sort): {
  sortKey: ProductSortKey;
  reverse: boolean;
} {
  if (sort === "price-asc") return { sortKey: "PRICE", reverse: false };
  if (sort === "price-desc") return { sortKey: "PRICE", reverse: true };
  return { sortKey: "CREATED_AT", reverse: false };
}

export function applyClientFilters(
  products: Product[],
  filters: Pick<ParsedFilters, "sizes" | "priceMax">,
): Product[] {
  return products.filter((p) => {
    if (filters.sizes.length) {
      const productSizes = p.variants
        .map((v) => v.selectedOptions.find((o) => o.name === "Size")?.value)
        .filter((s): s is string => !!s);
      if (!filters.sizes.some((s) => productSizes.includes(s))) {
        return false;
      }
    }
    if (Number(p.priceRange.minVariantPrice.amount) > filters.priceMax) {
      return false;
    }
    return true;
  });
}

export function isDefault(filters: ParsedFilters): boolean {
  return (
    filters.sizes.length === 0 &&
    filters.priceMax === PRICE_MAX &&
    filters.sort === "newest"
  );
}
