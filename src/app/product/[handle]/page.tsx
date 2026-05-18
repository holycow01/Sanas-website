import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, getRelatedProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { MobileStickyCTA } from "@/components/product/MobileStickyCTA";
import { SectionHead } from "@/components/section-head";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) {
    return { title: "Not found — Bayan" };
  }
  const description = product.seo.description ?? product.description;
  return {
    title: product.seo.title ?? `${product.title} — Bayan`,
    description,
    openGraph: {
      title: product.title,
      description,
      type: "website",
      images: [{ url: product.featuredImage.url, alt: product.title }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id);

  return (
    <>
      <section className="px-6 pb-16 pt-10 md:px-9 md:pt-14">
        <nav className="mx-auto mb-10 max-w-[1400px] text-[11px] uppercase tracking-[0.22em] text-bayan-muted">
          <Link href="/" className="hover:text-bayan-text">
            Home
          </Link>
          <span className="mx-2 text-bayan-line">/</span>
          <Link href="/shop" className="hover:text-bayan-text">
            Shop
          </Link>
          <span className="mx-2 text-bayan-line">/</span>
          <span className="text-bayan-text">{product.title}</span>
        </nav>

        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <ProductGallery
            images={
              product.images.length > 0 ? product.images : [product.featuredImage]
            }
            title={product.title}
          />
          <div>
            <ProductInfo product={product} />
            <ProductTabs product={product} />
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-bayan-bg-alt px-6 pb-28 pt-20 md:px-9 md:pt-24">
          <SectionHead
            eyebrow="More from the atelier"
            titleStart="You may also"
            titleEm="love"
          />
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <MobileStickyCTA product={product} />
    </>
  );
}
