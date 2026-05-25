import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Our Story — Bayan",
  description:
    "Bayan is an atelier built on stillness — heritage-rooted Pakistani ethnic wear, hand-finished with intention.",
};

const VALUES = [
  {
    title: "Craft",
    body: "Every piece is finished by hand. We measure twice, stitch slowly, and refuse to rush what deserves patience.",
  },
  {
    title: "Provenance",
    body: "Fabrics sourced from mills we know by name. We tell you what a piece is made of — always.",
  },
  {
    title: "Patience",
    body: "We make in small runs, not in floods. A wardrobe built to be kept, not replaced each season.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-16 text-center md:px-9 md:pt-24">
        <Reveal>
          <div className="mx-auto max-w-[720px]">
            <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
              Our Story
            </div>
            <h1 className="font-serif text-[clamp(40px,6vw,68px)] font-normal leading-[1.05] text-bayan-text">
              An atelier built on <em className="font-serif italic text-bayan-primary-dark">stillness.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-[540px] text-[17px] leading-relaxed text-bayan-muted">
              Bayan began with a quiet conviction — that clothing made slowly,
              and made well, carries something the fast world has forgotten.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Story */}
      <section className="px-6 py-20 md:px-9 md:py-28">
        <Reveal>
          <div className="mx-auto max-w-[680px] space-y-6 text-[16px] leading-[1.9] text-bayan-muted">
            <p>
              The word <em className="font-serif italic text-bayan-text">bayan</em> means
              expression — and that is what each of our pieces hopes to be. Not
              a trend, not a season, but a sentence in the language of how a
              woman chooses to carry herself.
            </p>
            <p>
              We design in-house and finish by hand. Embroidery is worked thread
              by thread; hems are rolled by people whose craft has passed
              through generations. Nothing leaves the atelier until it is right.
            </p>
            <p>
              From everyday lawn to heirloom-worthy festive wear, we make for the
              woman who chooses her wardrobe the way she chooses her words — with
              intention, and without noise.
            </p>
            <p>
              We make in small runs. Some pieces are limited not as a tactic, but
              because the hands that make them can only make so many. We think
              that&rsquo;s the point.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="bg-bayan-bg-alt px-6 py-20 md:px-9 md:py-28">
        <Reveal>
          <div className="mb-14 text-center">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
              What we hold to
            </div>
            <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-normal text-bayan-text">
              Three quiet promises
            </h2>
          </div>
        </Reveal>
        <div className="mx-auto grid max-w-[1000px] gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <div className="h-full rounded-lg border border-bayan-line bg-bayan-bg p-7">
                <div className="font-serif text-2xl italic text-bayan-primary-dark">
                  {v.title}
                </div>
                <p className="mt-3 text-[15px] leading-[1.8] text-bayan-muted">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founder note */}
      <section className="px-6 py-24 text-center md:px-9">
        <Reveal>
          <div className="mx-auto max-w-[620px]">
            <p className="font-serif text-[clamp(22px,3vw,30px)] font-normal italic leading-[1.5] text-bayan-text">
              &ldquo;We started Bayan to make the kind of clothes we wished
              existed — quiet, considered, and made to be kept.&rdquo;
            </p>
            <div className="mt-6 text-[11px] uppercase tracking-[0.32em] text-bayan-accent-deep">
              — The Bayan Atelier
            </div>
            <Link
              href="/shop"
              className="mt-10 inline-flex items-center rounded-full bg-bayan-primary-dark px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text"
            >
              Explore the Collection
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
