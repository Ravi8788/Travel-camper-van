import Link from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-soft hover:-translate-y-0.5 hover:shadow-card",
  secondary:
    "bg-forest-600 text-white hover:bg-forest-700 active:bg-forest-700 shadow-soft",
  outline:
    "border border-ink/20 bg-transparent text-ink hover:border-forest-500 hover:bg-forest-50 hover:text-forest-700",
  ghost: "bg-transparent text-ink hover:bg-sand-200 active:bg-sand-300",
  danger: "bg-error text-white hover:bg-red-700 active:bg-red-800",
  link: "bg-transparent text-forest-600 underline-offset-4 hover:underline p-0 h-auto",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2.5",
  icon: "h-10 w-10 p-0",
} as const;

type SharedProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
};

export type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export type ButtonLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    disabled?: boolean;
  };

function buttonClassName(
  variant: keyof typeof variants,
  size: keyof typeof sizes,
  className?: string,
  disabled?: boolean
) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 ease-[var(--ease-editorial)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 focus-visible:ring-2 focus-visible:ring-accent-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
    variants[variant],
    sizes[size],
    disabled && "pointer-events-none opacity-50",
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClassName(variant, size, className, disabled || loading)}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      href,
      ...props
    },
    ref
  ) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={buttonClassName(variant, size, className, disabled || loading)}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";
