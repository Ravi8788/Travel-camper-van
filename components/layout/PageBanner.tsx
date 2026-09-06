import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Container } from "@/components/ui";

export function PageBanner({
  title,
  description,
  eyebrow,
  children,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ink text-sand-50 py-16 sm:py-20 lg:py-24",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, var(--color-forest-600) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-accent-600) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />
      <Container className="relative">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-400">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl text-balance max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg text-sand-300 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </div>
  );
}

export function PageContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-padding", className)}>
      <Container>{children}</Container>
    </div>
  );
}
