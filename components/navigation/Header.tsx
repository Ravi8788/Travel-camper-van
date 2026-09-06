"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, UserRound } from "lucide-react";
import { ButtonLink, NavItem } from "@/components/ui";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "border-b border-sand-200/80 bg-sand-50/95 shadow-soft backdrop-blur-md"
            : "border-b border-sand-200/60 bg-sand-50"
        )}
      >
        <div className="container-wide flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
          <Logo />

          {/* Desktop nav */}
          <nav
            className="hidden xl:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                active={isActive(link.href)}
              >
                {link.label}
              </NavItem>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ButtonLink
              href="/login"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex shrink-0 gap-1.5"
            >
              <UserRound className="h-4 w-4" />
              Log in
            </ButtonLink>
            <ButtonLink
              href="/book"
              size="sm"
              className="hidden sm:inline-flex shrink-0"
            >
              Book Your Van
            </ButtonLink>

            <ButtonLink
              href="/book"
              size="sm"
              className="sm:hidden shrink-0 px-4"
            >
              Book
            </ButtonLink>

            <button
              type="button"
              className="inline-flex xl:hidden h-10 w-10 items-center justify-center rounded-lg border border-sand-300 bg-sand-50 text-ink transition-colors hover:border-forest-400 hover:bg-forest-50"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
