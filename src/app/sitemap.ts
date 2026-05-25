import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600; // refresh hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/size-guide",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/shop" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ first: 250 });
    productRoutes = products.map((p) => ({
      url: `${base}/product/${p.handle}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // If Shopify is unreachable at build time, still emit the static routes.
  }

  return [...staticRoutes, ...productRoutes];
}
