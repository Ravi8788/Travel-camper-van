"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Compass,
  MapPin,
  Sparkles,
  Star,
  Users,
  Clock,
  ShieldCheck,
  Flame,
  Tent,
} from "lucide-react";
import { ButtonLink, Card, CardContent, Container } from "@/components/ui";
import { PageContent } from "@/components/layout/PageBanner";
import {
  getPackageBySlug,
  getPublishedPackages,
  type PackageRecord,
} from "@/lib/services/packages";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

function PackageBanner({
  title,
  description,
  badge = "Curated Road-Trips",
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <section className="bg-sand-50 pt-3 sm:pt-4">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-ink px-5 py-8 text-sand-50 sm:rounded-3xl sm:px-8 sm:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgb(249_115_22/0.12),transparent_50%),radial-gradient(circle_at_80%_20%,rgb(45_107_79/0.18),transparent_50%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
                {badge}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full border border-forest-500/40 bg-forest-900/60 px-2.5 py-0.5 text-[11px] font-semibold text-forest-200">
                <Sparkles className="h-3 w-3 text-accent-400" />
                Slow Travel Ready
              </span>
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

export function PublicPackagesPage() {
  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublishedPackages()
      .then(setPackages)
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : "Packages are unavailable right now."
        )
      );
  }, []);

  return (
    <>
      <PackageBanner
        title="Curated journeys with zero tour-bus vibes."
        description="Thoughtfully crafted road-trip loops around Mahabaleshwar, Panchgani, and Tapola. Pick a package for curated campsites and route guidance, or rent a van to build your own odyssey."
      />
      <PageContent>
        {error ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-sand-500">
              {error}
            </CardContent>
          </Card>
        ) : packages.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center sm:p-16">
              <CalendarDays className="mx-auto h-10 w-10 text-sand-400" />
              <h2 className="mt-4 font-display text-2xl font-bold">
                Fresh routes are landing soon
              </h2>
              <p className="mt-2 text-xs text-sand-500">
                Our expedition team is plotting the first live verified routes.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((item, index) => {
              const estSplit = Math.round(Number(item.price) / 4);
              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-sand-200/80 bg-sand-50 shadow-soft transition-all duration-300 ease-[var(--ease-editorial)] hover:-translate-y-1 hover:shadow-elevated"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-forest-100">
                    {item.images[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-forest-600">
                        <MapPin className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-black/20" />
                    
                    <span className="absolute left-3.5 top-3.5 rounded-full bg-sand-50/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest-800 shadow-sm backdrop-blur-sm">
                      📍 {item.location}
                    </span>

                    <div className="absolute bottom-3 right-3 rounded-lg bg-forest-900/85 px-2.5 py-1 text-[11px] font-semibold text-sand-100 backdrop-blur-sm">
                      Split: ~{formatCurrency(estSplit)}/person (4 crew)
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                      {item.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-sand-600">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-y border-sand-200/60 py-3 text-xs">
                      <span className="flex items-center gap-1.5 text-ink font-semibold">
                        <Clock className="h-3.5 w-3.5 text-accent-600" />
                        {item.duration_days} Days / {Math.max(1, item.duration_days - 1)} Nights
                      </span>
                      <div className="text-right">
                        <span className="font-display text-xl font-bold text-accent-600">
                          {formatCurrency(Number(item.price))}
                        </span>
                        <span className="block text-[10px] text-sand-500">
                          per package
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-forest-50 px-2 py-0.5 text-[11px] font-medium text-forest-700">
                        <Tent className="h-3 w-3 text-forest-600" /> Curated Camps
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-accent-50 px-2 py-0.5 text-[11px] font-medium text-accent-700">
                        <Compass className="h-3 w-3 text-accent-600" /> Offline Route
                      </span>
                    </div>

                    <div className="mt-5 border-t border-sand-200/60 pt-4">
                      <ButtonLink
                        href={`/packages/${item.slug}`}
                        className="w-full text-xs font-semibold"
                      >
                        View package itinerary <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </ButtonLink>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </PageContent>
    </>
  );
}

export function PublicPackageDetailsPage({ slug }: { slug: string }) {
  const [item, setItem] = useState<PackageRecord | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleBook = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/book?package=${slug}`)}`);
      return;
    }

    router.push(`/book?package=${encodeURIComponent(slug)}`);
  };

  useEffect(() => {
    getPackageBySlug(slug)
      .then(setItem)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "Package unavailable.")
      );
  }, [slug]);

  if (error) {
    return (
      <>
        <PackageBanner title="This route has moved." description={error} />
        <PageContent>
          <ButtonLink href="/packages">Back to all packages</ButtonLink>
        </PageContent>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <PackageBanner
          title="Loading your route..."
          description="Fetching live route details from the expedition ledger."
        />
        <PageContent>
          <p className="text-sand-500">Loading package details...</p>
        </PageContent>
      </>
    );
  }

  const itinerary = Array.isArray(item.itinerary) ? item.itinerary : [];

  return (
    <>
      <PackageBanner
        badge={`${item.location} · ${item.duration_days} Days`}
        title={item.title}
        description={item.description}
      />
      <PageContent>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Main Column */}
          <div>
            {item.images.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {item.images.map((image, index) => (
                  <div
                    key={image}
                    className={`${
                      index === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                    } relative overflow-hidden rounded-2xl bg-sand-200 shadow-soft`}
                  >
                    <Image
                      src={image}
                      alt={`${item.title} photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Itinerary Timeline */}
            <div className="mt-12">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-accent-500" />
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  The Day-by-Day Journey
                </h2>
              </div>
              <p className="mt-1 text-xs text-sand-500">
                Paced for relaxed driving, scenic photo stops, and sunset campfire setups.
              </p>

              <div className="mt-8 space-y-0">
                {itinerary.map((day, index) => (
                  <div
                    key={`${day.day}-${index}`}
                    className="relative flex gap-5 pb-8 last:pb-0"
                  >
                    <div className="relative flex w-10 shrink-0 justify-center">
                      <span className="z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 font-display text-sm font-bold text-white shadow-sm">
                        D{day.day}
                      </span>
                      {index < itinerary.length - 1 && (
                        <span className="absolute top-10 h-full w-0.5 bg-sand-300" />
                      )}
                    </div>
                    <div className="rounded-2xl border border-sand-200/70 bg-sand-50 p-5 shadow-soft flex-1">
                      <h3 className="font-display text-lg font-bold text-ink">
                        {day.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-sand-600">
                        {day.description}
                      </p>
                      {day.activities && day.activities.length > 0 && (
                        <ul className="mt-4 space-y-1.5 border-t border-sand-200/60 pt-3 text-xs text-ink/80">
                          {day.activities.map((activity) => (
                            <li key={activity} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-forest-600" />
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking & Inclusions Sidebar */}
          <aside className="h-fit rounded-2xl bg-forest-700 p-6 text-sand-50 shadow-elevated lg:sticky lg:top-24 sm:p-7">
            <div className="flex items-center justify-between text-xs font-semibold text-forest-200 uppercase tracking-wider">
              <span>{item.location}</span>
              <span>{item.duration_days} Days / {Math.max(1, item.duration_days - 1)} Nights</span>
            </div>

            <p className="mt-3 font-display text-4xl font-bold text-sand-50">
              {formatCurrency(Number(item.price))}
            </p>
            <p className="mt-1 text-xs text-forest-200">
              Complete curated route guide & campsite coordination.
            </p>

            {/* Inclusions */}
            <div className="mt-6 border-t border-forest-500/60 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-300">
                Included in package
              </p>
              <ul className="mt-3 space-y-2 text-xs text-forest-100">
                {item.inclusions.map((value) => (
                  <li key={value} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-accent-300 mt-0.5" />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>

              {item.exclusions && item.exclusions.length > 0 && (
                <div className="mt-5 border-t border-forest-600/70 pt-4">
                  <p className="text-xs font-semibold text-forest-300">
                    Not included
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-forest-300">
                    {item.exclusions.map((value) => (
                      <li key={value}>• {value}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => void handleBook()}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-600"
            >
              Book this package <ArrowRight className="ml-1.5 h-4 w-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-forest-200">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-400" />
              <span>Full offline guide & emergency support included</span>
            </div>
          </aside>
        </div>
      </PageContent>
    </>
  );
}
