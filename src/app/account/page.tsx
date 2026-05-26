import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAccount } from "@/lib/shopify/customer-account";
import { formatPrice } from "@/lib/format";
import { formatOrderDate } from "@/lib/account-format";

export const metadata: Metadata = {
  title: "My Account — Bayan",
  robots: { index: false, follow: false },
};

async function originFromHeaders(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export default async function AccountPage() {
  const origin = await originFromHeaders();
  const customer = await getCustomerAccount(origin);
  if (!customer) redirect("/account/login");

  const name = customer.firstName ?? "there";

  return (
    <section className="px-6 pb-24 pt-12 md:px-9 md:pt-16">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
              My Account
            </div>
            <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-normal leading-[1.05] text-bayan-text">
              Hello, {name}.
            </h1>
            {customer.email ? (
              <p className="mt-2 text-sm text-bayan-muted">{customer.email}</p>
            ) : null}
          </div>
          <a
            href="/api/auth/logout"
            className="rounded-full border border-bayan-text px-6 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text transition-all duration-300 hover:bg-bayan-text hover:text-bayan-bg"
          >
            Sign Out
          </a>
        </header>

        <h2 className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-text">
          Order History
        </h2>

        {customer.orders.length === 0 ? (
          <div className="rounded-lg border border-bayan-line bg-bayan-bg-alt/40 p-10 text-center">
            <p className="font-serif text-2xl text-bayan-text">No orders yet.</p>
            <p className="mt-2 text-sm text-bayan-muted">
              When you place an order, it&rsquo;ll appear here.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center rounded-full bg-bayan-primary-dark px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-colors hover:bg-bayan-text"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-bayan-line border-y border-bayan-line">
            {customer.orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 py-5"
              >
                <div>
                  <div className="font-serif text-lg text-bayan-text">
                    Order {order.name}
                  </div>
                  <div className="mt-0.5 text-[12px] text-bayan-muted">
                    {formatOrderDate(order.processedAt)}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {order.total ? (
                    <span className="text-sm font-medium text-bayan-text">
                      {formatPrice(order.total.amount, order.total.currencyCode)}
                    </span>
                  ) : null}
                  <Link
                    href={`/account/orders/${order.numericId}`}
                    className="border-b border-bayan-accent pb-0.5 text-[11px] uppercase tracking-[0.22em] text-bayan-text transition-colors hover:border-bayan-primary-dark hover:text-bayan-primary-dark"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
