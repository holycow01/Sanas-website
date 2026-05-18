"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/reveal";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="bg-bayan-bg-alt px-6 py-[100px] text-center md:px-9"
    >
      <Reveal>
        <h3 className="mb-4 font-serif text-[clamp(28px,3.4vw,40px)] font-normal text-bayan-text">
          Be the first to know.
        </h3>
        <p className="mx-auto mb-9 max-w-[480px] text-bayan-muted">
          Subscribe for new arrivals, atelier dispatches and 10% off your first
          order.
        </p>
        {submitted ? (
          <p className="font-serif text-lg italic text-bayan-primary-dark">
            Thanks — we&rsquo;ll be in touch.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto flex max-w-[460px] items-center gap-2 rounded-full border border-bayan-line bg-bayan-bg p-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 border-none bg-transparent px-4 py-2.5 text-sm text-bayan-text outline-none placeholder:text-bayan-muted"
            />
            <button
              type="submit"
              className="rounded-full bg-bayan-primary-dark px-7 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-colors duration-300 hover:bg-bayan-text"
            >
              Subscribe
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
