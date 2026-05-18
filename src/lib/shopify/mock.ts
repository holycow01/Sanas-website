/**
 * Temporary mock layer — returns the same data shape the real Shopify
 * Storefront API will return. When real credentials arrive, this file is
 * deleted and `index.ts` swaps `from "./mock"` for a real GraphQL fetcher.
 *
 * Placeholder images come from `placehold.co` rendered in Bayan brand colors
 * so the visual feel is on-brand during development. They'll be replaced with
 * real product photography (delivered via the Shopify CDN) when assets arrive.
 */

import type {
  Collection,
  Image,
  Product,
  ProductOption,
  ProductVariant,
} from "./types";

const TODAY = new Date("2026-05-17").getTime();
const daysAgo = (n: number) => new Date(TODAY - n * 86_400_000).toISOString();

const PKR = (amount: number) =>
  ({ amount: String(amount), currencyCode: "PKR" as const });

function ph(handle: string, label: string, bg: string, fg: string): Image {
  const search = new URLSearchParams({ text: label, font: "cormorant" });
  return {
    url: `https://placehold.co/800x1000/${bg}/${fg}.png?${search.toString()}`,
    altText: `${label} — Bayan ethnic wear`,
    width: 800,
    height: 1000,
  };
}

const SIZE_OPTION: ProductOption = {
  id: "gid://shopify/ProductOption/size",
  name: "Size",
  values: ["S", "M", "L"],
};

function makeVariants(
  numericId: number,
  sizes: string[],
  price: number,
  compareAtPrice: number | null,
): ProductVariant[] {
  return sizes.map((size, i) => ({
    id: `gid://shopify/ProductVariant/${numericId}-${size}`,
    title: size,
    availableForSale: true,
    quantityAvailable: 8 + i,
    selectedOptions: [{ name: "Size", value: size }],
    price: PKR(price),
    compareAtPrice: compareAtPrice ? PKR(compareAtPrice) : null,
  }));
}

type ProductInput = {
  numericId: number;
  handle: string;
  title: string;
  description: string;
  productType: "pret" | "formals" | "festive";
  price: number;
  compareAtPrice?: number;
  badges?: string[];
  sizes?: string[];
  bg: string;
  fg: string;
  createdDaysAgo: number;
};

