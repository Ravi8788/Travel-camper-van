import Link from "next/link";
import {
  Camera,
  Globe,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
} from "lucide-react";
import { Container } from "@/components/ui";
import { PUBLIC_NAV_LINKS, SITE_TAGLINE } from "@/lib/constants";
import { getSettings } from "@/lib/data";
import { Logo } from "./Logo";

const LEGAL_LINKS = [
  { href: "/cancellation-policy", label: "Cancellation & Refund" },
  { href: "/self-drive", label: "Self-Drive & Eligibility" },
] as const;

export function Footer() {
  const settings = getSettings();

  return (
    <footer className="border-t border-ink-muted bg-ink text-sand-300">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-sand-400 max-w-xs">
              {SITE_TAGLINE}
            </p>
            <p className="mt-4 text-sm text-sand-500">
              Premium self-drive camper van rentals across Pune, Maharashtra & beyond.
            </p>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sand-100 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {PUBLIC_NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sand-400 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sand-100 mb-4">
              Policies
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sand-400 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/book"
                  className="text-sm text-sand-400 hover:text-accent-400 transition-colors"
                >
                  Book a Van
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-sm text-sand-400 hover:text-accent-400 transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sand-100 mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 text-sm text-sand-400 hover:text-accent-400 transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2.5 text-sm text-sand-400 hover:text-accent-400 transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {settings.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5 text-sm text-sand-400">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}, {settings.state}{" "}
                  {settings.pincode}
                </span>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-muted text-sand-400 hover:border-accent-500 hover:text-accent-400 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-muted text-sand-400 hover:border-accent-500 hover:text-accent-400 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-muted text-sand-400 hover:border-accent-500 hover:text-accent-400 transition-colors"
                >
                  <PlayCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-muted pt-8 sm:flex-row">
          <p className="text-xs text-sand-500">
            © {new Date().getFullYear()} {settings.businessName}. All rights
            reserved.
          </p>
          <p className="text-xs text-sand-500">Self-drive camper rentals · No driver provided</p>
          <p className="text-xs text-sand-400">Developed by Shris Innovation Pvt Ltd</p>
        </div>
      </Container>
    </footer>
  );
}
