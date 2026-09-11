"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChefHat,
  Compass,
  Gauge,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wind,
  Wrench,
  Zap,
  Sparkles,
  SlidersHorizontal,
  Coffee,
  Fuel,
  Minus,
  Plus,
  Share2,
  CheckCircle2,
  Radio,
  Clock,
  Luggage,
} from "lucide-react";
import {
  Button,
  ButtonLink,
  Card,
  CardContent,
  Container,
  FormField,
  Input,
  Select,
  StatusBadge,
} from "@/components/ui";
import { PageContent } from "@/components/layout/PageBanner";
import {
  getAdvanceBookingDays,
  getDestinations,
  getFaqsByCategory,
  getRoadTripPackages,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import type { Destination, Vehicle } from "@/lib/types";
import { useVansStore } from "@/lib/store/VansStore";
import { createClient } from "@/utils/supabase/client";
import { getUnavailableDates } from "@/lib/services/availability";

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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_80%,rgb(249_115_22/0.14),transparent_50%),radial-gradient(circle_at_85%_15%,rgb(45_107_79/0.18),transparent_50%)]" />
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

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { savedVanIds, toggleSavedVan } = useVansStore();
  const saved = savedVanIds.includes(vehicle.id);
  const [activeImg, setActiveImg] = useState(0);
  const router = useRouter();

  const perPersonPerDay = Math.round(
    vehicle.pricePerDay / Math.max(vehicle.passengerCapacity, 1)
  );

  const handleBookClick = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/book?vehicle=${vehicle.slug}`)}`);
      return;
    }

    router.push(`/book?vehicle=${vehicle.slug}`);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200/80 bg-sand-50 shadow-soft transition-all duration-300 ease-[var(--ease-editorial)] hover:-translate-y-1 hover:shadow-elevated">
      {/* Image Container with Live Dots */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200">
        <Image
          src={vehicle.images[activeImg] || vehicle.images[0]}
          alt={vehicle.name}
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-2">
          <StatusBadge status={vehicle.status} />
          {vehicle.featured && (
            <span className="rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
              🔥 Popular Pick
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={() => toggleSavedVan(vehicle.id)}
          aria-label={
            saved
              ? `Remove ${vehicle.name} from saved`
              : `Save ${vehicle.name}`
          }
          className={`absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 ${
            saved
              ? "bg-accent-500 text-white shadow-md"
              : "bg-sand-50/90 text-ink/80 hover:bg-sand-50"
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
        </button>

        {/* Image dots if multiple images */}
        {vehicle.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
            {vehicle.images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`View photo ${idx + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImg(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImg === idx ? "w-4 bg-accent-400" : "w-1.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* Split Pill on bottom right */}
        <div className="absolute bottom-3 right-3 hidden rounded-lg bg-forest-900/85 px-2.5 py-1 text-[11px] font-semibold text-sand-100 backdrop-blur-sm sm:block">
          Split: ~{formatCurrency(perPersonPerDay)}/person
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              {vehicle.name}
            </h2>
            <p className="mt-0.5 text-xs font-medium text-sand-500">
              {vehicle.model}
            </p>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl font-bold text-accent-600">
              {formatCurrency(vehicle.pricePerDay)}
            </span>
            <span className="block text-[11px] font-medium text-sand-500">
              per day / 24 hrs
            </span>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-sand-600">
          {vehicle.shortDescription}
        </p>

        {/* Specs Pill Bar */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-sand-100/70 p-2.5 text-center text-xs text-ink/80">
          <div className="flex flex-col items-center justify-center">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <Users className="h-3.5 w-3.5 text-accent-600" />
              {vehicle.passengerCapacity} seats
            </span>
            <span className="text-[10px] text-sand-500">Day travel</span>
          </div>
          <div className="flex flex-col items-center justify-center border-x border-sand-200">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <BedDouble className="h-3.5 w-3.5 text-forest-600" />
              {vehicle.sleepingCapacity} beds
            </span>
            <span className="text-[10px] text-sand-500">Full mattress</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <Fuel className="h-3.5 w-3.5 text-accent-600" />
              {vehicle.transmission}
            </span>
            <span className="text-[10px] text-sand-500 capitalize">
              {vehicle.fuelType}
            </span>
          </div>
        </div>

        {/* Key Features Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vehicle.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 rounded-md bg-sand-100 px-2 py-0.5 text-[11px] font-medium text-sand-600"
            >
              <Zap className="h-2.5 w-2.5 text-accent-500" />
              {amenity}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-2 pt-2">
          <ButtonLink
            href={`/vans/${vehicle.slug}`}
            variant="outline"
            className="flex-1 py-2 text-xs font-semibold"
          >
            Explore van
          </ButtonLink>
          <button
            type="button"
            onClick={() => void handleBookClick()}
            className="flex-1 rounded-xl bg-accent-500 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-accent-600"
          >
            Book trip <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function VansPage() {
  const { vehicles } = useVansStore();
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("all");
  const [capacity, setCapacity] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const vibeChips = [
    { id: "all", label: "All Campers" },
    { id: "duo", label: "👫 Couples & Duos" },
    { id: "squad", label: "🚐 Squad & Crew (4+)" },
    { id: "featured", label: "⭐ Top Rated" },
  ];

  const visible = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        const matchesQuery =
          vehicle.name.toLowerCase().includes(query.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(query.toLowerCase());

        const matchesCapacity =
          capacity === "all" ||
          vehicle.passengerCapacity >= Number(capacity);

        const matchesVibe =
          vibe === "all" ||
          (vibe === "duo" && vehicle.passengerCapacity <= 2) ||
          (vibe === "squad" && vehicle.passengerCapacity >= 4) ||
          (vibe === "featured" && vehicle.featured);

        return matchesQuery && matchesCapacity && matchesVibe;
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.pricePerDay - b.pricePerDay;
        if (sort === "price-high") return b.pricePerDay - a.pricePerDay;
        return Number(b.featured) - Number(a.featured);
      });
  }, [vehicles, query, vibe, capacity, sort]);

  return (
    <>
      <Banner
        eyebrow="The Nomad Fleet"
        badge="100% Self-Drive · Pune Hub"
        title="Find your home on wheels."
        description="Engineered for highway cruising and off-grid wild camp nights. Pick your crew size, gear layout, and hit the road."
      />
      <PageContent className="vans-page-content">
        {/* Vibe Chips Filter Bar */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sand-500 shrink-0 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Vibe:
          </span>
          {vibeChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setVibe(chip.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                vibe === chip.id
                  ? "bg-accent-500 text-white shadow-sm"
                  : "bg-sand-100 text-ink/70 hover:bg-sand-200"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Panel */}
        <div className="vans-filter-panel mb-8 grid gap-3 rounded-2xl border border-sand-200/80 bg-sand-100/60 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-sand-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by van name, model, or vibe..."
              className="pl-10 text-sm"
            />
          </div>
          <Select
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
            options={[
              { value: "all", label: "Any capacity" },
              { value: "2", label: "2+ travellers" },
              { value: "4", label: "4+ travellers" },
              { value: "6", label: "6+ travellers" },
            ]}
          />
          <Select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            options={[
              { value: "featured", label: "Featured first" },
              { value: "price-low", label: "Price: low to high" },
              { value: "price-high", label: "Price: high to low" },
            ]}
          />
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-sand-500">
          <p>
            Showing <strong className="text-ink">{visible.length}</strong> ready
            campers
          </p>
          {(query || vibe !== "all" || capacity !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setVibe("all");
                setCapacity("all");
              }}
              className="font-semibold text-accent-600 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Vans Grid */}
        {visible.length ? (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {visible.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed text-center">
            <CardContent className="p-12 sm:p-16">
              <Compass className="mx-auto h-10 w-10 text-sand-400" />
              <h2 className="mt-4 font-display text-2xl font-bold">
                No vans match your filters
              </h2>
              <p className="mt-2 text-sm text-sand-500">
                Try loosening your capacity filter or resetting your search.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setQuery("");
                  setVibe("all");
                  setCapacity("all");
                }}
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </PageContent>
    </>
  );
}

export function VanDetailsPage({ vehicle }: { vehicle: Vehicle }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [nights, setNights] = useState(3);
  const [crewSize, setCrewSize] = useState(vehicle.passengerCapacity || 2);
  const router = useRouter();

  const handleBook = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/book?vehicle=${vehicle.slug}`)}`);
      return;
    }

    router.push(`/book?vehicle=${vehicle.slug}`);
  };

  useEffect(() => {
    let active = true;
    void getUnavailableDates(vehicle.id).then((dates) => {
      if (active) setBlockedDates(new Set(dates));
    }).catch(() => {
      if (active) setBlockedDates(new Set());
    });
    return () => { active = false; };
  }, [vehicle.id]);

  const facilityGroups = [
    ["Sleeping Area", BedDouble, vehicle.facilities.bedroom],
    ["Kitchen & Cookware", ChefHat, vehicle.facilities.kitchen],
    ["Washroom & Shower", Wind, vehicle.facilities.washroom],
    ["Storage & Luggage", Wrench, vehicle.facilities.storage],
    ["Power & Off-Grid Tech", Gauge, vehicle.facilities.charging],
  ] as const;

  const minDate = new Date(
    Date.now() + getAdvanceBookingDays() * 86400000
  )
    .toISOString()
    .slice(0, 10);

  // Creative Split Calculator calculations
  const totalRental = vehicle.pricePerDay * nights;
  const grandTotal = totalRental + vehicle.securityDeposit;
  const perPersonTotal = Math.round(grandTotal / crewSize);
  const perPersonPerNight = Math.round(totalRental / crewSize / nights);

  return (
    <>
      <Banner
        eyebrow="Van Specification & Booking"
        badge="Self-Drive Ready"
        title={vehicle.name}
        description={vehicle.description}
      />
      <PageContent>
        {/* Main 2-Column Section */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Gallery & Quick Specs */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand-200 shadow-soft">
              <Image
                src={vehicle.images[activeImage] || vehicle.images[0]}
                alt={`${vehicle.name} view ${activeImage + 1}`}
                fill
                className="object-cover transition-all duration-500"
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                Photo {activeImage + 1} of {vehicle.images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-5">
              {vehicle.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-xl transition-all duration-200 ${
                    activeImage === index
                      ? "ring-2 ring-accent-500 ring-offset-2 scale-[0.98]"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${vehicle.name} thumb ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="20vw"
                  />
                </button>
              ))}
            </div>

            {/* Nomad Independence Specs Matrix */}
            <div className="mt-8 rounded-2xl border border-sand-200/80 bg-sand-50 p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-500" />
                <h3 className="font-display text-lg font-bold">
                  Nomad Autonomy Matrix
                </h3>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-sand-200/60 bg-sand-100/50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-700">
                    ⚡ Solar & Auxiliary Battery
                  </p>
                  <p className="mt-1 text-xs text-sand-600">
                    400W solar setup + 200Ah aux battery. Powers fridge, fans &
                    fast laptop charging 48h off-grid.
                  </p>
                </div>
                <div className="rounded-xl border border-sand-200/60 bg-sand-100/50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-700">
                    💧 Fresh Water System
                  </p>
                  <p className="mt-1 text-xs text-sand-600">
                    80L pressurized water tank for sink & outdoor shower.
                    Includes quick-fill hose for highway taps.
                  </p>
                </div>
                <div className="rounded-xl border border-sand-200/60 bg-sand-100/50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-700">
                    🍳 Mobile Galley
                  </p>
                  <p className="mt-1 text-xs text-sand-600">
                    Dual burner butane stove, non-stick cookware, coffee moka pot
                    & 40L 12V travel refrigerator.
                  </p>
                </div>
                <div className="rounded-xl border border-sand-200/60 bg-sand-100/50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-700">
                    🏔️ Terrain Readiness
                  </p>
                  <p className="mt-1 text-xs text-sand-600">
                    High ground clearance with all-terrain tyres. Tested on
                    Western Ghats passes and coastal routes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Split Cost & Booking Widget */}
          <aside className="h-fit rounded-2xl bg-forest-700 text-sand-50 shadow-elevated lg:sticky lg:top-24">
            <div className="p-6 sm:p-7">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest-200">
                  Daily Rental
                </span>
                <span className="rounded-full bg-forest-600/80 px-2.5 py-0.5 text-xs font-semibold text-accent-300">
                  Instant Confirmation
                </span>
              </div>
              <p className="mt-2 font-display text-4xl font-bold text-sand-50">
                {formatCurrency(vehicle.pricePerDay)}
                <span className="text-sm font-normal text-forest-200">
                  {" "}
                  / 24 hrs
                </span>
              </p>

              {/* Interactive Split-The-Bill Widget */}
              <div className="mt-6 rounded-xl border border-forest-600/70 bg-forest-800/60 p-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-accent-300">
                  <span>Split The Bill Widget</span>
                  <span>Gen-Z Crew Calculator</span>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Days Selector */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-forest-200">Trip duration:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNights((n) => Math.max(1, n - 1))}
                        className="flex h-6 w-6 items-center justify-center rounded bg-forest-600 hover:bg-forest-500"
                      >
                        <Minus className="h-3 w-3 text-white" />
                      </button>
                      <strong className="w-12 text-center text-sm font-bold text-white">
                        {nights} {nights === 1 ? "day" : "days"}
                      </strong>
                      <button
                        type="button"
                        onClick={() => setNights((n) => Math.min(14, n + 1))}
                        className="flex h-6 w-6 items-center justify-center rounded bg-forest-600 hover:bg-forest-500"
                      >
                        <Plus className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Friends Selector */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-forest-200">Crew sharing:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCrewSize((c) => Math.max(1, c - 1))}
                        className="flex h-6 w-6 items-center justify-center rounded bg-forest-600 hover:bg-forest-500"
                      >
                        <Minus className="h-3 w-3 text-white" />
                      </button>
                      <strong className="w-12 text-center text-sm font-bold text-white">
                        {crewSize} {crewSize === 1 ? "person" : "people"}
                      </strong>
                      <button
                        type="button"
                        onClick={() =>
                          setCrewSize((c) =>
                            Math.min(vehicle.passengerCapacity, c + 1)
                          )
                        }
                        className="flex h-6 w-6 items-center justify-center rounded bg-forest-600 hover:bg-forest-500"
                      >
                        <Plus className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Split Result Callout */}
                <div className="mt-4 rounded-lg bg-accent-500/20 border border-accent-500/40 p-3 text-center">
                  <p className="text-[11px] font-semibold text-accent-300 uppercase tracking-wider">
                    Each friend pays only
                  </p>
                  <p className="mt-0.5 font-display text-2xl font-bold text-white">
                    ~{formatCurrency(perPersonPerNight)}
                    <span className="text-xs font-normal text-sand-200">
                      {" "}
                      / day
                    </span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-forest-200">
                    Total: ~{formatCurrency(perPersonTotal)} per friend (incl.
                    refundable deposit)
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 space-y-2.5 border-t border-forest-500/60 pt-5 text-xs">
                <div className="flex justify-between text-forest-200">
                  <span>
                    Vehicle rent ({nights} {nights === 1 ? "day" : "days"})
                  </span>
                  <strong className="text-white">
                    {formatCurrency(totalRental)}
                  </strong>
                </div>
                <div className="flex justify-between text-forest-200">
                  <span>Security deposit (100% refundable)</span>
                  <strong className="text-white">
                    {formatCurrency(vehicle.securityDeposit)}
                  </strong>
                </div>
                <div className="flex justify-between text-accent-300">
                  <span>Fuel & Tolls</span>
                  <strong>Self-responsibility</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleBook()}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-600"
              >
                Book this van <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-forest-200">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-400" />
                <span>Zero hidden charges · Clean vehicle guarantee</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Facilities Section */}
        <div className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Living in the van</p>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Every square inch thoughtfully equipped.
              </h2>
            </div>
            <span className="text-xs font-semibold text-sand-500">
              {vehicle.model} Architecture
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilityGroups.map(([label, Icon, items]) => (
              <div
                key={label}
                className="rounded-2xl border border-sand-200/70 bg-sand-50 p-5 shadow-soft transition-colors duration-200 hover:bg-sand-100/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100">
                  <Icon className="h-5 w-5 text-forest-600" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-ink">
                  {label}
                </h3>
                <ul className="mt-3 space-y-1.5 text-xs text-sand-600">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-accent-600 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Runway Tester */}
        <div className="mt-14 rounded-2xl border border-sand-200/80 bg-sand-50 p-6 sm:p-8 shadow-soft">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow">Date Runway Check</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                Plan your departure date.
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-sand-500">
                To guarantee deep sanitation and complete mechanical inspection,
                bookings require at least {getAdvanceBookingDays()} days advance
                notice.
              </p>
            </div>
            <div>
              <FormField label="Check departure date availability">
                <Input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="text-sm"
                />
              </FormField>
              {selectedDate && blockedDates.has(selectedDate) && (
                <p className="mt-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700">
                  ⚠️ This van is reserved for this date. Please pick another
                  date.
                </p>
              )}
              {selectedDate && !blockedDates.has(selectedDate) && (
                <p className="mt-2 rounded-lg bg-forest-50 p-3 text-xs font-semibold text-forest-700">
                  ✨ Excellent! This van is ready for pickup on {selectedDate}.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Driving Requirements Strip */}
        <div className="mt-12 border-t border-sand-200/60 pt-10">
          <p className="eyebrow">Driver Eligibility</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
            {vehicle.drivingRequirements[0] || "Self-Drive Verification"}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {vehicle.drivingRequirements.map((req) => (
              <div
                key={req}
                className="flex items-start gap-2.5 rounded-xl border border-sand-200/60 bg-sand-50 p-4 text-xs font-medium text-sand-600"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-forest-600 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12 border-t border-sand-200/60 pt-10">
          <p className="eyebrow">Van Life FAQs</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
            Got questions about this camper?
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {getFaqsByCategory("vehicle")
              .slice(0, 4)
              .map((item) => (
                <details
                  key={item.id}
                  className="group rounded-2xl border border-sand-200/80 bg-sand-50 p-5 transition-colors duration-200 open:bg-sand-100/60"
                >
                  <summary className="cursor-pointer font-display text-sm font-bold text-ink transition-colors group-open:text-accent-600">
                    {item.question}
                  </summary>
                  <p className="mt-2.5 text-xs leading-relaxed text-sand-500">
                    {item.answer}
                  </p>
                </details>
              ))}
          </div>
        </div>
      </PageContent>
    </>
  );
}

export function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      icon: Compass,
      tag: "Vibe Match",
      title: "Pick Your Rig",
      text: "Choose the camper layout that matches your crew. Compact stealth duo vans or 4-6 sleeper safari rigs with rooftop tents.",
      proTip: "Tip: Filter by solar capacity if planning off-grid mountain halts.",
    },
    {
      num: "02",
      icon: CalendarDays,
      tag: "Runway & Route",
      title: "Lock Your Dates",
      text: "Select your start date with 4 days advance runway. Pick your route towards the Sahyadri mountains or Konkan beaches.",
      proTip: "Tip: Weekday departures have quieter campsite spots.",
    },
    {
      num: "03",
      icon: ShieldCheck,
      tag: "Instant KYC",
      title: "100% Digital Handover",
      text: "Upload your driving licence and Aadhaar in 3 minutes. Zero paperwork clutter. Complete payment & refundable security deposit.",
      proTip: "Tip: Any valid Indian 4-wheeler LMV licence qualifies.",
    },
    {
      num: "04",
      icon: MapPin,
      tag: "Pure Freedom",
      title: "Grab Keys & Roam",
      text: "15-minute quick walkthrough of solar, inverter, water tanks & stove at our Pune base. Turn up the music and chase the horizon.",
      proTip: "Tip: 24/7 highway roadside assistance is on standby.",
    },
  ];

  const essentialsIncluded = [
    "High-density foam mattress & clean linen",
    "Dual burner butane camping stove & utensils",
    "12V cooling fridge & electric water pump",
    "Solar roof panel & auxiliary battery bank",
    "Foldable outdoor camping chairs (x2)",
    "USB-C 65W laptop & phone charging ports",
    "Basic first aid kit & fire extinguisher",
  ];

  const essentialsToBring = [
    "Offline downloaded Spotify road trip playlists",
    "Offline Google Maps / MapMyIndia maps",
    "Warm hoodie for chilly mountain ghats nights",
    "Personal toiletries & favourite road snacks",
    "Valid physical driving licence for checks",
  ];

  return (
    <>
      <Banner
        eyebrow="The Road Ahead"
        badge="Zero Complications · 4 Steps"
        title="Four steps. Infinite detours."
        description="A camper van journey should feel effortless before it feels epic. Here is how your road trip comes to life."
      />
      <PageContent>
        {/* Step-by-Step Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-forest-700 p-6 text-sand-50 shadow-soft transition-all duration-300 hover:bg-forest-600 sm:p-8"
              >
                <span className="absolute right-4 top-2 font-display text-8xl font-bold text-forest-600/40 transition-colors duration-300 group-hover:text-forest-500/40 select-none">
                  {step.num}
                </span>

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-800/80 shadow-inner">
                      <Icon className="h-5 w-5 text-accent-300" />
                    </div>
                    <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-300">
                      {step.tag}
                    </span>
                  </div>

                  <h2 className="mt-8 font-display text-2xl font-bold tracking-tight text-sand-50 sm:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-forest-100 sm:text-sm">
                    {step.text}
                  </p>
                </div>

                <div className="relative mt-6 rounded-xl bg-forest-800/60 p-3 text-xs text-sand-200">
                  <p className="font-semibold text-accent-300">{step.proTip}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Packing Checklist: What's In The Rig vs What To Bring */}
        <div className="mt-16 rounded-2xl border border-sand-200/80 bg-sand-50 p-6 sm:p-10 shadow-soft">
          <div className="text-center max-w-xl mx-auto">
            <span className="eyebrow">The Nomad Packing Matrix</span>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
              What we pack vs. what you pack
            </h2>
            <p className="mt-2 text-xs text-sand-500">
              No stress about kitchenware or beddings. We handle the heavy
              lifting.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* We Provide */}
            <div className="rounded-xl border border-forest-200 bg-forest-50/50 p-5">
              <div className="flex items-center gap-2 text-forest-800 font-display font-bold">
                <CheckCircle2 className="h-5 w-5 text-forest-600" />
                <h3>Already packed inside your van</h3>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-forest-900">
                {essentialsIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-forest-600 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* You Bring */}
            <div className="rounded-xl border border-accent-200 bg-accent-50/50 p-5">
              <div className="flex items-center gap-2 text-accent-900 font-display font-bold">
                <Luggage className="h-5 w-5 text-accent-600" />
                <h3>What you should bring along</h3>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-accent-900">
                {essentialsToBring.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent-600 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-forest-700 to-forest-800 p-8 text-sand-50 shadow-soft sm:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-300">
                Ready to live the road?
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Your keys are waiting at Pune base.
              </h2>
              <p className="mt-2 max-w-xl text-xs text-forest-100 sm:text-sm">
                Pick your camper van, assemble your crew, and take off.
              </p>
            </div>
            <ButtonLink
              href="/vans"
              className="bg-accent-500 text-white hover:bg-accent-600 shadow-md whitespace-nowrap"
            >
              Explore the fleet <ArrowRight className="ml-1.5 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </PageContent>
    </>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200/80 bg-sand-50 shadow-soft transition-all duration-300 ease-[var(--ease-editorial)] hover:-translate-y-1 hover:shadow-elevated">
      {/* Postcard Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute left-3.5 top-3.5">
          <span className="rounded-full bg-sand-50/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-800 shadow-sm backdrop-blur-sm">
            {destination.recommendedDuration}
          </span>
        </div>

        {/* Destination Name on Image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          <h2 className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            {destination.name}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-sand-200">
            <MapPin className="h-3 w-3 text-accent-400" />
            {destination.routeInfo}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs leading-relaxed text-sand-600 line-clamp-3">
          {destination.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {destination.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sand-100 px-2.5 py-0.5 text-[11px] font-semibold text-ink/70"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Explore Button */}
        <div className="mt-5 border-t border-sand-200/60 pt-4">
          <ButtonLink
            href={`/destinations/${destination.slug}`}
            variant="outline"
            className="w-full text-xs font-semibold"
          >
            Explore route guide <ArrowRight className="ml-1 h-3 w-3" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function DestinationsPage() {
  const destinations = getDestinations();
  const packages = getRoadTripPackages();
  const [terrainFilter, setTerrainFilter] = useState("all");

  const terrainFilters = [
    { id: "all", label: "All Terrains" },
    { id: "ghats", label: "🌲 Misty Ghats" },
    { id: "coast", label: "🌊 Coastal Roads" },
    { id: "lakes", label: "⛺ Lakeside Spots" },
  ];

  const filteredDestinations = useMemo(() => {
    if (terrainFilter === "all") return destinations;
    if (terrainFilter === "ghats")
      return destinations.filter((d) =>
        d.tags.some((t) =>
          ["Misty peaks", "Ghats", "Viewpoints", "Forest trails"].includes(t)
        )
      );
    if (terrainFilter === "coast")
      return destinations.filter((d) =>
        d.tags.some((t) => ["Beaches", "Coast", "Sunset"].includes(t))
      );
    return destinations.filter((d) =>
      d.tags.some((t) =>
        ["Lake camp", "Water sports", "Riverside"].includes(t)
      )
    );
  }, [destinations, terrainFilter]);

  return (
    <>
      <Banner
        eyebrow="Scenic Trails & Camps"
        badge="Maharashtra & Goa Routes"
        title="Pick a mood. Find a road."
        description="From misty strawberry highlands in Panchgani to secret backwater camp halts in Tapola. Your camper is already built for these turns."
      />
      <PageContent>
        {/* Filter Pills */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sand-500 mr-1">
            Terrain:
          </span>
          {terrainFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setTerrainFilter(filter.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                terrainFilter === filter.id
                  ? "bg-accent-500 text-white shadow-sm"
                  : "bg-sand-100 text-ink/70 hover:bg-sand-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Destination Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        {/* Curated Road Trips Bottom Feature */}
        <section className="relative mt-16 overflow-hidden rounded-2xl bg-ink p-6 text-sand-50 sm:p-10 shadow-elevated">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgb(249_115_22/0.12),transparent_50%)]" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent-500/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-accent-400">
                  Curated Road-Trips
                </span>
                <span className="text-xs text-sand-400">
                  Self-Drive Approved
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-sand-50 sm:text-4xl">
                Ready-made itineraries with zero group tour vibes.
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-sand-300 sm:text-sm">
                Fuel budgets, GPS coordinates, sunset viewpoints, and verified
                quiet van-camping halts.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-xl bg-ink-soft border border-ink-muted px-4 py-2 text-xs font-semibold text-sand-200">
              <Star className="h-4 w-4 text-accent-400" />
              Tested by slow travellers
            </span>
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-2">
            {packages.map((trip) => (
              <div
                key={trip.id}
                className="rounded-2xl border border-ink-muted bg-ink-soft p-5 transition-all duration-300 hover:border-accent-500/40 hover:bg-ink-soft/90"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-400">
                    {trip.distanceKm} km · {trip.fuelEstimate}
                  </span>
                  <span className="rounded-md bg-forest-900/60 px-2 py-0.5 text-[10px] font-medium text-forest-200">
                    Self-Drive
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-sand-50 tracking-tight">
                  {trip.name}
                </h3>
                <p className="mt-1.5 text-xs text-sand-300 flex items-center gap-1.5">
                  <Compass className="h-3 w-3 text-accent-400 shrink-0" />
                  {trip.route}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {trip.suggestedStays.map((stay) => (
                    <span
                      key={stay}
                      className="rounded-md border border-ink-muted px-2 py-0.5 text-[10px] text-sand-400"
                    >
                      ⛺ {stay}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </PageContent>
    </>
  );
}