function makeProduct(input: ProductInput): Product {
  const sizes = input.sizes ?? ["S", "M", "L"];
  const variants = makeVariants(
    input.numericId,
    sizes,
    input.price,
    input.compareAtPrice ?? null,
  );

  const images = [
    ph(input.handle, input.title, input.bg, input.fg),
    ph(input.handle, input.title, input.fg, input.bg),
    ph(input.handle, input.title, SAGE, LIGHT),
    ph(input.handle, input.title, GOLD, DARK),
  ];

  return {
    id: `gid://shopify/Product/${input.numericId}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    availableForSale: true,
    vendor: "Bayan",
    productType: input.productType,
    tags: [...(input.badges ?? []), input.productType],
    options: [SIZE_OPTION],
    priceRange: {
      minVariantPrice: PKR(input.price),
      maxVariantPrice: PKR(input.price),
    },
    compareAtPriceRange: {
      minVariantPrice: PKR(input.compareAtPrice ?? input.price),
      maxVariantPrice: PKR(input.compareAtPrice ?? input.price),
    },
    variants,
    featuredImage: images[0],
    images,
    seo: {
      title: `${input.title} — Bayan Ethnic Wear`,
      description: input.description,
    },
    createdAt: daysAgo(input.createdDaysAgo),
    updatedAt: daysAgo(input.createdDaysAgo),
  };
}

const CREAM = "f1ead8";
const GOLD = "c1a572";
const SAGE = "6f8161";
const DEEP = "1f2419";
const DARK = "2a2e25";
const LIGHT = "faf6ec";

const productInputs: ProductInput[] = [
  {
    numericId: 1001,
    handle: "mehrunnisa",
    title: "Mehrunnisa",
    description:
      "A three-piece embroidered lawn — a love letter to the warmer months. Hand-finished thread work on a feather-soft cotton.",
    productType: "pret",
    price: 8400,
    bg: CREAM,
    fg: DARK,
    createdDaysAgo: 4,
    badges: ["new"],
  },
  {
    numericId: 1002,
    handle: "saba",
    title: "Saba",
    description:
      "A two-piece cotton net edged in soft chikankari. Light enough for afternoons, refined enough for evenings.",
    productType: "formals",
    price: 9900,
    compareAtPrice: 12500,
    bg: GOLD,
    fg: DARK,
    createdDaysAgo: 28,
    badges: ["sale"],
  },
  {
    numericId: 1003,
    handle: "noor",
    title: "Noor",
    description:
      "Festive raw silk in deep olive, threaded with antique gold zardozi at the neckline and hem.",
    productType: "festive",
    price: 16800,
    bg: DEEP,
    fg: GOLD,
    createdDaysAgo: 6,
    badges: ["new"],
  },
  {
    numericId: 1004,
    handle: "anaya",
    title: "Anaya",
    description:
      "A formal sage organza with delicate tilla floral motifs — a quiet alternative to heavier festive pieces.",
    productType: "formals",
    price: 11500,
    bg: SAGE,
    fg: LIGHT,
    createdDaysAgo: 11,
    badges: ["new"],
  },
  {
    numericId: 1005,
    handle: "inara",
    title: "Inara",
    description:
      "Everyday lawn in a soft ivory, finished with hand-rolled hems and a slim slip lining.",
    productType: "pret",
    price: 5200,
    bg: CREAM,
    fg: DARK,
    createdDaysAgo: 45,
  },
  {
    numericId: 1006,
    handle: "zaina",
    title: "Zaina",
    description:
      "A limited-run festive piece — champagne crepe with mirror-work cuffs and a hand-bound dupatta.",
    productType: "festive",
    price: 14900,
    bg: GOLD,
    fg: DARK,
    createdDaysAgo: 18,
    badges: ["limited"],
  },
  {
    numericId: 1007,
    handle: "aiman",
    title: "Aiman",
    description:
      "A pret kurta in soft mocha with tonal embroidery at the placket. Pairs with anything in the wardrobe.",
    productType: "pret",
    price: 4800,
    compareAtPrice: 6500,
    bg: CREAM,
    fg: DARK,
    createdDaysAgo: 60,
    badges: ["sale"],
  },
  {
    numericId: 1008,
    handle: "mahira",
    title: "Mahira",
    description:
      "A two-piece sage chiffon with scalloped sleeves — a formal that travels well and creases like silk does, gently.",
    productType: "formals",
    price: 13200,
    bg: SAGE,
    fg: LIGHT,
    createdDaysAgo: 35,
  },
  {
    numericId: 1009,
    handle: "hira",
    title: "Hira",
    description:
      "Heritage festive — pure tussar with traditional gota patti border, hand-stitched in our atelier over three weeks.",
    productType: "festive",
    price: 17500,
    bg: DEEP,
    fg: GOLD,
    createdDaysAgo: 2,
    badges: ["new", "limited"],
  },
  {
    numericId: 1010,
    handle: "rida",
    title: "Rida",
    description:
      "An everyday kurta in dusty rose lawn with a single embroidered medallion at the chest.",
    productType: "pret",
    price: 6900,
    bg: GOLD,
    fg: DARK,
    createdDaysAgo: 9,
    badges: ["new"],
  },
  {
    numericId: 1011,
    handle: "sana",
    title: "Sana",
    description:
      "A two-piece lawn with hand-block printed dupatta in a softened sage botanical motif.",
    productType: "pret",
    price: 7400,
    bg: CREAM,
    fg: DARK,
    createdDaysAgo: 22,
  },
  {
    numericId: 1012,
    handle: "ayesha",
    title: "Ayesha",
    description:
      "A formal khaddi-net with hand-stitched pearl detail along the bodice — a quieter take on the bridal palette.",
    productType: "formals",
    price: 10800,
    bg: SAGE,
    fg: LIGHT,
    createdDaysAgo: 50,
  },
];

export const products: Product[] = productInputs.map(makeProduct);

export const collections: Collection[] = [
  {
    id: "gid://shopify/Collection/eid-26",
    handle: "eid-26",
    title: "Eid '26",
    description:
      "The Spring/Summer Eid edit — festive heritage pieces with antique gold work, alongside a few quietly luxurious formals.",
    descriptionHtml:
      "<p>The Spring/Summer Eid edit — festive heritage pieces with antique gold work, alongside a few quietly luxurious formals.</p>",
    image: ph("eid-26", "Eid '26", DEEP, GOLD),
    seo: {
      title: "Eid Collection '26 — Bayan",
      description: "The Spring/Summer Eid edit from Bayan.",
    },
    updatedAt: daysAgo(2),
    path: "/collections/eid-26",
  },
  {
    id: "gid://shopify/Collection/pret",
    handle: "pret",
    title: "Pret",
    description: "Wear-anywhere pieces — lawn, cotton, soft silhouettes.",
    descriptionHtml:
      "<p>Wear-anywhere pieces — lawn, cotton, soft silhouettes.</p>",
    image: ph("pret", "Pret", CREAM, DARK),
    seo: {
      title: "Pret — Bayan",
      description: "Everyday Pakistani ethnic wear from Bayan.",
    },
    updatedAt: daysAgo(4),
    path: "/collections/pret",
  },
  {
    id: "gid://shopify/Collection/formals",
    handle: "formals",
    title: "Formals",
    description:
      "Quietly elegant two-pieces and three-pieces for the weekday-to-evening wardrobe.",
    descriptionHtml:
      "<p>Quietly elegant two-pieces and three-pieces for the weekday-to-evening wardrobe.</p>",
    image: ph("formals", "Formals", SAGE, LIGHT),
    seo: {
      title: "Formals — Bayan",
      description: "Formal Pakistani ethnic wear from Bayan.",
    },
    updatedAt: daysAgo(11),
    path: "/collections/formals",
  },
  {
    id: "gid://shopify/Collection/festive",
    handle: "festive",
    title: "Festive",
    description:
      "Heritage pieces with hand-stitched embellishment — for the days that ask for it.",
    descriptionHtml:
      "<p>Heritage pieces with hand-stitched embellishment — for the days that ask for it.</p>",
    image: ph("festive", "Festive", GOLD, DARK),
    seo: {
      title: "Festive — Bayan",
      description: "Festive Pakistani ethnic wear from Bayan.",
    },
    updatedAt: daysAgo(6),
    path: "/collections/festive",
  },
];

/**
 * Which product handles belong to which collection.
 *
 * Shopify exposes this via the `Product.collections` GraphQL connection;
 * we keep it as a flat lookup in the mock so the public types stay clean.
 */
export const collectionMembership: Record<string, string[]> = {
  "eid-26": ["noor", "hira", "zaina", "mahira", "anaya"],
  pret: ["mehrunnisa", "inara", "aiman", "rida", "sana"],
  formals: ["saba", "anaya", "mahira", "ayesha"],
  festive: ["noor", "zaina", "hira"],
};
