import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "FAQ — Bayan",
  description:
    "Sizing, fabric, payment (50% advance / 50% on delivery), delivery times, care and more.",
};

export default function FaqPage() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-9 md:pt-16">
      <div className="mx-auto max-w-[760px]">
        <Reveal>
          <header className="mb-12 text-center">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
              Good to know
            </div>
            <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.05] text-bayan-text">
              Frequently Asked Questions
            </h1>
          </header>
        </Reveal>
        <Reveal delay={0.1}>
          <FaqAccordion />
        </Reveal>
      </div>
    </section>
  );
}
