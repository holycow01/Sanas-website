import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/AuthForm";

export const metadata: Metadata = {
  title: "Create Account — Bayan",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-[440px]">
        <header className="mb-10 text-center">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-bayan-accent-deep">
            Join the atelier
          </div>
          <h1 className="font-serif text-[clamp(32px,5vw,44px)] font-normal text-bayan-text">
            Create Account
          </h1>
        </header>
        <RegisterForm />
      </div>
    </section>
  );
}
