"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BayanMark } from "./BayanMark";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQuantity, openCart, ready } = useCart();
  const cartCount = ready ? totalQuantity : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 border-b border-bayan-line bg-bayan-bg/85 backdrop-blur-xl transition-all duration-300",
          scrolled && "shadow-[0_4px_20px_-10px_rgba(42,46,37,0.15)]",
        )}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-6 px-[22px] py-[18px] md:grid-cols-[1fr_auto_1fr] md:px-9 md:py-[22px]">
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative text-[12px] font-medium uppercase tracking-[0.22em] text-bayan-text transition-colors duration-300 hover:text-bayan-primary-dark"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-bayan-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="-ml-1 flex h-9 w-9 items-center justify-center text-bayan-text md:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>

          <BayanMark />

          <div className="flex items-center justify-end gap-[14px] md:gap-[22px]">
            <IconButton label="Search">
              <Search className="h-5 w-5" strokeWidth={1.4} />
            </IconButton>
            <IconButton label="Wishlist" className="hidden sm:inline-flex">
              <Heart className="h-5 w-5" strokeWidth={1.4} />
            </IconButton>
            <IconButton label="Account" className="hidden sm:inline-flex">
              <User className="h-5 w-5" strokeWidth={1.4} />
            </IconButton>
            <IconButton label="Cart" onClick={openCart}>
              <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-bayan-primary-dark text-[9px] font-semibold text-bayan-bg">
                  {cartCount}
                </span>
              ) : null}
            </IconButton>
          </div>
        </div>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-bayan-bg md:hidden">
          <div className="flex items-center justify-between border-b border-bayan-line px-[22px] py-[18px]">
            <BayanMark />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center text-bayan-text"
            >
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-10">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl text-bayan-text transition-colors hover:text-bayan-primary-dark"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-center gap-6 border-t border-bayan-line px-6 py-6 text-bayan-muted">
            <IconButton label="Search">
              <Search className="h-5 w-5" strokeWidth={1.4} />
            </IconButton>
            <IconButton label="Wishlist">
              <Heart className="h-5 w-5" strokeWidth={1.4} />
            </IconButton>
            <IconButton label="Account">
              <User className="h-5 w-5" strokeWidth={1.4} />
            </IconButton>
          </div>
        </div>
      ) : null}
    </>
  );
}

function IconButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center p-1.5 text-bayan-text transition-colors duration-300 hover:text-bayan-primary-dark",
        className,
      )}
    >
      {children}
    </button>
  );
}
