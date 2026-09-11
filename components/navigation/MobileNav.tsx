"use client";

import { usePathname, useRouter } from "next/navigation";
import { Drawer, ButtonLink, NavItem } from "@/components/ui";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { createClient } from "@/utils/supabase/client";
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
  const router = useRouter();
  const settings = getSettings();

  const handleBookClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?next=%2Fbook");
      return;
    }
    router.push("/book");
    onClose();
  };

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
        <button
          type="button"
          onClick={() => void handleBookClick()}
          className="inline-flex h-[3.25rem] w-full items-center justify-center rounded-xl bg-accent-500 px-8 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-600"
        >
          Book Your Van
        </button>

        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-sand-200 px-4 py-3 text-sm font-medium text-ink hover:bg-sand-50 transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-forest-600" />
          Chat on WhatsApp
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
