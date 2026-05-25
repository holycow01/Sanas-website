import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SizeChart } from "@/components/product/SizeChart";

export const metadata: Metadata = {
  title: "Size Guide — Bayan",
  description:
    "Bayan stitched-outfit measurements for Small, Medium and Large — all in inches.",
};

const MEASURE_STEPS = [
  {
    title: "Shoulder",
    body: "Measure straight across the back, from the edge of one shoulder seam to the other.",
  },
  {
    title: "Chest",
    body: "Measure across the fullest part of the chest, keeping the tape flat.",
  },
  {
    title: "Hip",
    body: "Measure around the fullest part of the hips with the tape parallel to the floor.",
  },
  {
    title: "Length & Armhole",
    body: "Compare against a shirt you already own and love — lay it flat and measure edge to edge.",
  },
];

export default function SizeGuidePage() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-9 md:pt-16">
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <header className="mb-12 text-center">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
              Find your fit
            </div>
            <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.05] text-bayan-text">
              Size Guide
            </h1>
            <p className="mx-auto mt-4 max-w-[460px] text-bayan-muted">
              Our outfits come stitched in three standard sizes. Compare these
              measurements with a piece you already own for the best fit.
            </p>
          </header>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-lg border border-bayan-line bg-bayan-bg p-6 md:p-9">
            <SizeChart withHeading />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14">
            <h2 className="text-center font-serif text-2xl text-bayan-text">
              How to measure
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {MEASURE_STEPS.map((step) => (
                <div
                  key={step.title}
                  className="rounded border border-bayan-line bg-bayan-bg-alt/40 p-5"
                >
                  <div className="font-serif text-lg text-bayan-text">
                    {step.title}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-bayan-muted">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-14 text-center text-sm text-bayan-muted">
            Still unsure?{" "}
            <Link
              href="/contact"
              className="text-bayan-primary-dark hover:underline"
            >
              Message us
            </Link>{" "}
            and we&rsquo;ll help you choose the right size.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
