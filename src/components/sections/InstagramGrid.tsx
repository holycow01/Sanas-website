import { Heart } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { BRAND } from "@/lib/brand";

type Tile = {
  background: string;
  /** stroke color override for tiles with light backgrounds */
  strokeLight?: boolean;
  art: React.ReactNode;
};

const TILES: Tile[] = [
  {
    background: "linear-gradient(135deg, #6f8161, #4d5b41)",
    art: (
      <path
        d="M30 90 L30 40 Q30 20 50 20 Q70 20 70 40 L70 90 M40 20 Q50 8 60 20"
        strokeWidth="1.5"
      />
    ),
  },
  {
    background: "linear-gradient(135deg, #c1a572, #9d8453)",
    art: (
      <path
        d="M50 12 Q50 50 50 92 M50 30 Q35 34 28 44 M50 30 Q65 34 72 44 M50 50 Q33 54 24 68 M50 50 Q67 54 76 68"
        strokeWidth="1.5"
      />
    ),
  },
  {
    background: "linear-gradient(135deg, #e8dfca, #c1a572)",
    strokeLight: true,
    art: (
      <>
        <path
          d="M25 90 Q50 30 75 90 M25 90 Q15 60 25 35 M75 90 Q85 60 75 35 M50 35 Q50 16 50 8"
          strokeWidth="1.5"
        />
        <circle cx="50" cy="14" r="4" />
      </>
    ),
  },
  {
    background: "linear-gradient(135deg, #4d5b41, #2a2e25)",
    art: (
      <path
        d="M30 90 L30 50 Q30 25 50 25 Q70 25 70 50 L70 90 M40 25 Q50 8 60 25 M50 50 L50 90"
        strokeWidth="1.5"
      />
    ),
  },
  {
    background: "linear-gradient(135deg, #9d8453, #6f8161)",
    art: (
      <path
        d="M50 12 L50 90 M30 32 Q50 22 70 32 M25 56 Q50 46 75 56 M30 78 Q50 70 70 78"
        strokeWidth="1.5"
      />
    ),
  },
  {
    background: "linear-gradient(135deg, #f1ead8, #d8cfb8)",
    strokeLight: true,
    art: (
      <path
        d="M20 90 L20 60 Q20 30 50 30 Q80 30 80 60 L80 90 M30 30 Q50 8 70 30 M50 30 L50 90"
        strokeWidth="1.5"
      />
    ),
  },
];

export function InstagramGrid() {
  return (
    <section className="bg-bayan-bg px-6 py-[120px] md:px-9">
      <SectionHead
        eyebrow={`@${BRAND.instagramHandle}`}
        titleStart="Follow the"
        titleEm="Atelier"
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-6">
        {TILES.map((tile, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-bayan-bg-alt"
              aria-label="View on Instagram"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]"
                style={{ background: tile.background }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
                <svg
                  viewBox="0 0 100 100"
                  className="w-[48%]"
                  fill="none"
                  stroke={
                    tile.strokeLight
                      ? "rgba(42,46,37,0.5)"
                      : "rgba(250,246,236,0.85)"
                  }
                  aria-hidden="true"
                >
                  {tile.art}
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-bayan-bg-dark/55 text-bayan-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Heart className="h-[22px] w-[22px]" strokeWidth={1.6} />
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] uppercase tracking-[0.28em] text-bayan-text transition-colors hover:text-bayan-primary-dark"
        >
          View Instagram →
        </a>
      </Reveal>
    </section>
  );
}
