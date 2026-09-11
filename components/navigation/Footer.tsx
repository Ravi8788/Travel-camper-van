import Link from "next/link";
import { Container } from "@/components/ui";
import { getSettings } from "@/lib/data";

const LEGAL_LINKS = [
  { href: "/cancellation-policy", label: "Privacy Policy" },
  { href: "/self-drive", label: "Terms & Conditions" },
  { href: "/admin/login", label: "Admin Login" },
] as const;

export function Footer() {
  const settings = getSettings();

  return (
    <footer className="mx-1.5 mb-1.5 overflow-hidden rounded-sm border border-[#3b1718] bg-[#260607] text-white sm:mx-2 sm:mb-2">
      <Container className="flex min-h-[4.5rem] flex-col gap-3 py-3.5 text-xs text-white/65 sm:min-h-[5rem] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:py-3">
          <p className="shrink-0 text-center sm:text-left">
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:justify-start"
            aria-label="Legal"
          >
            {LEGAL_LINKS.map((link, index) => (
              <span key={`${link.label}-${index}`} className="inline-flex items-center gap-4">
                {index > 0 && (
                  <span className="hidden text-white/20 sm:inline" aria-hidden>
                    |
                  </span>
                )}
                <Link
                  href={link.href}
                  className={
                    link.href === "/admin/login"
                      ? "rounded-md border border-[#fdba74]/40 px-2.5 py-1 font-semibold text-[#fdba74] transition-colors hover:border-[#fdba74] hover:bg-[#fdba74]/10"
                      : "transition-colors hover:text-[#fdba74]"
                  }
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="shrink-0 text-center sm:text-right">
            Designed &amp; Developed by{" "}
            <a
              href="https://api.whatsapp.com/send/?phone=917588473653&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#fdba74] hover:text-[#f97316]"
            >
              Shris Innovation
            </a>
          </p>
      </Container>
    </footer>
  );
}
