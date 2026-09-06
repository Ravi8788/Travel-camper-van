import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const variants = {
  default: "bg-sand-200 text-ink",
  accent: "bg-accent-100 text-accent-700",
  forest: "bg-forest-100 text-forest-700",
  success: "bg-forest-100 text-forest-700",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-700",
  dark: "bg-ink text-sand-100",
  outline: "border border-sand-300 bg-transparent text-ink",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: string;
}

const statusMap: Record<string, keyof typeof variants> = {
  available: "success",
  confirmed: "success",
  completed: "forest",
  pending: "warning",
  booked: "accent",
  cancelled: "error",
  rejected: "error",
  maintenance: "warning",
  blocked: "error",
  inactive: "default",
  active: "success",
  scheduled: "accent",
  expired: "default",
  draft: "default",
  approved: "success",
  featured: "accent",
  paid: "success",
  refunded: "forest",
  failed: "error",
  partial: "warning",
};

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const variant = statusMap[status.toLowerCase()] ?? "default";
  return (
    <Badge variant={variant} className={cn("capitalize", className)} {...props}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
