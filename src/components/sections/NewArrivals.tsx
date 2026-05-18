import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

export async function NewArrivals() {
  const products = await getProducts({
    first: 4,
    sortKey: "CREATED_AT",
  });

  return (
    <section id="shop" className="bg-bayan-bg px-6 py-[120px] md:px-9">
      <SectionHead
        eyebrow="The Latest Drop"
        titleStart="New"
        titleEm="Arrivals"
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center">
        <Link
          href="/shop"
          className="border-b border-bayan-accent pb-1 text-xs uppercase tracking-[0.28em] text-bayan-text transition-all duration-300 hover:border-bayan-primary-dark hover:text-bayan-primary-dark"
        >
          View All Products →
        </Link>
      </Reveal>
    </section>
  );
}
