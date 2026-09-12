"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  CircleHelp,
  CreditCard,
  FileText,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Phone,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  UserRound,
  Wallet,
  X,
  Menu,
} from "lucide-react";
import {
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  StatusBadge,
  Textarea,
} from "@/components/ui";
import {
  getBookings,
  getCustomers,
  getOffers,
  getSettings,
  getVehicles,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { useVansStore } from "@/lib/store/VansStore";
import { BookingTimeline } from "@/components/customer/BookingTimeline";
import { createClient } from "@/utils/supabase/client";

const sections = [
  ["Dashboard", Home],
  ["My Bookings", BookOpen],
  ["Saved Vans", Heart],
  ["Offers & Rewards", Star],
  ["Payments", Wallet],
  ["Documents", FileText],
  ["Notifications", Bell],
  ["Support", CircleHelp],
  ["Profile", UserRound],
  ["Settings", Settings],
] as const;

type SectionName = (typeof sections)[number][0];

function PanelCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="customer-card overflow-hidden border-sand-200/90 bg-sand-50 shadow-soft">
      <CardHeader className="border-b border-sand-200/60 p-3.5 sm:p-5">
        <CardTitle className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="mt-1 text-xs text-sand-500 leading-relaxed">
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-3.5 sm:p-5">{children}</CardContent>
    </Card>
  );
}

