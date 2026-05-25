import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-32">
      <div className="flex max-w-[460px] flex-col items-center text-center">
        <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
          Error 404
        </div>
        <h1 className="font-serif text-[clamp(40px,7vw,68px)] font-normal leading-[1.05] text-bayan-text">
          Lost in the <em className="font-serif italic text-bayan-primary-dark">atelier.</em>
        </h1>
        <p className="mt-5 text-bayan-muted">
          The page you&rsquo;re looking for has wandered off. Let&rsquo;s find
          your way back.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-bayan-primary-dark px-8 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text"
          >
            Back Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full border border-bayan-text px-8 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-text transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text hover:text-bayan-bg"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    </section>
  );
}
