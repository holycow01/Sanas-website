import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCustomer } from "@/lib/shopify/customer";
import { formatPrice } from "@/lib/format";
import { humanizeStatus, formatOrderDate } from "@/lib/account-format";

export const metadata: Metadata = {
  title: "Order — Bayan",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await getCustomer();
  if (!customer) redirect("/account/login");

  const order = customer.orders.find(
    (o) => String(o.orderNumber) === id || o.name === id || o.name === `#${id}`,
  );
  if (!order) notFound();

  return (
    <section className="px-6 pb-24 pt-12 md:px-9 md:pt-16">
      <div className="mx-auto max-w-[760px]">
        <nav className="mb-8 text-[11px] uppercase tracking-[0.22em] text-bayan-muted">
          <Link href="/account" className="hover:text-bayan-text">
            My Account
          </Link>
          <span className="mx-2 text-bayan-line">/</span>
          <span className="text-bayan-text">Order {order.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-serif text-[clamp(30px,4vw,44px)] font-normal leading-[1.1] text-bayan-text">
            Order {order.name}
          </h1>
          <p className="mt-2 text-sm text-bayan-muted">
            Placed {formatOrderDate(order.processedAt)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge label={`Payment · ${humanizeStatus(order.financialStatus)}`} />
            <Badge
              label={`Fulfilment · ${humanizeStatus(order.fulfillmentStatus)}`}
            />
          </div>
        </header>

        <ul className="divide-y divide-bayan-line border-y border-bayan-line">
          {order.lineItems.map((item, i) => (
            <li key={i} className="flex items-center gap-4 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-bayan-bg-alt">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText ?? item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1">
                <div className="font-serif text-base text-bayan-text">
                  {item.title}
                </div>
                {item.variantTitle && item.variantTitle !== "Default Title" ? (
                  <div className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-bayan-muted">
                    {item.variantTitle}
                  </div>
                ) : null}
                <div className="mt-0.5 text-[12px] text-bayan-muted">
                  Qty {item.quantity}
                </div>
              </div>
              {item.price ? (
                <div className="text-sm font-medium text-bayan-text">
                  {formatPrice(item.price.amount, item.price.currencyCode)}
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-bayan-line pt-6">
          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text">
            Total
          </span>
          <span className="font-serif text-2xl text-bayan-text">
            {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
          </span>
        </div>
      </div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-bayan-line px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-bayan-muted">
      {label}
    </span>
  );
}
