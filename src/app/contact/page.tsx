import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export const metadata: Metadata = {
  title: "Contact — Bayan",
  description:
    "Reach the Bayan atelier on WhatsApp, Instagram or email — we usually reply within a business day.",
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923000000000";
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "bayan_ethnicwear";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@bayan.pk";

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Bayan — I have a question.")}`;

  return (
    <section className="px-6 pb-24 pt-12 md:px-9 md:pt-16">
      <div className="mx-auto max-w-[1000px]">
        <Reveal>
          <header className="mb-14 text-center">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
              We&rsquo;re here
            </div>
            <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.05] text-bayan-text">
              Get in touch
            </h1>
            <p className="mx-auto mt-4 max-w-[460px] text-bayan-muted">
              Questions about sizing, fabric, or an order? Reach us however is
              easiest — we usually reply within a business day.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <ContactCard
                href={whatsappHref}
                external
                icon={<WhatsAppIcon className="h-5 w-5 text-[#25D366]" />}
                label="WhatsApp"
                value="Fastest way to reach us"
              />
              <ContactCard
                href={`https://instagram.com/${instagram}`}
                external
                icon={<InstagramIcon className="h-5 w-5" />}
                label="Instagram"
                value={`@${instagram}`}
              />
              <ContactCard
                href={`mailto:${email}`}
                icon={<Mail className="h-5 w-5" strokeWidth={1.4} />}
                label="Email"
                value={email}
              />

              <div className="mt-2 rounded-lg border border-bayan-line bg-bayan-bg-alt/40 p-6">
                <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-accent-deep">
                  Stockists
                </div>
                <p className="mt-2 text-sm leading-relaxed text-bayan-muted">
                  Bayan is currently online-only, shipping across Pakistan.
                  Stockist partnerships will be announced here and on Instagram.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  href,
  external,
  icon,
  label,
  value,
}: {
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-4 rounded-lg border border-bayan-line bg-bayan-bg p-5 transition-colors duration-300 hover:border-bayan-primary-dark/50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bayan-bg-alt text-bayan-text">
        {icon}
      </span>
      <span>
        <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-muted">
          {label}
        </span>
        <span className="block text-bayan-text transition-colors group-hover:text-bayan-primary-dark">
          {value}
        </span>
      </span>
    </a>
  );
}
