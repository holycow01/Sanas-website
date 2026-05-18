import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

type Card = {
  handle: string;
  small: string;
  big: string;
  background: string;
  art: React.ReactNode;
};

const CARDS: Card[] = [
  {
    handle: "pret",
    small: "For everyday",
    big: "Pret",
    background:
      "linear-gradient(135deg, #6f8161 0%, #4d5b41 100%)",
    art: (
      <svg viewBox="0 0 100 140" fill="none" stroke="rgba(250,246,236,0.85)">
        <path
          d="M30 130 L30 50 Q30 30 50 30 Q70 30 70 50 L70 130 M40 30 Q50 15 60 30"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    handle: "formals",
    small: "For the occasion",
    big: "Formals",
    background:
      "linear-gradient(135deg, #2a2e25 0%, #4d5b41 100%)",
    art: (
      <svg viewBox="0 0 100 140" fill="none" stroke="rgba(250,246,236,0.85)">
        <path
          d="M25 130 L25 60 Q25 35 50 35 Q75 35 75 60 L75 130 M35 35 Q50 10 65 35 M50 60 L50 130"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    handle: "festive",
    small: "For celebration",
    big: "Festive",
    background:
      "linear-gradient(135deg, #9d8453 0%, #c1a572 100%)",
    art: (
      <svg viewBox="0 0 100 140" fill="none" stroke="rgba(250,246,236,0.85)">
        <path
          d="M20 130 L20 80 Q20 30 50 30 Q80 30 80 80 L80 130 M30 30 Q50 5 70 30"
          strokeWidth="1.5"
        />
        <path
          d="M50 30 L50 130 M35 70 Q50 60 65 70 M30 100 Q50 90 70 100"
          strokeWidth="1"
        />
      </svg>
    ),
  },
];

export function Categories() {
  return (
    <section id="categories" className="bg-bayan-bg-alt px-6 py-[120px] md:px-9">
      <SectionHead
        eyebrow="Curated Collections"
        titleStart="Shop by"
        titleEm="Category"
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 md:grid-cols-3">
        {CARDS.map((card, i) => (
          <Reveal key={card.handle} delay={i * 0.1}>
            <Link
              href={`/collections/${card.handle}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-md bg-bayan-bg-dark"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]"
                style={{ background: card.background }}
              />
              <div className="pointer-events-none absolute inset-0 opacity-35">
                <div className="flex h-full w-full items-center justify-center [&_svg]:h-auto [&_svg]:w-1/2 [&_svg]:max-w-[240px]">
                  {card.art}
                </div>
              </div>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <span className="absolute right-6 top-6 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-bayan-bg/[0.18] text-bayan-bg backdrop-blur-md transition-all duration-300 group-hover:bg-bayan-bg group-hover:text-bayan-text">
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="absolute inset-x-8 bottom-8 z-[2] text-bayan-bg">
                <div className="mb-1.5 text-[10px] uppercase tracking-[0.32em] opacity-85">
                  {card.small}
                </div>
                <div className="font-serif text-[32px] font-medium leading-[1.1] tracking-[0.04em]">
                  {card.big}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
