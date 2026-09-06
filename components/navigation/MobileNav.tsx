"use client";

import { usePathname } from "next/navigation";
import { Drawer, ButtonLink, NavItem } from "@/components/ui";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { Logo } from "./Logo";
import { MessageCircle, Phone } from "lucide-react";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const settings = getSettings();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="right" className="max-w-sm bg-sand-50">
      <div className="-mt-2 -mx-2 mb-6">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
        {PUBLIC_NAV_LINKS.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            onClick={onClose}
            active={isActive(link.href)}
            className="w-full justify-start px-4 py-3 text-base"
          >
            {link.label}
          </NavItem>
        ))}
      </nav>

      <div className="mt-8 space-y-3 border-t border-sand-200 pt-6">
        <ButtonLink href="/login" onClick={onClose} variant="outline" className="w-full" size="lg">
          Log in
        </ButtonLink>
        <ButtonLink href="/admin/login" onClick={onClose} variant="ghost" className="w-full" size="md">
          Admin Login
        </ButtonLink>
        <ButtonLink href="/book" onClick={onClose} className="w-full" size="lg">
          Book Your Van
        </ButtonLink>

        <a
          href="#whatsapp"
          className="flex items-center gap-3 rounded-xl border border-sand-200 px-4 py-3 text-sm font-medium text-ink hover:bg-sand-50 transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-forest-600" />
          WhatsApp-style help
        </a>

        <a
          href={`tel:${settings.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-3 rounded-xl border border-sand-200 px-4 py-3 text-sm font-medium text-ink hover:bg-sand-50 transition-colors"
        >
          <Phone className="h-5 w-5 text-forest-600" />
          {settings.phone}
        </a>
      </div>
    </Drawer>
  );
}
