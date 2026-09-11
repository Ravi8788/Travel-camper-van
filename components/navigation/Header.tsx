"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, UserRound } from "lucide-react";
import { ButtonLink, NavItem } from "@/components/ui";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleBookClick = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=%2Fbook");
      return;
    }

    router.push("/book");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-sand-200/70 bg-white/95 text-ink shadow-soft backdrop-blur-xl transition-all duration-300",
        )}
      >
        <div className="container-wide flex h-14 items-center justify-between gap-3 sm:h-16 lg:h-[4.5rem]">
          <Logo />

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {PUBLIC_NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <NavItem
                  key={link.href}
                  href={link.href}
                  active={active}
                  className={cn(
                    "transition-all duration-200 rounded-full px-2.5 py-1.5 text-[11px] font-semibold xl:px-3.5 xl:text-xs",
                    active
                      ? "bg-forest-50 text-forest-700"
                      : "text-ink/70 hover:bg-sand-100 hover:text-ink"
                  )}
                >
                  {link.label}
                </NavItem>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ButtonLink
              href="/login"
              variant="ghost"
              size="sm"
              className={cn(
                "hidden sm:inline-flex shrink-0 gap-1.5 rounded-full px-3.5 text-xs font-semibold text-ink/80 hover:bg-sand-100",
              )}
            >
              <UserRound className="h-3.5 w-3.5" />
              Log in
            </ButtonLink>

            <button
              type="button"
              onClick={() => void handleBookClick()}
              className="hidden sm:inline-flex shrink-0 rounded-full bg-accent-500 px-5 text-xs font-semibold text-white shadow-md transition-all hover:bg-accent-600 hover:shadow-lg"
            >
              Book Your Van
            </button>

            <button
              type="button"
              onClick={() => void handleBookClick()}
              className="sm:hidden shrink-0 rounded-full bg-accent-500 px-3.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-accent-600"
            >
              Book
            </button>

            <button
              type="button"
              className={cn(
                "inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-sand-300 bg-sand-50 text-ink transition-colors hover:border-forest-400 hover:bg-forest-50",
              )}
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
