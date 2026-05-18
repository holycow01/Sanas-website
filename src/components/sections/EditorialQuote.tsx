import { Reveal } from "@/components/reveal";

export function EditorialQuote() {
  return (
    <section className="relative overflow-hidden bg-bayan-bg-dark px-6 py-[140px] text-center text-bayan-bg md:px-9">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(193,165,114,0.15), transparent 45%), radial-gradient(circle at 80% 70%, rgba(111,129,97,0.18), transparent 50%)",
        }}
      />
      <Reveal className="relative z-[2] mx-auto max-w-[720px]">
        <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent">
          From the atelier
        </div>
        <blockquote className="mb-8 font-serif text-[clamp(28px,4vw,42px)] font-normal italic leading-[1.3]">
          &ldquo;Bayan&rdquo; — a Persian word meaning{" "}
          <em className="font-serif italic text-bayan-accent">expression</em>. Each
          thread, a sentence. Each silhouette, a chapter.
        </blockquote>
        <div className="text-[11px] uppercase tracking-[0.32em] text-bayan-bg/65">
          A Note From The Founder
        </div>
      </Reveal>
    </section>
  );
}
