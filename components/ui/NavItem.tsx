import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface NavItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

export function NavItem({
  href,
  active = false,
  disabled = false,
  icon,
  className,
  children,
  ...props
}: NavItemProps) {
  return (
    <Link
      href={disabled ? "#" : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold tracking-[0.02em] transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
        active
          ? "bg-forest-50 text-forest-700"
          : "text-ink/65 hover:bg-sand-100 hover:text-ink",
        disabled && "pointer-events-none cursor-not-allowed opacity-40",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
