/**
 * Types mirroring the Shopify Storefront API GraphQL shape.
 *
 * Connections (`{ edges: [{ node }] }`) are flattened to plain arrays at the
 * fetcher boundary — this matches the vercel/commerce convention so consuming
 * code reads cleanly. When the real client lands in a later prompt, the GraphQL
 * → array reshape happens in `index.ts` and these types stay unchanged.
 */

export type Currency = "PKR" | "USD" | "GBP" | "EUR" | (string & {});

export type Money = {
  amount: string;
  currencyCode: Currency;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SEO = {
  title: string | null;
  description: string | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  vendor: string;
  productType: string;
  tags: string[];
  options: ProductOption[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  seo: SEO;
  updatedAt: string;
  /** Convenience field added by the fetcher: `/collections/{handle}`. */
  path: string;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image;
    };
  };
};

export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};

export type ProductSortKey =
  | "CREATED_AT"
  | "PRICE"
  | "TITLE"
  | "BEST_SELLING"
  | "RELEVANCE";
