import { Reveal } from "@/components/reveal";

export function Story() {
  return (
    <section id="story" className="bg-bayan-bg px-6 py-[120px] md:px-9">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal>
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-md"
            style={{
              background:
                "linear-gradient(135deg, var(--bayan-primary) 0%, var(--bayan-primary-dark) 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-3 rounded-sm"
              style={{ border: "1px solid rgba(193,165,114,0.45)" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 200 280"
                className="w-3/5"
                fill="none"
                stroke="rgba(193,165,114,0.9)"
                aria-hidden="true"
              >
                <path
                  d="M28 268 L28 100 Q28 24 100 24 Q172 24 172 100 L172 268"
                  strokeWidth="1.8"
                />
                <path
                  d="M100 76 Q100 144 100 220"
                  strokeWidth="1.4"
                />
                <path
                  d="M100 96 Q80 100 70 116 M100 96 Q120 100 130 116"
                  strokeWidth="1.2"
                />
                <path
                  d="M100 128 Q78 132 66 152 M100 128 Q122 132 134 152"
                  strokeWidth="1.2"
                />
                <path
                  d="M100 164 Q80 168 70 184 M100 164 Q120 168 130 184"
                  strokeWidth="1.2"
                />
                <path
                  d="M100 200 Q82 204 72 218 M100 200 Q118 204 128 218"
                  strokeWidth="1.2"
                />
                <ellipse cx="70" cy="116" rx="10" ry="5" transform="rotate(-30 70 116)" fill="rgba(193,165,114,0.85)" />
                <ellipse cx="130" cy="116" rx="10" ry="5" transform="rotate(30 130 116)" fill="rgba(193,165,114,0.85)" />
                <ellipse cx="66" cy="152" rx="12" ry="6" transform="rotate(-30 66 152)" fill="rgba(193,165,114,0.85)" />
                <ellipse cx="134" cy="152" rx="12" ry="6" transform="rotate(30 134 152)" fill="rgba(193,165,114,0.85)" />
                <ellipse cx="70" cy="184" rx="10" ry="5" transform="rotate(-30 70 184)" fill="rgba(193,165,114,0.85)" />
                <ellipse cx="130" cy="184" rx="10" ry="5" transform="rotate(30 130 184)" fill="rgba(193,165,114,0.85)" />
                <ellipse cx="72" cy="218" rx="9" ry="5" transform="rotate(-30 72 218)" fill="rgba(193,165,114,0.85)" />
                <ellipse cx="128" cy="218" rx="9" ry="5" transform="rotate(30 128 218)" fill="rgba(193,165,114,0.85)" />
                <circle cx="100" cy="74" r="6" fill="rgba(193,165,114,0.85)" />
              </svg>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mb-[18px] text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
            Our Story
          </div>
          <h2 className="mb-[26px] font-serif text-[clamp(34px,4vw,50px)] font-normal leading-[1.15] text-bayan-text">
            Quiet luxury,
            <br />
            <em className="not-italic font-serif italic text-bayan-primary-dark">
              woven by hand.
            </em>
          </h2>
          <p className="mb-[18px] text-base leading-[1.85] text-bayan-muted">
            Bayan was born from a simple belief — that the most enduring beauty
            comes from things made slowly and made well. Each piece in our
            collection is designed in-house and finished by artisans whose craft
            has been passed down through generations.
          </p>
          <p className="mb-[18px] text-base leading-[1.85] text-bayan-muted">
            From cambric to chiffon, from understated pret to heirloom-worthy
            festive wear, we exist for the woman who chooses her wardrobe the
            way she chooses her words: with intention.
          </p>
          <div className="mt-[26px] font-serif text-[22px] italic text-bayan-primary-dark">
            — The Bayan Atelier
          </div>
        </Reveal>
      </div>
    </section>
  );
}
