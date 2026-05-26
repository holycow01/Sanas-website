import type { Metadata } from "next";
import { LoginForm } from "@/components/account/AuthForm";

export const metadata: Metadata = {
  title: "Sign In — Bayan",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-[400px]">
        <header className="mb-10 text-center">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
            Welcome back
          </div>
          <h1 className="font-serif text-[clamp(32px,5vw,44px)] font-normal text-bayan-text">
            Sign In
          </h1>
        </header>
        <LoginForm />
      </div>
    </section>
  );
}
