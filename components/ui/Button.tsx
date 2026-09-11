import Link from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-[0_4px_14px_-3px_rgb(249_115_22/0.45)] hover:shadow-[0_6px_20px_-3px_rgb(249_115_22/0.55)] hover:-translate-y-0.5",
  secondary:
    "bg-forest-700 text-white hover:bg-forest-600 active:bg-forest-700 shadow-[0_4px_14px_-3px_rgb(24_63_49/0.35)] hover:shadow-[0_6px_20px_-3px_rgb(24_63_49/0.45)]",
  outline:
    "border border-sand-300 bg-transparent text-ink hover:border-forest-500 hover:bg-forest-50 hover:text-forest-700",
  ghost: "bg-transparent text-ink hover:bg-sand-200/60 active:bg-sand-300",
  danger: "bg-error text-white hover:bg-red-700 active:bg-red-800",
  link: "bg-transparent text-forest-600 underline-offset-4 hover:underline p-0 h-auto font-semibold",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-6 text-sm gap-2 rounded-xl",
  lg: "h-[3.25rem] px-8 text-base gap-2.5 rounded-xl",
  icon: "h-10 w-10 p-0 rounded-lg",
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
    "inline-flex items-center justify-center font-semibold transition-all duration-300 ease-[var(--ease-editorial)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 focus-visible:ring-2 focus-visible:ring-accent-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
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
  ) => (
    <button
      ref={ref}
      className={buttonClassName(variant, size, className, disabled || loading)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
);

Button.displayName = "Button";

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <Link
      ref={ref}
      href={href}
      className={buttonClassName(variant, size, className, disabled)}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    >
      {children}
    </Link>
  )
);

ButtonLink.displayName = "ButtonLink";
