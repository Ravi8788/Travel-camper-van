export const SITE_NAME = "Travel On Wheels";
export const SITE_TAGLINE = "Travel. Stay. Explore. Your Home on Wheels.";
export const SITE_DESCRIPTION =
  "Premium self-drive camper van rentals for adventure travellers. Your home on wheels — travel, stay, and explore India on your terms.";

export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/vans", label: "Our Vans" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/packages", label: "Packages" },
  { href: "/offers", label: "Offers" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export const CUSTOMER_NAV_LINKS = [
  { href: "/account", label: "My Bookings" },
  { href: "/account/profile", label: "Profile" },
] as const;

export const BOOKING_STEPS = [
  { id: "van", label: "Select Van" },
  { id: "dates", label: "Select Dates" },
  { id: "location", label: "Location" },
  { id: "details", label: "Your Details" },
  { id: "summary", label: "Price Summary" },
  { id: "terms", label: "Terms" },
  { id: "payment", label: "Payment" },
] as const;

export const FAQ_CATEGORIES = {
  booking: "Booking",
  vehicle: "Vehicle",
  self_drive: "Self-Drive",
  payment: "Payment",
  security_deposit: "Security Deposit",
  cancellation: "Cancellation",
  fuel: "Fuel",
  pickup_return: "Pickup & Return",
} as const;

export const PICKUP_LOCATIONS = [
  "Bangalore — Koramangala Hub",
  "Bangalore — Airport Pickup",
  "Mysore — City Centre",
  "Goa — Panjim",
] as const;

/** Configurable booking rule — will map to Supabase settings later */
export const DEFAULT_ADVANCE_BOOKING_DAYS = 4;

export const WHATSAPP_MESSAGE =
  "Hi Travel On Wheels! I have a question about camper van rentals.";

export function getWhatsAppUrl(phone: string, message = WHATSAPP_MESSAGE): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
