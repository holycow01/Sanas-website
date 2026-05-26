import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCustomerAccount } from "@/lib/shopify/customer-account";
import { formatPrice } from "@/lib/format";
import { formatOrderDate } from "@/lib/account-format";

export const metadata: Metadata = {
  title: "Order — Bayan",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

async function originFromHeaders(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const origin = await originFromHeaders();
  const customer = await getCustomerAccount(origin);
  if (!customer) redirect("/account/login");

  const order = customer.orders.find(
    (o) => o.numericId === id || o.name === id || o.name === `#${id}`,
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
        </header>

        <ul className="divide-y divide-bayan-line border-y border-bayan-line">
          {order.lineItems.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-4">
              <div className="font-serif text-base text-bayan-text">
                {item.title}
              </div>
              <div className="text-[12px] uppercase tracking-[0.18em] text-bayan-muted">
                Qty {item.quantity}
              </div>
            </li>
          ))}
        </ul>

        {order.total ? (
          <div className="mt-6 flex items-center justify-between border-t border-bayan-line pt-6">
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text">
              Total
            </span>
            <span className="font-serif text-2xl text-bayan-text">
              {formatPrice(order.total.amount, order.total.currencyCode)}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
