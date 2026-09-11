"use client";

import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Copy,
  CreditCard,
  FileText,
  Gauge,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  UserRound,
  Users,
  Van,
  X,
  Phone,
  Mail,
  Zap,
} from "lucide-react";
import {
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  FormField,
  Input,
  Select,
  StatusBadge,
  Textarea,
} from "@/components/ui";
import { PageContent } from "@/components/layout/PageBanner";
import {
  getActiveOffers,
  getAllReviews,
  getAverageRating,
  getBookings,
  getCustomers,
  getDashboardStats,
  getDestinations,
  getFaqsByCategory,
  getFeaturedVehicle,
  getOffers,
  getSettings,
  getVehicles,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { PICKUP_LOCATIONS, DEFAULT_ADVANCE_BOOKING_DAYS } from "@/lib/constants";
import type { Booking, Review } from "@/lib/types";
import { useVansStore } from "@/lib/store/VansStore";
import { createClient } from "@/utils/supabase/client";

function Banner({
  eyebrow,
  title,
  description,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <section className="bg-sand-50 pt-3 sm:pt-4">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-ink px-5 py-8 text-sand-50 sm:rounded-3xl sm:px-8 sm:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgb(249_115_22/0.14),transparent_50%),radial-gradient(circle_at_85%_15%,rgb(45_107_79/0.18),transparent_50%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow text-accent-400">{eyebrow}</p>
              {badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-500/40 bg-forest-900/60 px-3 py-0.5 text-xs font-semibold text-forest-200 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-accent-400" />
                  {badge}
                </span>
              )}
            </div>
            <h1 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-[1.1] tracking-tight text-sand-50 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sand-300 sm:text-base">
              {description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function OffersPage() {
  const offers = getOffers();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);

  const promoCodes: Record<string, string> = {
    "off-monsoon": "MONSOON20",
    "off-long-stay": "NOMADWEEK",
    "off-early-bird": "EARLYROAD",
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText?.(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <>
      <Banner
        eyebrow="Adventure Perks"
        badge="Live Promo Vouchers"
        title="More miles, lighter budget."
        description="Seasonal voucher codes designed for longer stays and multi-day Sahyadri road trips. Copy your code and apply at checkout."
      />
      <PageContent>
        {/* Voucher Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, index) => {
            const code = promoCodes[offer.id] || `WANDER${offer.discountPercent}`;
            const isCopied = copiedCode === offer.id;

            return (
              <div
                key={offer.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sand-200/90 bg-sand-50 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
              >
                {/* Header Ticket Banner */}
                <div
                  className={`p-6 text-white ${
                    index === 1
                      ? "bg-gradient-to-br from-forest-700 to-forest-800"
                      : "bg-gradient-to-br from-accent-500 to-accent-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      Voucher #{index + 1}
                    </span>
                    <StatusBadge status={offer.status} />
                  </div>

                  <div className="mt-4 flex items-baseline">
                    <span className="font-display text-5xl font-bold tracking-tight">
                      {offer.discountPercent}%
                    </span>
                    <span className="ml-2 text-sm font-bold uppercase tracking-widest text-white/80">
                      OFF RENTAL
                    </span>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative flex items-center justify-between bg-sand-100 px-4 py-1.5 border-y border-dashed border-sand-300">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
                    Promo Code:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode(offer.id, code)}
                    className="flex items-center gap-1.5 rounded-md bg-sand-50 px-2.5 py-1 text-xs font-mono font-bold text-ink hover:bg-white shadow-xs transition-colors"
                  >
                    {code}
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-forest-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-sand-400" />
                    )}
                  </button>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-xl font-bold text-ink">
                    {offer.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-sand-600 line-clamp-2">
                    {offer.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 text-xs text-sand-600 border-t border-sand-200/60 pt-3">
                    {offer.terms.map((term) => (
                      <li key={term} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-accent-500 mt-0.5" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-2">
                    <Button
                      className="w-full text-xs font-semibold"
                      variant={index === 1 ? "primary" : "outline"}
                      onClick={() => copyCode(offer.id, code)}
                    >
                      {isCopied ? "Code Copied to Clipboard! ✨" : `Copy ${code} & Book`}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Refer a Friend Gen-Z Box */}
        <section className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 p-8 text-sand-50 shadow-elevated sm:p-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-forest-600/60 px-3 py-1 text-xs font-semibold text-accent-300">
                <Sparkles className="h-3.5 w-3.5" /> Pass The Keys
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
                Share the road. Split the rewards.
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-forest-100 sm:text-sm">
                Give your friends ₹2,000 off their first camper booking. When
                they return with dirt on the tyres, you get ₹2,000 credit in
                your nomad wallet.
              </p>
            </div>

            <div className="rounded-xl bg-forest-800/80 p-5 border border-forest-600/70 text-center sm:min-w-[260px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent-300">
                Your Referral Link
              </p>
              <div className="mt-2 rounded-lg bg-forest-950/60 px-3 py-2 text-xs font-mono text-sand-200">
                travelonwheels.in/r/nomad-crew
              </div>
              <Button
                className="mt-3 w-full text-xs"
                onClick={() => {
                  navigator.clipboard?.writeText?.(
                    "https://travelonwheels.in/r/nomad-crew"
                  );
                  setReferralCopied(true);
                  setTimeout(() => setReferralCopied(false), 2500);
                }}
              >
                {referralCopied ? "Link Copied! 🚀" : "Copy Invite Link"}
              </Button>
            </div>
          </div>
        </section>
      </PageContent>
    </>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const avatarInitials = review.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-sand-200/80 bg-sand-50 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 text-accent-500">
            {Array.from({ length: review.rating }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="rounded-full bg-forest-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">
            📍 {review.destination}
          </span>
        </div>

        <p className="mt-5 font-display text-base font-semibold leading-relaxed text-ink sm:text-lg">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-sand-200/60 pt-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 font-display text-xs font-bold text-white shadow-xs">
            {avatarInitials}
          </div>
          <div>
            <strong className="block text-ink">{review.customerName}</strong>
            <span className="text-[10px] text-sand-500">Verified Self-Drive Trip</span>
          </div>
        </div>
        <span className="rounded-md bg-sand-100 px-2 py-0.5 text-[10px] font-medium text-sand-600">
          ⭐ 5.0 Review
        </span>
      </div>
    </article>
  );
}

export function ReviewsPage() {
  const reviews = getAllReviews();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(5);

  return (
    <>
      <Banner
        eyebrow="Wanderer Testimonials"
        badge="100% Real Road Trips"
        title="Good trips. Great company."
        description="Unfiltered dispatches from travellers who traded hotel rooms for campfire horizons and quiet hilltop sunrises."
      />
      <PageContent>
        {/* Rating Metrics Header */}
        <div className="grid gap-6 overflow-hidden rounded-2xl bg-forest-700 p-6 text-sand-50 shadow-soft sm:grid-cols-3 sm:p-10">
          <div>
            <p className="text-xs font-semibold text-forest-200 uppercase tracking-wider">
              Average Rating
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="font-display text-5xl font-bold text-sand-50">
                {getAverageRating()}
              </p>
              <span className="text-sm text-forest-200">/ 5.0</span>
            </div>
            <div className="mt-2 flex text-accent-300">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-forest-200 uppercase tracking-wider">
              Total Road Trips
            </p>
            <p className="mt-1 font-display text-5xl font-bold text-sand-50">
              {reviews.length * 28}+
            </p>
            <p className="mt-2 text-xs text-forest-200">
              Across Maharashtra & Western Ghats routes
            </p>
          </div>

          <div className="flex flex-col justify-end sm:items-end">
            <Button onClick={() => setOpen(true)} className="text-xs font-semibold">
              Share your trip story <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Interactive Submit Modal */}
        {open && (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-accent-200 bg-accent-50/70 p-6 sm:p-8 shadow-soft backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow">Trip Log</span>
                <h2 className="font-display text-2xl font-bold">
                  Tell us about your road trip
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close review form"
                className="rounded-lg p-2 hover:bg-accent-100 transition-colors"
              >
                <X className="h-5 w-5 text-ink/70" />
              </button>
            </div>

            {sent ? (
              <div className="py-10 text-center">
                <Check className="mx-auto h-12 w-12 text-forest-600" />
                <p className="mt-3 font-display text-2xl font-bold">
                  Story logged into demo dispatch.
                </p>
                <p className="mt-1 text-xs text-sand-500">
                  Thanks for contributing to the camper community!
                </p>
                <Button
                  variant="outline"
                  className="mt-5 text-xs"
                  onClick={() => {
                    setSent(false);
                    setOpen(false);
                  }}
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div>
                  <p className="mb-1 text-xs font-semibold text-ink">
                    Your Trip Rating
                  </p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-label={`${value} stars`}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            value <= rating
                              ? "fill-accent-500 text-accent-500"
                              : "text-sand-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <FormField label="Your Road Trip Story">
                  <Textarea
                    placeholder="Where did you park? What did the sunset feel like from the van roof?"
                    rows={4}
                  />
                </FormField>

                <FormField label="Route / Destination Tag">
                  <Input placeholder="e.g. Tapola Backwaters / Mahabaleshwar Sunset Ridge" />
                </FormField>

                <div className="pt-2">
                  <Button onClick={() => setSent(true)} className="text-xs font-semibold">
                    Submit demo trip review
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </PageContent>
    </>
  );
}

const faqGroups = [
  "booking",
  "vehicle",
  "self_drive",
  "payment",
  "security_deposit",
  "cancellation",
  "fuel",
  "pickup_return",
] as const;

export function FAQPage() {
  const [category, setCategory] = useState<(typeof faqGroups)[number]>("booking");
  const [faqSearch, setFaqSearch] = useState("");

  const faqs = useMemo(() => {
    const list = getFaqsByCategory(category);
    if (!faqSearch.trim()) return list;
    return list.filter(
      (f) =>
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase())
    );
  }, [category, faqSearch]);

  return (
    <>
      <Banner
        eyebrow="The Knowledge Base"
        badge="Zero Jargon Answers"
        title="Everything you need to know."
        description="Straightforward answers about driving licences, solar power, refundable deposits, and picking up your camper in Pune."
      />
      <PageContent>
        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-sand-400" />
          <Input
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder="Search FAQs (e.g. driving licence, deposit, pet friendly)..."
            className="pl-10 text-sm"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Categories Sidebar */}
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {faqGroups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setCategory(group)}
                className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-xs font-semibold capitalize transition-all duration-200 ${
                  category === group
                    ? "bg-forest-700 text-sand-50 shadow-soft"
                    : "bg-sand-100 text-ink/70 hover:bg-sand-200"
                }`}
              >
                {group.replace("_", " ")}
              </button>
            ))}
          </nav>

          {/* Accordion List */}
          <div className="divide-y divide-sand-200/80">
            {faqs.length > 0 ? (
              faqs.map((item) => (
                <details key={item.id} className="group py-5 first:pt-0">
                  <summary className="flex cursor-pointer list-none justify-between gap-5 font-display text-lg font-bold transition-colors group-open:text-accent-600">
                    <span>{item.question}</span>
                    <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 max-w-2xl text-xs leading-relaxed text-sand-600 sm:text-sm">
                    {item.answer}
                  </p>
                </details>
              ))
            ) : (
              <div className="py-10 text-center text-sand-500">
                <p className="text-sm font-semibold">No questions matched &quot;{faqSearch}&quot;</p>
                <button
                  type="button"
                  onClick={() => setFaqSearch("")}
                  className="mt-2 text-xs font-semibold text-accent-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
}

export function ContactPage() {
  const settings = getSettings();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <Banner
        eyebrow="Pune Base Operations"
        badge="24/7 Roadside Assist"
        title="Plan your route with our crew."
        description="Questions about route clearance, off-grid battery capability, or campsite permits? Drop us a note or call our dispatch."
      />
      <PageContent>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Contact Form Card */}
          <Card className="border-sand-200/80 shadow-soft">
            <CardContent className="p-6 sm:p-8 space-y-4">
              {sent ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-100">
                    <Check className="h-7 w-7 text-forest-600" />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold">
                    Message Dispatched!
                  </h2>
                  <p className="mt-1 text-xs text-sand-500">
                    Our Pune trip planner will reach out within a few hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 text-xs"
                    onClick={() => setSent(false)}
                  >
                    Send another inquiry
                  </Button>
                </div>
              ) : (
                <>
                  <div className="border-b border-sand-200/60 pb-3">
                    <span className="eyebrow">Direct Dispatch</span>
                    <h2 className="font-display text-xl font-bold text-ink">
                      Send an expedition inquiry
                    </h2>
                  </div>
                  <FormField label="Your Full Name" required>
                    <Input placeholder="Aarav Sharma" className="text-sm" />
                  </FormField>
                  <FormField label="Email Address" required>
                    <Input
                      type="email"
                      placeholder="aarav@example.com"
                      className="text-sm"
                    />
                  </FormField>
                  <FormField label="Phone / WhatsApp" required>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="text-sm"
                    />
                  </FormField>
                  <FormField label="Your Trip Plan / Query" required>
                    <Textarea
                      placeholder="Tell us about your dates, crew size, and preferred direction..."
                      rows={4}
                      className="text-sm"
                    />
                  </FormField>
                  {error && (
                    <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
                      {error}
                    </p>
                  )}
                  <Button
                    onClick={() => {
                      setError("");
                      setSent(true);
                    }}
                    className="w-full text-xs font-semibold py-3"
                  >
                    Send message to dispatch <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Base Hub Details */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-sand-200/80 bg-sand-50 p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent-500" />
                <h3 className="font-display text-lg font-bold">
                  Camper Van Hub Pune
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-sand-600">
                {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
              </p>
              <p className="mt-2 text-[11px] font-mono text-sand-500">
                GPS: 18.5204° N, 73.8567° E · 15 mins from Pune Expressway
              </p>
            </div>

            {/* Direct Connect Buttons */}
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${settings.phone}`}
                className="group flex items-center gap-3 rounded-2xl border border-sand-200/80 bg-sand-50 p-4 shadow-soft transition-all duration-200 hover:border-accent-500 hover:bg-sand-100/60"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600 group-hover:scale-105 transition-transform">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-sand-500">
                    Call Dispatch
                  </span>
                  <strong className="text-xs font-semibold text-ink">
                    {settings.phone}
                  </strong>
                </div>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="group flex items-center gap-3 rounded-2xl border border-sand-200/80 bg-sand-50 p-4 shadow-soft transition-all duration-200 hover:border-accent-500 hover:bg-sand-100/60"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-600 group-hover:scale-105 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-sand-500">
                    Email Team
                  </span>
                  <strong className="text-xs font-semibold text-ink break-all">
                    {settings.email}
                  </strong>
                </div>
              </a>
            </div>

            {/* WhatsApp Callout */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <div className="flex items-center gap-2 text-emerald-800 font-display font-bold">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                <h4>Prefer WhatsApp?</h4>
              </div>
              <p className="mt-1 text-xs text-emerald-700">
                Ping our fleet manager directly for live van videos and campsite recommendations.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                Chat on WhatsApp <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}

export function BookingPage() {
  const vehicle = getFeaturedVehicle()!;
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [done, setDone] = useState(false);
  const steps = [
    "Van",
    "Dates",
    "Location",
    "Customer",
    "Eligibility",
    "Summary",
    "Terms",
    "Payment",
  ];
  const rental = vehicle.pricePerDay * 3;

  if (done)
    return (
      <>
        <Banner
          eyebrow="Booking confirmed"
          badge="Demo Confirmation"
          title="Your road trip is on the calendar."
          description="This confirmation is a static demo. Nothing was charged or stored."
        />
        <PageContent>
          <Card className="mx-auto max-w-2xl shadow-soft">
            <CardContent className="p-8 sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-100">
                <Check className="h-7 w-7 text-forest-600" />
              </div>
              <p className="mt-6 eyebrow">Booking ID</p>
              <h2 className="mt-1 font-display text-3xl font-bold tracking-tight">
                TOW-DEMO-2026-0418
              </h2>
              <p className="mt-2 text-xs text-sand-500">
                {vehicle.name} · 3 days · Pune pickup
              </p>
              <div className="mt-6 space-y-3 border-t border-sand-200/60 pt-5 text-xs">
                <p className="flex justify-between">
                  <span>Rental · 3 × {formatCurrency(vehicle.pricePerDay)}</span>
                  <strong>{formatCurrency(rental)}</strong>
                </p>
                <p className="flex justify-between">
                  <span>Refundable security deposit</span>
                  <strong>{formatCurrency(vehicle.securityDeposit)}</strong>
                </p>
                <p className="flex justify-between text-accent-700">
                  <span>Fuel</span>
                  <strong>Customer responsibility</strong>
                </p>
                <p className="flex justify-between border-t border-sand-200/60 pt-3 font-bold text-base">
                  <span>Total</span>
                  <strong>
                    {formatCurrency(rental + vehicle.securityDeposit)}
                  </strong>
                </p>
              </div>
              <ButtonLink href="/account" className="mt-6">
                Open dashboard
              </ButtonLink>
            </CardContent>
          </Card>
        </PageContent>
      </>
    );

  return (
    <>
      <Banner
        eyebrow={`Step ${step + 1} of ${steps.length}`}
        badge="Self-Drive Checkout"
        title="Make room for a better trip."
        description="A complete static booking flow. It resets when you refresh."
      />
      <PageContent>
        {/* Stepper Pills */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((item, index) => (
            <span
              key={item}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                index === step
                  ? "bg-accent-500 text-white shadow-sm"
                  : index < step
                  ? "bg-forest-100 text-forest-700"
                  : "bg-sand-100 text-sand-500"
              }`}
            >
              {index + 1}. {item}
            </span>
          ))}
        </div>

        <Card className="shadow-soft">
          <CardContent className="p-6 sm:p-9">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {steps[step]}
            </h2>

            {step === 0 && (
              <div className="mt-6 rounded-2xl border-2 border-accent-500 p-5 bg-sand-50">
                <p className="font-display text-xl font-bold">{vehicle.name}</p>
                <p className="mt-1 text-xs text-sand-500">
                  {vehicle.passengerCapacity} travellers ·{" "}
                  {formatCurrency(vehicle.pricePerDay)} per day
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FormField label="Pickup date">
                  <Input
                    type="date"
                    min={new Date(
                      Date.now() + DEFAULT_ADVANCE_BOOKING_DAYS * 86400000
                    )
                      .toISOString()
                      .slice(0, 10)}
                  />
                </FormField>
                <FormField label="Return date">
                  <Input type="date" />
                </FormField>
                <p className="sm:col-span-2 rounded-xl bg-accent-50 p-3 text-xs text-accent-700">
                  Notice: Dates inside the {DEFAULT_ADVANCE_BOOKING_DAYS}-day
                  advance window are disabled for deep cleaning.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FormField label="Pickup location">
                  <Select
                    options={PICKUP_LOCATIONS.map((location) => ({
                      value: location,
                      label: location,
                    }))}
                  />
                </FormField>
                <FormField label="Return location">
                  <Select
                    options={PICKUP_LOCATIONS.map((location) => ({
                      value: location,
                      label: location,
                    }))}
                  />
                </FormField>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FormField label="Full name">
                  <Input placeholder="Your name" />
                </FormField>
                <FormField label="Phone">
                  <Input type="tel" placeholder="+91 98765 43210" />
                </FormField>
                <FormField label="Email" className="sm:col-span-2">
                  <Input type="email" placeholder="you@example.com" />
                </FormField>
              </div>
            )}

            {step === 4 && (
              <div className="mt-6 rounded-2xl bg-sand-100 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-100">
                  <FileText className="h-5 w-5 text-forest-600" />
                </div>
                <p className="mt-3 font-semibold text-sm">Eligibility & Documents</p>
                <p className="mt-1 text-xs leading-relaxed text-sand-500">
                  Bring a valid Indian driving licence and government ID. Document
                  upload and verification are visual placeholders in this demo.
                </p>
                <Button variant="outline" className="mt-4 text-xs">
                  Add document placeholder
                </Button>
              </div>
            )}

            {step === 5 && (
              <div className="mt-6 space-y-3 text-xs">
                <p className="flex justify-between">
                  <span>Rental · 3 × {formatCurrency(vehicle.pricePerDay)}</span>
                  <strong>{formatCurrency(rental)}</strong>
                </p>
                <p className="flex justify-between">
                  <span>Security deposit</span>
                  <strong>{formatCurrency(vehicle.securityDeposit)}</strong>
                </p>
                <p className="flex justify-between text-accent-700">
                  <span>Fuel</span>
                  <strong>Customer responsibility</strong>
                </p>
                <p className="flex justify-between border-t border-sand-200/60 pt-3 font-bold text-base">
                  <span>Total</span>
                  <strong>
                    {formatCurrency(rental + vehicle.securityDeposit)}
                  </strong>
                </p>
              </div>
            )}

            {step === 6 && (
              <label className="mt-6 flex gap-3 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  className="mt-0.5 accent-orange-500"
                />
                <span>
                  I accept the rental agreement, cancellation policy, and
                  self-drive conditions.
                </span>
              </label>
            )}

            {step === 7 && (
              <div className="mt-6 rounded-2xl border border-dashed border-sand-300 p-8 text-center">
                <CreditCard className="mx-auto h-8 w-8 text-sand-400" />
                <p className="mt-2 font-semibold text-sm">Dummy payment step</p>
                <p className="mt-1 text-xs text-sand-500">
                  No gateway or payment will be used.
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-between border-t border-sand-200/60 pt-5">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((current) => current - 1)}
                className="text-xs"
              >
                Back
              </Button>
              <Button
                disabled={step === 6 && !accepted}
                onClick={() =>
                  step === steps.length - 1
                    ? setDone(true)
                    : setStep((current) => current + 1)
                }
                className="text-xs font-semibold"
              >
                {step === steps.length - 1 ? "Pay now (demo)" : "Continue"}{" "}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}

export function AuthPage({
  mode,
  nextPath = "/account",
  admin = false,
}: {
  mode: "login" | "signup" | "forgot";
  nextPath?: string;
  admin?: boolean;
}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);

  if (done)
    return (
      <PageContent className="min-h-[65vh] bg-sand-100">
        <Card className="mx-auto max-w-lg p-8 text-center shadow-soft">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-100">
            <Check className="h-7 w-7 text-forest-600" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">
            Demo access granted.
          </h1>
          <p className="mt-2 text-xs text-sand-500">
            No credentials were checked and no session was stored.
          </p>
          <ButtonLink href={admin ? "/admin" : nextPath} className="mt-6 text-xs">
            Continue
          </ButtonLink>
        </Card>
      </PageContent>
    );

  const submit = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 450);
  };

  return (
    <div className="bg-sand-100 py-12 sm:py-20">
      <Container>
        <Card className="mx-auto max-w-lg p-6 sm:p-9 shadow-soft">
          <p className="eyebrow">{admin ? "Admin only" : "Your account"}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {mode === "signup"
              ? "Start your story."
              : mode === "forgot"
              ? "Reset your password."
              : admin
              ? "Enter the operations demo."
              : "Welcome back."}
          </h1>
          <p className="mt-1 text-xs text-sand-500">
            {admin
              ? "A separate static admin entry point for the team."
              : "Frontend-only demo. Nothing is authenticated."}
          </p>

          <div className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <FormField label="Full name">
                  <Input placeholder="Your name" className="text-sm" />
                </FormField>
                <FormField label="Phone">
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="text-sm"
                  />
                </FormField>
              </>
            )}
            <FormField label="Email">
              <Input
                type="email"
                placeholder="you@example.com"
                className="text-sm"
              />
            </FormField>
            {mode !== "forgot" && (
              <>
                <FormField label="Password">
                  <Input
                    type="password"
                    placeholder="At least 8 characters"
                    className="text-sm"
                  />
                </FormField>
                {mode === "signup" && (
                  <FormField label="Confirm password">
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      className="text-sm"
                    />
                  </FormField>
                )}
              </>
            )}
            {mode === "signup" && (
              <label className="flex gap-2.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(event) => setTerms(event.target.checked)}
                  className="mt-0.5 accent-orange-500"
                />
                <span>I accept the demo terms and privacy notice.</span>
              </label>
            )}
            <Button
              className="w-full text-xs font-semibold py-2.5"
              loading={loading}
              disabled={mode === "signup" && !terms}
              onClick={submit}
            >
              {mode === "signup"
                ? "Create demo account"
                : mode === "forgot"
                ? "Send reset link"
                : admin
                ? "Enter admin demo"
                : "Log in"}
            </Button>
          </div>

          <div className="mt-5 flex justify-between text-xs text-forest-600">
            {!admin && mode === "login" && (
              <>
                <ButtonLink href="/signup" variant="link" size="sm">
                  Create account
                </ButtonLink>
                <ButtonLink href="/forgot-password" variant="link" size="sm">
                  Forgot password?
                </ButtonLink>
              </>
            )}
            {!admin && mode !== "login" && (
              <ButtonLink href="/login" variant="link" size="sm">
                Back to login
              </ButtonLink>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}

const customerTabs = [
  "Overview",
  "Bookings",
  "Profile",
  "Documents",
  "Reviews",
  "Notifications",
  "Settings",
] as const;

export function CustomerDashboardPage() {
  const [tab, setTab] = useState<(typeof customerTabs)[number]>("Overview");
  const bookings = getBookings();
  const customer = getCustomers()[0];
  const vehicle = getFeaturedVehicle()!;
  const tabIcons = [
    LayoutDashboard,
    ClipboardList,
    UserRound,
    FileText,
    Star,
    Bell,
    Settings,
  ];

  return (
    <div className="bg-sand-100">
      <section className="border-b border-sand-200 bg-sand-50">
        <Container className="py-8">
          <p className="eyebrow">Your account</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Good to see you, {customer.name.split(" ")[0]}.
          </h1>
        </Container>
      </section>

      <Container className="grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1.5 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {customerTabs.map((item, index) => {
            const Icon = tabIcons[index];
            return (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`flex min-w-fit items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-200 ${
                  tab === item
                    ? "bg-forest-700 text-sand-50 shadow-soft"
                    : "text-ink/70 hover:bg-sand-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item}
              </button>
            );
          })}
          <ButtonLink
            href="/"
            variant="ghost"
            className="mt-4 hidden w-full justify-start text-xs lg:inline-flex"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </ButtonLink>
        </aside>

        <main>
          {tab === "Overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Total trips", customer.totalBookings],
                  ["Next trip", "4 days"],
                  ["Pending actions", 2],
                ].map(([label, value]) => (
                  <Card key={String(label)} className="shadow-soft">
                    <CardContent className="p-5">
                      <p className="text-xs text-sand-500">{label}</p>
                      <p className="mt-1 font-display text-2xl font-bold">
                        {value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6 overflow-hidden shadow-soft">
                <div className="relative bg-gradient-to-br from-forest-700 to-forest-800 p-6 text-sand-50 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-200">
                    Upcoming Confirmed Trip
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-sand-50 sm:text-3xl">
                    {vehicle.name}
                  </h2>
                  <p className="mt-1 text-xs text-forest-200">
                    10 Apr – 14 Apr · Pune Base Hub pickup
                  </p>
                  <ButtonLink
                    href="/account/bookings"
                    className="mt-5 text-xs font-semibold"
                  >
                    View trip details <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </ButtonLink>
                </div>
              </Card>

              <Card className="mt-6 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-base">Trip Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center gap-2.5 text-xs text-sand-600">
                    <Bell className="h-4 w-4 text-accent-600 shrink-0" />
                    Your pickup checklist and GPS coordinates are ready.
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {tab === "Bookings" && <DashboardBookings bookings={bookings} />}

          {tab === "Profile" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
                <FormField label="Name">
                  <Input defaultValue={customer.name} className="text-sm" />
                </FormField>
                <FormField label="Email">
                  <Input defaultValue={customer.email} className="text-sm" />
                </FormField>
                <FormField label="Phone">
                  <Input defaultValue={customer.phone} className="text-sm" />
                </FormField>
                <FormField label="City">
                  <Input defaultValue={customer.city} className="text-sm" />
                </FormField>
                <Button className="text-xs font-semibold">Save changes</Button>
              </CardContent>
            </Card>
          )}

          {tab === "Documents" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Verification Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ...customer.documents,
                  {
                    id: "doc-demo",
                    fileName: "Identity proof (Aadhaar / Passport)",
                    status: "pending",
                    uploadedAt: "Not uploaded",
                  },
                ].map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between border-b border-sand-200/60 pb-3"
                  >
                    <div>
                      <p className="font-semibold text-xs">{document.fileName}</p>
                      <p className="text-[10px] text-sand-500">
                        {document.uploadedAt}
                      </p>
                    </div>
                    <StatusBadge status={document.status} />
                  </div>
                ))}
                <Button variant="outline" className="mt-2 text-xs">
                  Upload document placeholder
                </Button>
              </CardContent>
            </Card>
          )}

          {tab === "Reviews" && (
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <Star className="h-6 w-6 text-accent-500" />
                <h2 className="mt-3 font-display text-xl font-bold">
                  Review completed trips
                </h2>
                <p className="mt-1 text-xs text-sand-500">
                  Review submission unlocks right after completing your journey.
                </p>
                <Button className="mt-4 text-xs font-semibold">
                  Write a review
                </Button>
              </CardContent>
            </Card>
          )}

          {tab === "Notifications" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Notifications Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Booking confirmation received",
                  "Payment confirmation received",
                  "Pickup reminder: 24 hours to go",
                  "Return checklist updated",
                ].map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2.5 border-b border-sand-200/60 pb-3 text-xs text-sand-600"
                  >
                    <Bell className="h-4 w-4 text-accent-600 shrink-0" />
                    {item}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {tab === "Settings" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <label className="flex gap-2.5 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-orange-500" />
                  <span>Email booking updates & offline maps</span>
                </label>
                <label className="flex gap-2.5 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-orange-500" />
                  <span>WhatsApp road trip alerts</span>
                </label>
                <FormField label="New password">
                  <Input type="password" placeholder="New password" className="text-sm" />
                </FormField>
                <Button className="text-xs font-semibold">Save preferences</Button>
              </CardContent>
            </Card>
          )}
        </main>
      </Container>
    </div>
  );
}

function DashboardBookings({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState("all");
  const visible =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <CardTitle className="text-base">My bookings</CardTitle>
          <Select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            options={[
              { value: "all", label: "All bookings" },
              { value: "confirmed", label: "Upcoming" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visible.map((booking) => (
          <div
            key={booking.id}
            className="grid gap-2.5 border-b border-sand-200/60 pb-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
          >
            <div>
              <p className="font-semibold text-xs text-ink">
                {booking.bookingNumber}
              </p>
              <p className="text-[11px] text-sand-500">
                {booking.pickupLocation} · {booking.startDate} to {booking.endDate}
              </p>
              <p className="mt-1 font-semibold text-accent-600 text-xs">
                {formatCurrency(booking.totalAmount)}
              </p>
            </div>
            <StatusBadge status={booking.status} />
            <Button variant="outline" size="sm" className="text-xs">
              View details
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   ADMIN SECTIONS BELOW — PRESERVED EXACTLY AS ORIGINAL (SaaS/clean)
   ───────────────────────────────────────────────────────────────────── */

function AdminUtilityBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-8">
      <div className="relative min-w-[220px] flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search bookings, customers, vans..."
          className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
        />
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
        </button>
        {open && (
          <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="mt-2 border-b border-slate-100 pb-2 text-xs text-slate-600">
              New booking and payment updates will appear here.
            </p>
            <p className="pt-2 text-xs text-slate-500">
              Search is ready for backend indexing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const sections = [
    {
      label: "Overview",
      links: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      label: "Operations",
      links: [
        { label: "Vehicles", href: "/admin/vehicles", icon: Van },
        { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
        { label: "Availability", href: "/admin/availability", icon: CalendarDays },
        { label: "Customers", href: "/admin/customers", icon: Users },
      ],
    },
    {
      label: "Finance",
      links: [{ label: "Pricing", href: "/admin/pricing", icon: CircleDollarSign }],
    },
    {
      label: "Content",
      links: [
        { label: "Offers", href: "/admin/offers", icon: Gauge },
        { label: "Reviews", href: "/admin/reviews", icon: Star },
        { label: "Packages", href: "/admin/packages", icon: Package },
      ],
    },
    {
      label: "System",
      links: [
        { label: "Settings", href: "/admin/settings", icon: Settings },
        { label: "Logout", href: "/admin/login", icon: LogOut },
      ],
    },
  ];
  const links = sections.flatMap((section) => section.links);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-shell h-screen overflow-hidden bg-[#f1f2ef] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden h-screen w-60 overflow-y-auto border-r border-slate-200 bg-white p-4 pb-16 lg:block">
        <div className="border-b border-slate-200 pb-6">
          <p className="font-display text-xl font-bold">TOW / Admin</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
            Operations workspace
          </p>
        </div>
        <nav className="mt-6 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.links.map(({ label, href, icon: Icon }) => {
                  const active =
                    href === "/admin"
                      ? pathname === href
                      : pathname.startsWith(href);
                  if (label === "Logout") {
                    return (
                      <button
                        key={href}
                        type="button"
                        onClick={() => void handleLogout()}
                        className="flex w-full items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    );
                  }
                  return (
                    <a
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "border-slate-900 bg-slate-100 text-slate-950"
                          : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex h-screen flex-col lg:pl-60">
        <header className="border-b border-slate-200 bg-white">
          <Container className="flex h-16 items-center justify-between px-3 sm:px-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Operations workspace
              </p>
              <p className="font-semibold">Pune operations</p>
            </div>
            <ButtonLink href="/" variant="outline" size="sm">
              View site
            </ButtonLink>
          </Container>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-5 py-2 lg:hidden">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold ${
                  pathname.startsWith(href)
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        </header>
        <AdminUtilityBar />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1480px] px-2.5 sm:px-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const stats = getDashboardStats();
  const bookings = getBookings();
  const customers = getCustomers();
  const { vehicles } = useVansStore();
  return (
    <AdminShell>
      <main className="p-3 sm:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-slate-500">Overview</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add van
            </Button>
            <Button size="sm" variant="outline">
              Block date
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total vans", vehicles.length],
            [
              "Available vans",
              vehicles.filter((vehicle) => vehicle.status === "available").length,
            ],
            ["Active bookings", stats.activeBookings],
            ["Upcoming bookings", stats.upcomingBookings],
            [
              "Completed bookings",
              bookings.filter((b) => b.status === "completed").length,
            ],
            ["Revenue", formatCurrency(stats.totalRevenue)],
            ["Pending actions", stats.pendingActions],
            ["Customers", customers.length],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Revenue trend</h2>
              <span className="text-xs text-slate-500">Mock analytics</span>
            </div>
            <div className="mt-8 flex h-48 items-end gap-3">
              {[40, 58, 46, 78, 66, 92, 70, 84].map((height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t bg-slate-800"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-400">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">Popular vans</h2>
            <div className="mt-6 space-y-5">
              {vehicles.map((vehicle, index) => (
                <div key={vehicle.id}>
                  <div className="flex justify-between text-sm">
                    <span>{vehicle.name}</span>
                    <strong>{12 - index * 3} bookings</strong>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{ width: `${80 - index * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <div className="min-w-[760px] p-6">
            <h2 className="font-semibold">Recent bookings</h2>
            <table className="mt-5 w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="pb-3">Booking</th>
                  <th>Customer</th>
                  <th>Pickup</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100">
                    <td className="py-4 font-semibold">
                      {booking.bookingNumber}
                    </td>
                    <td>
                      {customers.find(
                        (customer) => customer.id === booking.customerId
                      )?.name ?? "Demo customer"}
                    </td>
                    <td>{booking.startDate}</td>
                    <td>{formatCurrency(booking.totalAmount)}</td>
                    <td>{booking.paymentStatus}</td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
