"use client";

import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { getWhatsAppUrl } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { cn } from "@/lib/utils";

const VISIBLE_ON_PATHS = [
  "/",
  "/vans",
  "/contact",
  "/book",
];

function shouldShowWhatsApp(pathname: string): boolean {
  if (VISIBLE_ON_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/vans/")) return true;
  if (pathname.startsWith("/book")) return true;
  return false;
}

export function WhatsAppCTA() {
  const pathname = usePathname();
  const settings = getSettings();
  const [dismissed, setDismissed] = useState(false);

  if (!shouldShowWhatsApp(pathname) || dismissed) return null;

  const whatsappUrl = "#whatsapp";

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2",
        "sm:bottom-6 sm:right-6"
      )}
    >
      {/* Expanded label — desktop */}
      <a
        href={whatsappUrl}
        className={cn(
          "group hidden sm:flex items-center gap-3 rounded-full border border-sand-200",
          "bg-white pl-5 pr-2 py-2 shadow-elevated",
          "hover:shadow-card hover:border-forest-300 transition-all duration-300",
          "animate-slide-up max-w-xs"
        )}
        aria-label="Chat with us on WhatsApp"
      >
        <div className="text-right">
          <p className="text-xs font-semibold text-forest-600">Have Questions?</p>
          <p className="text-sm font-medium text-ink">Chat With Us on WhatsApp</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white group-hover:scale-105 transition-transform">
          <MessageCircle className="h-5 w-5" />
        </span>
      </a>

      {/* Compact — mobile */}
      <div className="flex items-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sand-500 shadow-soft"
          aria-label="Dismiss WhatsApp button"
        >
          <X className="h-4 w-4" />
        </button>
        <a
          href={whatsappUrl}
          className="flex items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 py-3 text-white shadow-elevated hover:bg-[#20BD5A] transition-colors"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
}
