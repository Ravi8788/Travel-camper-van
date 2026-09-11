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
    <div className={cn("bg-sand-50 pt-2 sm:pt-3", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-ink px-4 py-7 text-sand-50 sm:rounded-3xl sm:px-6 sm:py-10">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, var(--color-forest-600) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-accent-600) 0%, transparent 40%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-400">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-2xl font-bold sm:text-4xl text-balance max-w-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sand-300 sm:text-base">
                {description}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>
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
