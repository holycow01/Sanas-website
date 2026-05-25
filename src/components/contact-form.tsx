"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/lib/contact-action";
import { cn } from "@/lib/utils";

const initialState: ContactState = { ok: false, message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="rounded-lg border border-bayan-line bg-bayan-bg-alt/40 p-8 text-center">
        <p className="font-serif text-2xl text-bayan-text">Message sent.</p>
        <p className="mt-2 text-sm text-bayan-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Name" name="name" type="text" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-muted"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="resize-none rounded-md border border-bayan-line bg-bayan-bg px-4 py-3 text-sm text-bayan-text outline-none transition-colors focus:border-bayan-primary-dark"
        />
      </div>

      {state.message && !state.ok ? (
        <p className="text-sm text-bayan-accent-deep">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "mt-2 inline-flex items-center justify-center rounded-full bg-bayan-primary-dark px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text",
          pending && "opacity-70",
        )}
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-[11px] font-medium uppercase tracking-[0.22em] text-bayan-muted"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="rounded-md border border-bayan-line bg-bayan-bg px-4 py-3 text-sm text-bayan-text outline-none transition-colors focus:border-bayan-primary-dark"
      />
    </div>
  );
}
