"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, BedDouble, ChefHat, Compass, Heart, PlugZap, Search, Star, ShieldCheck, Sparkles, X } from "lucide-react";
import { ButtonLink, Card, CardContent, Container, Input, Select, StatusBadge } from "@/components/ui";
import { getOffers, getReviews } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useVansStore } from "@/lib/store/VansStore";

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : "hidden"} whileInView={reduced ? undefined : "show"} viewport={{ once: true, amount: 0.15 }} variants={reveal} transition={{ delay }} className={className}>{children}</motion.div>;
}

const features = [
  { icon: BedDouble, title: "Sleep Anywhere", text: "Luxury queen memory foam beds under the stars. Wake up on cliff edges, secret valleys, or private beaches." },
  { icon: ChefHat, title: "Chef-Ready Kitchen", text: "Pull-out induction stoves, Dometic 12V fridge, aeropress coffee kit, and cookware ready to go." },
  { icon: PlugZap, title: "100% Off-Grid Power", text: "Rooftop monocrystalline solar + lithium batteries. High-speed Starlink to work from anywhere." },
  { icon: Compass, title: "Total Self-Drive Freedom", text: "Zero fixed routes. Zero hidden mileage caps. Complete comprehensive insurance & 24/7 roadside rescue." },
];

export default function HomePage() {
  const router = useRouter();
  const { vehicles, savedVanIds, toggleSavedVan } = useVansStore();
  const featured = useMemo(
    () =>
      vehicles
        .filter((vehicle) => vehicle.featured)
        .concat(vehicles.filter((vehicle) => !vehicle.featured))
        .slice(0, 3),
    [vehicles]
  );
  const reviews = useMemo(() => getReviews().slice(0, 3), []);
  const offers = useMemo(() => getOffers().slice(0, 3), []);
  const reduced = useReducedMotion();

  const handleBookClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?next=%2Fbook");
      return;
    }
    router.push("/book");
  };

  return (
    <main className="overflow-hidden bg-sand-50 text-ink">
      {/* ───── HERO SECTION ───── */}
      <section className="bg-sand-50">
        <Container className="py-2 sm:py-3">
          <div className="relative flex min-h-[68vh] flex-col justify-center overflow-hidden rounded-2xl bg-ink px-4 py-9 text-sand-50 sm:min-h-[72vh] sm:rounded-3xl sm:px-6 sm:py-12">
        <motion.div
          initial={reduced ? false : { scale: 1.06 }}
          animate={reduced ? undefined : { scale: 1 }}
          transition={{ duration: 2.2, ease }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1600&q=82"
            alt="Camper van under starry golden sunset sky"
            fill
            priority
            quality={72}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        
        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,93,57,0.20),transparent_60%)]" />

        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-3xl text-center">
            {/* Top Pill Badge */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold text-sand-200 backdrop-blur-md shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              <span>India&apos;s #1 Curated Vanlife Collective • 100% Pet Friendly</span>
            </motion.div>

            {/* Responsive Headline */}
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mt-4 font-display text-[1.85rem] font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-[3.15rem] leading-[1.08]"
            >
              Ditch the hotel.<br />
              Live the road.<br />
              <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-amber-300 bg-clip-text text-transparent">
                Your home on wheels.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sand-200 sm:text-base lg:text-lg"
            >
              Bespoke self-drive rigs with 100% off-grid solar, cozy queen beds, and Starlink WiFi. Freedom to wake up anywhere.
            </motion.p>

            {/* Gen-Z Vibe Check Filter Chips */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium text-sand-300"
            >
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-sm">⚡ 100% Solar Off-Grid</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-sm">🐾 Paws Welcome</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-sm">📶 Starlink Nomads</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-sm">☕ Pour-Over Kit</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-sm">🏔️ Mountain & Surf</span>
            </motion.div>
          </div>

          {/* Integrated Floating Booking Search Bar */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mx-auto mt-7 w-full max-w-4xl"
          >
            <BookingSearchBar />
          </motion.div>

          {/* Quick Hero Trust Indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-sand-300 sm:gap-8">
            <span className="flex items-center gap-1.5 font-medium"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9★ Average Rating (180+ Trips)</span>
            <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="h-3.5 w-3.5 text-forest-300" /> Zero Hidden Charges</span>
            <span className="flex items-center gap-1.5 font-medium"><Sparkles className="h-3.5 w-3.5 text-accent-300" /> Instant Digital Driver Verification</span>
          </div>
        </div>
          </div>
        </Container>
      </section>

      {/* ───── TICKER ───── */}
      <div className="overflow-hidden border-b border-sand-200 bg-accent-600 py-2.5 text-white">
        <div className="ticker-track flex w-max gap-8 whitespace-nowrap font-display text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="flex items-center gap-8">
              Road trips <span className="text-accent-300">✦</span> 100% Solar Off-grid <span className="text-accent-300">✦</span> Freedom <span className="text-accent-300">✦</span> Adventure <span className="text-accent-300">✦</span> Home on wheels <span className="text-accent-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───── WHY TRAVEL ON WHEELS (FEATURES) ───── */}
      <section className="section-padding bg-sand-50">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-accent-600">Why Travel On Wheels?</p>
              <h2 className="title-type mt-2 font-display font-bold">
                Not just a ride.<br />
                <span className="gradient-text">It&apos;s your boutique stay on wheels.</span>
              </h2>
              <p className="mt-2.5 text-sm text-sand-500 sm:text-base">
                Skip rigid hotel check-ins and crowded tour buses. Take your home with you.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {features.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 0.05}>
                <article className="group relative h-full rounded-2xl border border-sand-200 bg-white p-5 sm:p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/40 hover:shadow-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink sm:text-xl">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-sand-500 sm:text-sm">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── FEATURED VANS (Warm Oat Canvas) ───── */}
      <section className="section-padding border-y border-sand-200 bg-sand-100/70">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-accent-600">Handcrafted Camper Fleet</p>
                <h2 className="title-type mt-1 font-display font-bold text-ink">Meet your rig.</h2>
                <p className="mt-1 text-sm text-sand-500 sm:text-base">Custom-built for untamed mountain roads and golden coastlines.</p>
              </div>
              <ButtonLink href="/vans" variant="outline" size="sm" className="self-start border-sand-300 bg-white hover:border-accent-500 hover:text-accent-600 sm:self-auto">
                View all 18 vans <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle, index) => {
              const saved = savedVanIds.includes(vehicle.id);
              const perPerson = Math.round(vehicle.pricePerDay / (vehicle.sleepingCapacity || 2));
              return (
                <Reveal key={vehicle.id} delay={index * 0.06}>
                  <article className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                    {/* Van Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                      <Image
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        fill
                        quality={72}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                      <div className="absolute left-3 top-3">
                        <StatusBadge status={vehicle.status} />
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSavedVan(vehicle.id)}
                        aria-label={saved ? `Remove ${vehicle.name} from saved` : `Save ${vehicle.name}`}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-transform hover:scale-110"
                      >
                        <Heart className={`h-4 w-4 ${saved ? "fill-accent-500 text-accent-500" : "text-slate-600"}`} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-bold text-ink">{vehicle.name}</h3>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-sand-500">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-ink">4.9</span>
                            <span>• Verified Superhost</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-accent-600">
                            {formatCurrency(vehicle.pricePerDay)}
                            <span className="text-xs font-normal text-sand-500"> /day</span>
                          </p>
                          <span className="mt-1 inline-block rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-bold text-accent-700">
                            Split: {formatCurrency(perPerson)}/person
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-sand-500 line-clamp-2 leading-relaxed">
                        {vehicle.shortDescription}
                      </p>

                      {/* Specs Chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5 text-xs font-medium text-slate-600">
                        <span className="rounded-lg bg-sand-100 px-3 py-1">👥 {vehicle.passengerCapacity} seats</span>
                        <span className="rounded-lg bg-sand-100 px-3 py-1">🛏️ {vehicle.sleepingCapacity} berths</span>
                        <span className="rounded-lg bg-sand-100 px-3 py-1 capitalize">⚙️ {vehicle.transmission}</span>
                        <span className="rounded-lg bg-forest-50 text-forest-700 px-3 py-1">⚡ Solar 400W</span>
                      </div>

                      {/* CTA */}
                      <ButtonLink href={`/vans/${vehicle.slug}`} className="mt-5 w-full justify-center" size="sm">
                        View details & reserve <ArrowRight className="h-4 w-4" />
                      </ButtonLink>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ───── HOW IT WORKS (4 STEPS) ───── */}
      <section className="section-padding border-t border-sand-200 bg-sand-100/60">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-accent-600">Effortless Journey</p>
              <h2 className="title-type mt-2 font-display font-bold">Four Steps. Infinite Detours.</h2>
              <p className="mt-2 text-sm text-sand-500 sm:text-base">Booking your self-drive camper takes under 3 minutes.</p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Choose Your Rig", "Pick 2-berth, 4-berth, or heavy-duty 4x4 overland titan."],
              ["02", "Select Travel Window", "Lock your departure & return dates with zero hidden caps."],
              ["03", "Digital ID Clearance", "Upload your driver's license with 2-minute paperless verification."],
              ["04", "Pick Up & Drive Off", "Complete 15-min rig masterclass at the depot, take keys, and go."],
            ].map(([number, title, text], index) => (
              <Reveal key={number} delay={index * 0.06}>
                <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-soft transition-colors hover:border-accent-400/50 sm:p-6">
                  <span className="font-display text-3xl font-bold text-accent-500/70 sm:text-4xl">{number}</span>
                  <h3 className="mt-3 font-display text-base font-bold text-ink sm:text-lg">{title}</h3>
                  <p className="mt-1.5 text-xs text-sand-500 leading-relaxed sm:text-sm">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── VERIFIED ROAD TRIP TESTIMONIALS ───── */}
      <section className="section-padding bg-ink text-sand-50">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-accent-300">Community Vibe Check</p>
                <h2 className="title-type mt-1 font-display font-bold text-white">The Road Crew Says It Best</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-sand-200">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">4.9 / 5</span>
                <span>from 180+ nomads</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.06}>
                <blockquote className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm">
                  <div>
                    <div className="flex gap-1 text-accent-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-sand-100 leading-relaxed sm:text-base">&ldquo;{review.text}&rdquo;</p>
                  </div>
                  <footer className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                    <strong className="text-white">{review.customerName}</strong>
                    <span className="text-sand-400">{review.destination}</span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── PROMO OFFERS ───── */}
      <section className="section-padding bg-sand-50">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-accent-600">Nomad Perks</p>
                <h2 className="title-type mt-1 font-display font-bold">More Road for Your Rupee</h2>
              </div>
              <ButtonLink href="/offers" variant="link" className="self-start sm:self-auto">
                View all offers <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, index) => (
              <Reveal key={offer.id} delay={index * 0.06}>
                <Card className="overflow-hidden border border-sand-200 transition-all hover:shadow-card">
                  <div className="bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-3.5 text-white flex items-center justify-between">
                    <div>
                      <span className="font-display text-3xl font-bold">{offer.discountPercent}%</span>
                      <span className="ml-1 text-xs uppercase tracking-wider font-semibold">OFF</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">Promo code ready</span>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-display text-base font-bold text-ink sm:text-lg">{offer.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-sand-500 leading-relaxed">{offer.description}</p>
                    <button
                      type="button"
                      onClick={() => void handleBookClick()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-forest-700 underline-offset-4 hover:underline sm:text-sm"
                    >
                      Claim & book now <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden bg-ink py-16 text-sand-50 sm:py-24">
        <Image
          src="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&q=82"
          alt="Camper parked overlooking sunrise valley"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <Container className="relative z-10 text-center">
          <Reveal>
            <p className="eyebrow text-accent-300">Ready to break the routine?</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase text-white sm:text-4xl lg:text-5xl">
              Where will you<br />
              <span className="text-accent-400">wake up tomorrow?</span>
            </h2>
            <p className="mx-auto mt-3.5 max-w-md text-sm text-sand-200 sm:text-base">
              Mountains. Secret coastlines. Golden desert dunes. The keys are waiting.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/vans" size="md">
                Explore camper vans <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <button
                type="button"
                onClick={() => void handleBookClick()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-6 text-sm font-semibold text-white transition-all hover:border-accent-400 hover:bg-accent-400/10"
              >
                Check availability
              </button>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}

function BookingSearchBar() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-700 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white sm:px-5 sm:text-sm"
          aria-label="Open fleet search"
        >
          <Search className="h-4 w-4 text-accent-600" />
          Open fleet search
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/50 bg-white/95 p-4 shadow-2xl backdrop-blur-xl text-ink sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-700">
          <Search className="h-3.5 w-3.5 text-accent-600" /> Instant Fleet Search
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Self-drive • All-inclusive insurance</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-sand-100 hover:text-ink"
            aria-label="Close fleet search"
            title="Close fleet search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_0.7fr_auto] lg:items-end">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Pick-up hub</label>
          <Select
            className="h-11 w-full rounded-xl border border-sand-300 bg-sand-50/70 text-xs sm:text-sm font-medium focus:border-accent-500"
            options={[
              { value: "pune", label: "Pune Depot" },
              { value: "mumbai", label: "Mumbai Hub" },
              { value: "goa", label: "Goa Airport Depot" },
              { value: "manali", label: "Manali High-Pass Depot" },
            ]}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Departure date</label>
          <Input
            className="h-11 w-full rounded-xl border border-sand-300 bg-sand-50/70 text-xs sm:text-sm font-medium focus:border-accent-500"
            type="date"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Return date</label>
          <Input
            className="h-11 w-full rounded-xl border border-sand-300 bg-sand-50/70 text-xs sm:text-sm font-medium focus:border-accent-500"
            type="date"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Guests</label>
          <Input
            className="h-11 w-full rounded-xl border border-sand-300 bg-sand-50/70 text-xs sm:text-sm font-medium focus:border-accent-500"
            type="number"
            min="1"
            max="6"
            defaultValue="2"
          />
        </div>

        <ButtonLink
          href="/vans"
          className="h-11 w-full items-center justify-center rounded-xl bg-accent-500 px-5 text-xs font-semibold text-white shadow-sm hover:bg-accent-600 sm:text-sm sm:col-span-2 lg:col-span-1"
        >
          Find Vans <ArrowRight className="ml-1.5 h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
