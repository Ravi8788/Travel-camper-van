import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export function Logo({
  className,
  variant = "default",
  alwaysShowName = false,
}: {
  className?: string;
  variant?: "default" | "light";
  alwaysShowName?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${SITE_NAME} — Home`}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold transition-transform group-hover:scale-105",
          variant === "light"
            ? "bg-accent-500 text-white"
            : "bg-forest-600 text-white"
        )}
      >
        TOW
      </span>
      <span className={alwaysShowName ? "block" : "hidden sm:block"}>
        <span
          className={cn(
            "block font-display text-base font-bold leading-tight",
            variant === "light" ? "text-sand-50" : "text-ink"
          )}
        >
          Travel On Wheels
        </span>
        <span
          className={cn(
            "block text-[10px] font-medium uppercase tracking-widest",
            variant === "light" ? "text-sand-400" : "text-sand-500"
          )}
        >
          Home on Wheels
        </span>
      </span>
    </Link>
  );
}
