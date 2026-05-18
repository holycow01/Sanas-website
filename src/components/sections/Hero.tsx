import Link from "next/link";

const PETALS = [
  { left: "8%", delay: "0s", fill: "#c1a572", stroke: "#9d8453" },
  { left: "22%", delay: "4s", fill: "#9d8453", stroke: "#9d8453" },
  { left: "45%", delay: "8s", fill: "#c1a572", stroke: "#9d8453" },
  { left: "68%", delay: "12s", fill: "#6f8161", stroke: "#4d5b41" },
  { left: "86%", delay: "6s", fill: "#c1a572", stroke: "#9d8453" },
] as const;

export function Hero() {
  return (
    <section
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-20 md:px-9"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(193,165,114,0.12), transparent 50%), radial-gradient(ellipse at 75% 80%, rgba(111,129,97,0.15), transparent 55%), linear-gradient(180deg, var(--bayan-bg) 0%, var(--bayan-bg-alt) 100%)",
      }}
    >
      {/* Background arch */}
      <svg
        viewBox="0 0 400 560"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[720px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        fill="none"
        stroke="var(--bayan-primary-dark)"
        aria-hidden="true"
      >
        <path
          d="M50 540 L50 200 Q50 40 200 40 Q350 40 350 200 L350 540"
          strokeWidth="1.2"
        />
        <path
          d="M80 540 L80 220 Q80 70 200 70 Q320 70 320 220 L320 540"
          strokeWidth="0.8"
        />
      </svg>

      {/* Floating petals */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute h-[18px] w-[18px] opacity-50 animate-[float_18s_linear_infinite]"
          style={{ left: p.left, animationDelay: p.delay }}
        >
          <svg viewBox="0 0 24 24" fill={p.fill} stroke={p.stroke}>
            <path d="M12 2 C 18 6, 18 14, 12 22 C 6 14, 6 6, 12 2 Z" />
          </svg>
        </span>
      ))}

      <div className="relative z-[2] mx-auto max-w-[760px] text-center">
        <div
          className="mb-7 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep animate-[fade-up_1.1s_cubic-bezier(0.2,0.8,0.2,1)_0.1s_both]"
        >
          Spring / Summer &lsquo;26 — Now Live
        </div>

        <svg
          viewBox="0 0 100 140"
          fill="none"
          aria-hidden="true"
          className="mx-auto mb-[30px] w-20 animate-[fade-up_1.1s_cubic-bezier(0.2,0.8,0.2,1)_0.25s_both]"
        >
          <path
            d="M14 132 L14 50 Q14 12 50 12 Q86 12 86 50 L86 132"
            stroke="#9d8453"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M50 38 Q50 70 50 110"
            stroke="#c1a572"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M50 48 Q40 50 36 56 M50 48 Q60 50 64 56"
            stroke="#c1a572"
            strokeWidth="1"
          />
          <path
            d="M50 64 Q40 66 34 74 M50 64 Q60 66 66 74"
            stroke="#c1a572"
            strokeWidth="1"
          />
          <path
            d="M50 82 Q40 84 36 92 M50 82 Q60 84 64 92"
            stroke="#c1a572"
            strokeWidth="1"
          />
          <ellipse cx="36" cy="56" rx="6" ry="3" fill="#c1a572" opacity="0.85" transform="rotate(-30 36 56)" />
          <ellipse cx="64" cy="56" rx="6" ry="3" fill="#c1a572" opacity="0.85" transform="rotate(30 64 56)" />
          <ellipse cx="34" cy="74" rx="7" ry="3.5" fill="#c1a572" opacity="0.85" transform="rotate(-30 34 74)" />
          <ellipse cx="66" cy="74" rx="7" ry="3.5" fill="#c1a572" opacity="0.85" transform="rotate(30 66 74)" />
          <ellipse cx="36" cy="92" rx="6" ry="3" fill="#c1a572" opacity="0.85" transform="rotate(-30 36 92)" />
          <ellipse cx="64" cy="92" rx="6" ry="3" fill="#c1a572" opacity="0.85" transform="rotate(30 64 92)" />
          <circle cx="50" cy="36" r="3.5" fill="#c1a572" />
        </svg>

        <h1 className="mb-7 font-serif text-[clamp(40px,6.4vw,76px)] font-normal leading-[1.05] text-bayan-text animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.4s_both]">
          Woven in <em className="not-italic font-serif italic text-bayan-primary-dark">tradition</em>,
          <br />
          designed for today.
        </h1>

        <p className="mx-auto mb-11 max-w-[520px] text-[17px] tracking-[0.01em] text-bayan-muted animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.55s_both]">
          Bayan brings you heritage-rooted ethnic wear, hand-finished in Pakistan
          with the fabrics, embroidery, and silhouettes of a softer kind of luxury.
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-[fade-up_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.7s_both]">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-bayan-primary-dark px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text hover:shadow-[0_14px_40px_-10px_rgba(42,46,37,0.4)]"
          >
            Shop New Arrivals
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-bayan-text bg-transparent px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-text transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text hover:text-bayan-bg"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
