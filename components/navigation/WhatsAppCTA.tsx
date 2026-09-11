"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/constants";
import { getSettings } from "@/lib/data";

export function WhatsAppCTA() {
  const pathname = usePathname();
  const settings = getSettings();

  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={getWhatsAppUrl(settings.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 z-50 flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.5)] transition-transform hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6"
      aria-label="Chat with us on WhatsApp"
      title="Have Questions? Chat With Us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
}
