import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Bayan",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-[420px] text-center">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
          Your account
        </div>
        <h1 className="font-serif text-[clamp(34px,5vw,48px)] font-normal leading-[1.05] text-bayan-text">
          Sign in to Bayan
        </h1>
        <p className="mx-auto mt-5 max-w-[340px] text-bayan-muted">
          We&rsquo;ll send a one-time code to your email — no password to
          remember. New here? You can create your account on the same screen.
        </p>

        {error ? (
          <p className="mt-5 text-sm text-bayan-accent-deep">
            {error === "config"
              ? "Sign-in isn't configured yet. Please try again later."
              : "Something went wrong signing you in. Please try again."}
          </p>
        ) : null}

        <a
          href="/api/auth/login"
          className="mt-9 inline-flex items-center justify-center rounded-full bg-bayan-primary-dark px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-bayan-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-bayan-text"
        >
          Continue to Sign In
        </a>
      </div>
    </section>
  );
}