export function CustomerPanel() {
  const router = useRouter();
  const [section, setSection] = useState<SectionName>("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bookings = getBookings();
  const customer = getCustomers()[0];
  const offers = getOffers();
  const settings = getSettings();
  const { vehicles, savedVanIds, toggleSavedVan } = useVansStore();

  const savedVans = vehicles.filter((vehicle) =>
    savedVanIds.includes(vehicle.id)
  );
  const booking =
    bookings.find((item) => item.status === "confirmed") ?? bookings[0];

  const go = (next: SectionName) => {
    setSection(next);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="customer-panel flex h-screen min-h-0 flex-col overflow-hidden bg-sand-100/70 text-ink">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 border-b border-sand-200/80 bg-[#f3ede3]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-700 text-sand-50 font-display font-bold text-sm shadow-xs">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-base sm:text-xl font-bold tracking-tight text-ink">
                  Hi, {customer.name.split(" ")[0]}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-semibold text-forest-700">
                  <Sparkles className="h-2.5 w-2.5" /> Nomad Member
                </span>
              </div>
              <p className="text-[11px] text-sand-500">
                1 active trip scheduled · Pune Base Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go("Notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-sand-200 bg-sand-50 text-sand-600 hover:bg-sand-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
            </button>
            <ButtonLink
              href="/"
              variant="outline"
              size="sm"
              className="h-9 px-2.5 text-[11px] font-semibold sm:px-3 sm:text-xs"
            >
              View site
            </ButtonLink>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-sand-200 bg-sand-50 px-2.5 text-[11px] font-semibold text-ink transition-colors hover:bg-sand-100 sm:px-3 sm:text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

      </header>

      {/* Main Container Layout */}
      <div className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 px-3 py-4 sm:px-4 sm:py-5">
        <div className="grid min-h-0 w-full gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Desktop Left Sidebar */}
          <aside className="hidden h-[calc(100vh-128px)] overflow-hidden lg:block">
            <nav className="sticky top-24 h-full space-y-1 overflow-y-auto rounded-2xl border border-sand-200/80 bg-[#f3ede3] p-2.5 shadow-soft">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sand-400">
                Customer Navigation
              </p>
              {sections.map(([label, Icon]) => {
                const active = section === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => go(label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-200 ${
                      active
                        ? "bg-forest-700 text-sand-50 shadow-soft"
                        : "text-ink/70 hover:bg-sand-100 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                    {label === "Notifications" && (
                      <span className="ml-auto rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        3
                      </span>
                    )}
                    {label === "Saved Vans" && savedVans.length > 0 && (
                      <span className="ml-auto rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-700">
                        {savedVans.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="min-h-0 min-w-0 overflow-y-auto overscroll-contain pb-24 lg:h-[calc(100vh-128px)] lg:pb-6">
            {section === "Dashboard" && (
              <Dashboard
                booking={booking}
                customer={customer}
                savedVans={savedVans}
                go={go}
              />
            )}
            {section === "My Bookings" && (
              <Bookings bookings={bookings} go={go} />
            )}
            {section === "Saved Vans" && (
              <SavedVans
                savedVans={savedVans}
                toggleSavedVan={toggleSavedVan}
              />
            )}
            {section === "Offers & Rewards" && (
              <Offers offers={offers} go={go} />
            )}
            {section === "Payments" && <Payments bookings={bookings} />}
            {section === "Documents" && <Documents customer={customer} />}
            {section === "Notifications" && <Notifications />}
            {section === "Support" && <Support settings={settings} />}
            {section === "Profile" && <Profile customer={customer} />}
            {section === "Settings" && <AccountSettings />}
          </main>
        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Screen Fitting */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-sand-200/90 bg-[#f3ede3]/95 px-1 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-lg shadow-elevated lg:hidden">
        {[
          { label: "Dashboard", short: "Home", icon: Home },
          { label: "My Bookings", short: "Bookings", icon: BookOpen },
          { label: "Saved Vans", short: "Saved", icon: Heart },
          { label: "Documents", short: "KYC", icon: FileText },
        ].map(({ label, short, icon: Icon }) => {
          const active = section === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => go(label as SectionName)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-[10px] font-medium transition-colors ${
                active ? "text-accent-600 font-bold" : "text-sand-500"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{short}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-[10px] font-medium transition-colors ${
            mobileMenuOpen ? "text-accent-600 font-bold" : "text-sand-500"
          }`}
        >
          <Menu className="h-4 w-4" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile "More" Slide-up Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="w-full max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-sand-200 bg-sand-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-elevated">
            <div className="flex items-center justify-between border-b border-sand-200/60 pb-3">
              <p className="font-display text-lg font-bold text-ink">
                All Portal Sections
              </p>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-sand-500 hover:bg-sand-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 pb-6">
              {sections.map(([label, Icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(label)}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-semibold transition-colors ${
                    section === label
                      ? "border-forest-600 bg-forest-50 text-forest-800"
                      : "border-sand-200 bg-white text-sand-700 hover:bg-sand-100"
                  }`}
                >
                  <Icon className="h-4 w-4 text-accent-600 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note?: string;
}) {
  return (
    <Card className="customer-metric overflow-hidden border-sand-200/90 bg-sand-50 shadow-soft">
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs font-medium text-sand-500">{label}</p>
        <p className="mt-1 break-words font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {value}
        </p>
        {note && (
          <p className="mt-1 text-[11px] font-semibold text-forest-600">
            {note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Dashboard({
  booking,
  customer,
  savedVans,
  go,
}: {
  booking: ReturnType<typeof getBookings>[number];
  customer: ReturnType<typeof getCustomers>[number];
  savedVans: ReturnType<typeof getVehicles>;
  go: (section: SectionName) => void;
}) {
  const vehicle =
    getVehicles().find((item) => item.id === booking.vehicleId) ??
    getVehicles()[0];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          label="Total Trips"
          value={customer.totalBookings}
          note="Verified Nomad"
        />
        <Metric
          label="Pending KYC"
          value="1 Document"
          note="Tap to upload"
        />
        <div>
          <Metric
            label="Saved Vans"
            value={savedVans.length}
            note="Ready to book"
          />
        </div>
      </div>

      {/* Booking Timeline */}
      <BookingTimeline current={booking.status === "completed" ? 5 : 1} />

      {/* Next Adventure Hero Card */}
      <Card className="overflow-hidden border-sand-200/90 shadow-soft">
        <div className="flex flex-col md:grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[220px] w-full overflow-hidden bg-sand-200">
            <Image
              src={vehicle.images[0]}
              alt={vehicle.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute top-3 left-3 rounded-full bg-forest-900/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sand-100 backdrop-blur-sm">
              Upcoming Trip
            </div>
          </div>

          <div className="flex flex-col justify-between bg-forest-700 p-5 sm:p-7 text-sand-50">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-forest-200">
                Scheduled Self-Drive Van
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-sand-50">
                {vehicle.name}
              </h2>
              <p className="mt-1 text-xs text-forest-100 flex items-center gap-1.5">
                <span>📅 {booking.startDate} to {booking.endDate}</span>
                <span>·</span>
                <span>📍 {booking.pickupLocation}</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-sand-200/90 line-clamp-2">
                Pickup runway confirmed at our Pune base hub. Clean vehicle inspection
                and handover briefing booked for 09:00 AM.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5 pt-2">
              <Button
                onClick={() => go("My Bookings")}
                className="text-xs font-semibold py-2"
              >
                View booking details
              </Button>
              <Button
                variant="outline"
                className="border-forest-400 text-sand-50 hover:bg-forest-600 text-xs py-2"
                onClick={() => go("Support")}
              >
                Need support?
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Action Preview Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <PanelCard
          title="Promo Vouchers"
          subtitle="Seasonal perks for your next journey"
        >
          <p className="text-xs text-sand-600 leading-relaxed">
            Grab up to 20% off long-term camper road trips across the Western Ghats.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs font-semibold"
            onClick={() => go("Offers & Rewards")}
          >
            Explore promo codes <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </PanelCard>

        <PanelCard
          title="Trip Notifications"
          subtitle="Latest updates from base operations"
        >
          <p className="flex items-center gap-2 text-xs text-sand-600">
            <Bell className="h-4 w-4 text-accent-600 shrink-0" />
            <span>Booking confirmation and trip invoice are available.</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-xs font-semibold"
            onClick={() => go("Notifications")}
          >
            View all alerts <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </PanelCard>
      </div>
    </div>
  );
}

function Bookings({
  bookings,
  go,
}: {
  bookings: ReturnType<typeof getBookings>;
  go: (section: SectionName) => void;
}) {
  return (
    <PanelCard
      title="My Bookings"
      subtitle="Track your self-drive bookings, payment slips, and dates."
    >
      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="customer-list-row flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-sand-200/80 bg-white p-4 sm:p-5 shadow-xs transition-colors hover:border-accent-300"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-base sm:text-lg font-bold text-ink">
                  {b.bookingNumber}
                </span>
                <StatusBadge status={b.status} />
              </div>
              <p className="text-xs text-sand-500">
                📅 {b.startDate} to {b.endDate} · 📍 {b.pickupLocation} to{" "}
                {b.dropLocation}
              </p>
              <p className="text-xs font-medium text-ink/80 pt-1">
                Rental: {formatCurrency(b.rentalAmount)} · Deposit (Refundable):{" "}
                {formatCurrency(b.securityDeposit)}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-sand-100">
              <Button size="sm" variant="outline" className="text-xs flex-1 sm:flex-none">
                Receipt
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs flex-1 sm:flex-none"
                onClick={() => go("Support")}
              >
                Help
              </Button>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

function SavedVans({
  savedVans,
  toggleSavedVan,
}: {
  savedVans: ReturnType<typeof getVehicles>;
  toggleSavedVan: (id: string) => void;
}) {
  return (
    <PanelCard
      title="Saved Campers"
      subtitle="Your bookmarked rigs for upcoming escapes."
    >
      {savedVans.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {savedVans.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-sand-200 bg-white p-3.5 shadow-xs"
            >
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-sand-200">
                <Image
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-display text-sm font-bold text-ink">
                  {vehicle.name}
                </p>
                <p className="text-xs text-sand-500">
                  {formatCurrency(vehicle.pricePerDay)} / day
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleSavedVan(vehicle.id)}
                  className="rounded-lg p-1.5 text-sand-400 hover:text-red-500 transition-colors"
                  aria-label="Remove from saved"
                >
                  <Heart className="h-4 w-4 fill-accent-500 text-accent-500" />
                </button>
                <ButtonLink
                  href={`/vans/${vehicle.slug}`}
                  size="sm"
                  className="text-xs py-1 px-2.5"
                >
                  View
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="No saved campers yet. Explore the fleet and tap the heart icon on any van you love." />
      )}
    </PanelCard>
  );
}

function Offers({
  offers,
  go,
}: {
  offers: ReturnType<typeof getOffers>;
  go: (section: SectionName) => void;
}) {
  return (
    <PanelCard
      title="Offers & Rewards"
      subtitle="Exclusive perks, member coupons, and reward balance."
    >
      {/* Wallet Balance Banner */}
      <div className="rounded-xl bg-gradient-to-r from-forest-700 to-forest-800 p-4 sm:p-5 text-sand-50 shadow-soft flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-forest-200">
            Nomad Rewards Wallet
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-sand-50">
            1,240 <span className="text-sm font-normal text-forest-200">pts (₹1,240 value)</span>
          </p>
        </div>
        <span className="rounded-full bg-forest-600/80 px-3 py-1 text-xs font-semibold text-accent-300">
          ⭐ Gold Tier
        </span>
      </div>

      {/* Available Coupons */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-sand-500">
          Available Demo Coupons
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-xl border border-sand-200 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-base font-bold text-ink">
                  {offer.name}
                </p>
                <span className="rounded-md bg-accent-50 px-2 py-0.5 text-xs font-bold text-accent-600">
                  {offer.discountPercent}% OFF
                </span>
              </div>
              <p className="mt-1 text-xs text-sand-500 line-clamp-2">
                {offer.description}
              </p>
              <ButtonLink
                href="/vans"
                variant="outline"
                size="sm"
                className="mt-3 w-full text-xs"
              >
                Apply towards next van
              </ButtonLink>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function Payments({
  bookings,
}: {
  bookings: ReturnType<typeof getBookings>;
}) {
  return (
    <PanelCard
      title="Payments & Security Deposit"
      subtitle="All transaction ledgers and refundable deposit records."
    >
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-sand-200 bg-white p-4 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-ink">
                  {booking.bookingNumber}
                </span>
                <StatusBadge status={booking.paymentStatus} />
              </div>
              <p className="text-xs text-sand-500 mt-0.5">
                Total Charged: {formatCurrency(booking.totalAmount)} (Includes{" "}
                {formatCurrency(booking.securityDeposit)} refundable deposit)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Download Invoice
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-forest-200 bg-forest-50/50 p-4 text-xs text-forest-800">
        <p className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-forest-600" />
          Security Deposit Refund Policy
        </p>
        <p className="mt-1 leading-relaxed text-forest-700">
          The security deposit is released automatically back to your source account
          within 48 hours of vehicle check-in and return inspection.
        </p>
      </div>
    </PanelCard>
  );
}

function Documents({
  customer,
}: {
  customer: ReturnType<typeof getCustomers>[number];
}) {
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const docs = [
    { id: "dl", name: "Driving Licence (LMV 4-Wheeler)", required: true },
    { id: "id", name: "Government Photo ID (Aadhaar / Passport)", required: true },
    { id: "proof", name: "Local Address Proof", required: false },
  ];

  const handleUpload = (id: string) => {
    setUploaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <PanelCard
      title="Driver KYC & Documents"
      subtitle="Self-drive rentals require government-verified driver documentation."
    >
      <div className="space-y-3">
        {docs.map((doc, idx) => {
          const isDone = uploaded[doc.id] || (idx === 0 && customer.documents.length > 0);
          return (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-sand-200 bg-white p-4 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-ink">
                    {doc.name}
                  </span>
                  {doc.required && (
                    <span className="rounded-md bg-accent-50 px-1.5 py-0.2 text-[10px] font-bold text-accent-600">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-sand-500 mt-0.5">
                  {isDone ? "Document uploaded & verified ✅" : "Pending upload (PDF or JPG)"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={isDone ? "verified" : "pending"} />
                {!isDone && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => handleUpload(doc.id)}
                  >
                    <Upload className="h-3 w-3 mr-1" /> Upload
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PanelCard>
  );
}

function Notifications() {
  const alerts = [
    { title: "Booking Confirmation Ready", text: "Your booking TOW-DEMO-2026-0418 is confirmed.", time: "2 hours ago", unread: true },
    { title: "Payment Recorded", text: "Payment of ₹15,000 received for Pune departure.", time: "1 day ago", unread: true },
    { title: "Pickup Checklist", text: "Download your 10-point camper handover guide.", time: "2 days ago", unread: false },
    { title: "Seasonal Voucher Unlocked", text: "Use code MONSOON20 for 20% off long road trips.", time: "4 days ago", unread: false },
  ];

  return (
    <PanelCard
      title="Notifications & Dispatches"
      subtitle="Real-time alerts regarding your bookings and road trips."
    >
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl p-3.5 sm:p-4 transition-colors ${
              a.unread ? "bg-accent-50/70 border border-accent-200/70" : "bg-white border border-sand-200/80"
            }`}
          >
            <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${a.unread ? "text-accent-600" : "text-sand-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-xs text-ink">{a.title}</p>
                <span className="text-[10px] text-sand-500">{a.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-sand-600 leading-relaxed">
                {a.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

function Support({
  settings,
}: {
  settings: ReturnType<typeof getSettings>;
}) {
  return (
    <PanelCard
      title="Support & Roadside Assist"
      subtitle="Direct access to our expedition base team and 24/7 mechanics."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`tel:${settings.phone}`}
          className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white p-4 shadow-xs hover:border-accent-400 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-sand-500">
              Dispatch Hotline
            </p>
            <p className="text-xs font-bold text-ink">{settings.phone}</p>
          </div>
        </a>

        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs hover:bg-emerald-50 transition-colors"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              WhatsApp Concierge
            </p>
            <p className="text-xs font-bold text-emerald-900">Chat with Fleet Team</p>
          </div>
        </a>
      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50/60 p-4 text-xs text-red-900">
        <p className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-red-600" />
          Emergency 24/7 Roadside Assistance
        </p>
        <p className="mt-1 leading-relaxed text-red-800">
          In case of tyre puncture, flat auxiliary battery, or engine overheating,
          call our 24/7 roadside assist team directly at +91 98765 43210.
        </p>
      </div>
    </PanelCard>
  );
}

function Profile({
  customer,
}: {
  customer: ReturnType<typeof getCustomers>[number];
}) {
  const [saved, setSaved] = useState(false);

  return (
    <PanelCard
      title="My Profile"
      subtitle="Update your contact credentials and emergency information."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name">
          <Input defaultValue={customer.name} className="text-sm" />
        </FormField>
        <FormField label="Email Address">
          <Input defaultValue={customer.email} type="email" className="text-sm" />
        </FormField>
        <FormField label="Mobile Number">
          <Input defaultValue={customer.phone} type="tel" className="text-sm" />
        </FormField>
        <FormField label="Date of Birth">
          <Input
            type="date"
            defaultValue={customer.dateOfBirth}
            className="text-sm"
          />
        </FormField>
        <FormField label="Base City / State" className="sm:col-span-2">
          <Input
            defaultValue={`${customer.city}, Maharashtra`}
            className="text-sm"
          />
        </FormField>
        <FormField label="Emergency Contact (Name & Phone)" className="sm:col-span-2">
          <Input placeholder="e.g. Ramesh Sharma (+91 98765 12345)" className="text-sm" />
        </FormField>

        <div className="sm:col-span-2 pt-2">
          <Button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="text-xs font-semibold py-2.5"
          >
            {saved ? "Profile Saved Successfully! ✨" : "Save Profile Changes"}
          </Button>
        </div>
      </div>
    </PanelCard>
  );
}

function AccountSettings() {
  const [saved, setSaved] = useState(false);

  return (
    <PanelCard
      title="Account Settings"
      subtitle="Configure communication channels and authentication."
    >
      <div className="space-y-4">
        <div className="space-y-2 rounded-xl border border-sand-200 bg-white p-4">
          <label className="flex items-center gap-2.5 text-xs cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-orange-500" />
            <span>Email booking confirmations & route notes</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-orange-500" />
            <span>WhatsApp pickup and return alerts</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-orange-500" />
            <span>Exclusive seasonal promotions & rewards</span>
          </label>
        </div>

        <FormField label="Change Account Password">
          <Input
            type="password"
            placeholder="Enter new password (min. 8 characters)"
            className="text-sm"
          />
        </FormField>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <Button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="text-xs font-semibold"
          >
            {saved ? "Preferences Updated! ✨" : "Save Preferences"}
          </Button>
          <Button variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50">
            Deactivate Demo Account
          </Button>
        </div>
      </div>
    </PanelCard>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-sand-300 bg-white p-8 text-center text-xs text-sand-500">
      <Heart className="mx-auto h-8 w-8 text-accent-500" />
      <p className="mx-auto mt-3 max-w-sm leading-relaxed">{text}</p>
      <ButtonLink href="/vans" className="mt-4 text-xs font-semibold">
        Explore the fleet <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </ButtonLink>
    </div>
  );
}
