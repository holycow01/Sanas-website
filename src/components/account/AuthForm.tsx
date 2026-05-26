"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginAction,
  registerAction,
  type AuthState,
} from "@/lib/shopify/customer";
import { cn } from "@/lib/utils";

const initialState: AuthState = { error: null };

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
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
        required={required}
        className="rounded-md border border-bayan-line bg-bayan-bg px-4 py-3 text-sm text-bayan-text outline-none transition-colors focus:border-bayan-primary-dark"
      />
    </div>
  );
}

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "mt-2 inline-flex items-center justify-center rounded-full bg-bayan-primary-dark px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text",
        pending && "opacity-70",
      )}
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      {state.error ? (
        <p className="text-sm text-bayan-accent-deep">{state.error}</p>
      ) : null}
      <SubmitButton label="Sign In" pending={pending} />
      <p className="mt-2 text-center text-sm text-bayan-muted">
        New to Bayan?{" "}
        <Link
          href="/account/register"
          className="text-bayan-primary-dark hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" name="firstName" autoComplete="given-name" />
        <Field
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          required={false}
        />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
      />
      {state.error ? (
        <p className="text-sm text-bayan-accent-deep">{state.error}</p>
      ) : null}
      <SubmitButton label="Create Account" pending={pending} />
      <p className="mt-2 text-center text-sm text-bayan-muted">
        Already have an account?{" "}
        <Link
          href="/account/login"
          className="text-bayan-primary-dark hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
