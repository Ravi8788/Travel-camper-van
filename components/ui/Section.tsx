import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Container({
  className,
  narrow = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { narrow?: boolean }) {
  return (
    <div
      className={cn(narrow ? "container-narrow" : "container-wide", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  id,
  dark = false,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { dark?: boolean }) {
  return (
    <section
      id={id}
      className={cn(
        "section-padding",
        dark ? "bg-ink text-sand-100" : "",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-widest",
            dark ? "text-accent-400" : "text-accent-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold sm:text-4xl lg:text-5xl text-balance",
          dark ? "text-sand-50" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            dark ? "text-sand-300" : "text-sand-500"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-sand-200", className)} />;
}
