import Link from "next/link";
import { cn } from "@/lib/utils";

type Size = "sm" | "lg";

export function BayanMark({
  size = "sm",
  href = "/",
  className,
}: {
  size?: Size;
  href?: string;
  className?: string;
}) {
  const name =
    size === "lg"
      ? "text-[32px] tracking-[0.14em]"
      : "text-[28px] tracking-[0.18em] max-[480px]:text-[22px]";
  const sub =
    size === "lg"
      ? "text-[10px] tracking-[0.42em]"
      : "text-[9px] tracking-[0.42em] max-[480px]:text-[8px]";
  const subColor =
    size === "lg" ? "text-bayan-accent" : "text-bayan-accent-deep";

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center text-current no-underline",
        className,
      )}
      aria-label="Bayan — Ethnic Wear"
    >
      <span className={cn("font-serif font-semibold leading-none", name)}>
        BAYAN
      </span>
      <span className={cn("mt-1 uppercase", sub, subColor)}>Ethnic Wear</span>
    </Link>
  );
}
