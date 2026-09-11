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
        "section-padding relative overflow-hidden",
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
        "mb-8 max-w-2xl sm:mb-10",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow mb-4",
            dark ? "text-accent-400" : "text-accent-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-2xl font-bold sm:text-3xl lg:text-[2rem] text-balance tracking-tight",
          dark ? "text-sand-50" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
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
  return <hr className={cn("border-sand-200/60", className)} />;
}
