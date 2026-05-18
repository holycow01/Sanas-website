import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { formatPrice } from "@/lib/format";

type PageProps = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ total?: string; items?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order #${orderId} confirmed — Bayan`,
    description:
      "Your Bayan order is confirmed. Send your 50% advance to complete it.",
    robots: { index: false, follow: false },
  };
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: PageProps) {
  const { orderId } = await params;
  const sp = await searchParams;
  const totalNum = sp.total ? Number(sp.total) : NaN;
  const total = Number.isFinite(totalNum) ? totalNum : null;
  const advance = total !== null ? Math.round(total / 2) : null;
  const balance = advance;

  const bank = {
    name: process.env.BANK_NAME?.trim() || null,
    accountTitle: process.env.BANK_ACCOUNT_TITLE?.trim() || null,
    accountNumber: process.env.BANK_ACCOUNT_NUMBER?.trim() || null,
    iban: process.env.BANK_IBAN?.trim() || null,
  };
  const bankReady = bank.name && bank.accountNumber;

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923000000000";
  const whatsappMsg = encodeURIComponent(
    `Hi — here is my deposit screenshot for order #${orderId}.`,
  );
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <section className="px-6 pb-24 pt-12 md:px-9 md:pt-16">
      <article className="mx-auto max-w-[680px]">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bayan-primary-dark px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-bayan-bg">
              <Check className="h-3 w-3" strokeWidth={2.4} />
              Order Confirmed
            </span>
            <h1 className="mt-7 font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.05] text-bayan-text">
              Thank you.
            </h1>
            <p className="mt-3 text-bayan-muted">
              Order{" "}
              <span className="font-medium text-bayan-text">#{orderId}</span>
              {total !== null ? (
                <> &middot; {formatPrice(total)} total</>
              ) : null}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 rounded-lg border border-bayan-line bg-bayan-bg-alt p-7 md:p-9">
            <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-accent-deep">
              Step 1 &middot; Pay your advance
            </div>
            <h2 className="mt-3 font-serif text-[clamp(26px,3.2vw,32px)] font-normal leading-[1.2] text-bayan-text">
              {advance !== null ? (
                <>
                  Send{" "}
                  <em className="font-serif italic text-bayan-primary-dark">
                    {formatPrice(advance)}
                  </em>{" "}
                  to confirm your order
                </>
              ) : (
                <>Send 50% advance to confirm your order</>
              )}
            </h2>
            <p className="mt-3 text-bayan-muted">
              Transfer to the account below, then send the screenshot via
              WhatsApp. We verify within 4 hours during business hours.
            </p>

            {bankReady ? (
              <dl className="mt-7 divide-y divide-bayan-line/70 border-y border-bayan-line/70">
                <BankRow label="Bank" value={bank.name!} />
                {bank.accountTitle ? (
                  <BankRow label="Account Title" value={bank.accountTitle} />
                ) : null}
                <BankRow label="Account Number" value={bank.accountNumber!} mono />
                {bank.iban ? <BankRow label="IBAN" value={bank.iban} mono /> : null}
              </dl>
            ) : (
              <div className="mt-7 rounded border border-dashed border-bayan-line/70 bg-bayan-bg p-5 text-sm text-bayan-muted">
                Bank details aren&rsquo;t configured yet. Reach out on WhatsApp
                and we&rsquo;ll send them across.
              </div>
            )}

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1eb957] hover:shadow-[0_14px_40px_-10px_rgba(37,211,102,0.5)]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Send Screenshot via WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <section className="mt-16">
            <h2 className="text-center font-serif text-[clamp(24px,3vw,30px)] font-normal text-bayan-text">
              What happens next
            </h2>
            <ol className="mt-9 grid gap-5 md:grid-cols-3 md:gap-6">
              <NextStep
                n={1}
                title="We verify your deposit"
                body="Usually within 4 hours during business hours."
              />
              <NextStep
                n={2}
                title="We ship within 2 days"
                body="Crafted, packed, and dispatched from our Karachi atelier."
              />
              <NextStep
                n={3}
                title="Pay the balance on delivery"
                body={
                  balance !== null
                    ? `${formatPrice(balance)} collected in cash when your order arrives.`
                    : "The remaining 50% collected in cash when your order arrives."
                }
              />
            </ol>
          </section>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-16 text-center text-sm text-bayan-muted">
            Questions about your order?{" "}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bayan-primary-dark hover:underline"
            >
              WhatsApp us
            </a>{" "}
            or email{" "}
            <a
              href="mailto:hello@bayan.pk"
              className="text-bayan-primary-dark hover:underline"
            >
              hello@bayan.pk
            </a>
            .
          </p>
        </Reveal>
      </article>
    </section>
  );
}

function BankRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <dt className="text-[11px] uppercase tracking-[0.22em] text-bayan-muted">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "font-mono text-[14px] tracking-tight text-bayan-text"
            : "text-sm font-medium text-bayan-text"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function NextStep({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded border border-bayan-line bg-bayan-bg p-5">
      <div className="font-serif text-2xl italic text-bayan-accent-deep">
        {String(n).padStart(2, "0")}
      </div>
      <div className="mt-3 font-serif text-lg text-bayan-text">{title}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-bayan-muted">{body}</p>
    </li>
  );
}
