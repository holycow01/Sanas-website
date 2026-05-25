import Link from "next/link";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Size Guide", href: "/size-guide" },
      { label: "Shipping", href: "/faq#shipping" },
      { label: "Returns", href: "/faq#returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/account/orders" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Stockists", href: "/contact#stockists" },
      { label: "Contact", href: "/contact" },
      { label: "Press", href: "/about#press" },
      { label: "Careers", href: "/about#careers" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "https://instagram.com/bayan_ethnicwear" },
      { label: "TikTok", href: "https://tiktok.com/@bayan_ethnicwear" },
      { label: "WhatsApp", href: "https://wa.me/923000000000" },
      { label: "Email Us", href: "mailto:hello@bayan.pk" },
    ],
  },
];

const PAY = ["VISA", "MASTER", "JAZZCASH", "EASYPAISA", "COD 50%"];

export function Footer() {
  return (
    <footer className="bg-bayan-bg-dark px-9 pb-6 pt-20 text-bayan-bg max-[480px]:px-6">
      <div className="mx-auto mb-[60px] grid max-w-[1400px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 max-[880px]:grid-cols-2 max-[880px]:gap-8 max-[480px]:grid-cols-1">
        <div className="max-[880px]:col-span-2 max-[480px]:col-span-1">
          <div className="font-serif text-[32px] font-semibold leading-none tracking-[0.14em]">
            BAYAN
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-[0.42em] text-bayan-accent">
            Ethnic Wear
          </div>
          <p className="mt-[22px] max-w-[320px] text-sm leading-[1.8] text-bayan-bg/55">
            Premium Pakistani ethnic wear. Designed in-house, hand-finished by
            artisans, delivered with intention.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-[22px] text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-accent">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-bayan-bg/70 transition-colors duration-300 hover:text-bayan-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-[18px] border-t border-bayan-bg/10 pt-7 text-[11px] uppercase tracking-[0.16em] text-bayan-bg/45 max-[480px]:justify-center max-[480px]:text-center">
        <div>© {new Date().getFullYear()} Bayan Ethnic Wear · All rights reserved</div>
        <div className="flex flex-wrap items-center gap-3.5">
          {PAY.map((p) => (
            <span
              key={p}
              className="rounded border border-bayan-bg/15 px-3 py-1.5 text-[10px] tracking-[0.18em]"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
