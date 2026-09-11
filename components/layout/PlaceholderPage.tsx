import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Construction } from "lucide-react";
import { ButtonLink, Card, CardContent } from "@/components/ui";
import { PageBanner, PageContent } from "./PageBanner";

export function PlaceholderPage({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  const router = useRouter();
  const handleBook = async () => {
    const supabase = (await import("@/utils/supabase/client")).createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?next=%2Fbook");
      return;
    }
    router.push("/book");
  };

  return (
    <>
      <PageBanner title={title} description={description} eyebrow={eyebrow} />
      <PageContent>
        <Card className="max-w-xl mx-auto text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sand-200">
              <Construction className="h-7 w-7 text-sand-500" />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Page content coming next
            </h2>
            <p className="mt-2 text-sm text-sand-500">
              The full {title.toLowerCase()} page will be built in the next step.
              The site shell — header, footer, and navigation — is ready.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/" variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </ButtonLink>
              <ButtonLink href="/vans" size="sm">
                Browse Vans
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}

export function ShellPreviewHome() {
  const router = useRouter();

  const handleBookClick = async () => {
    const supabase = (await import("@/utils/supabase/client")).createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=%2Fbook");
      return;
    }

    router.push("/book");
  };

  return (
    <>
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1527786356703-4caf683aa139?w=1920&q=80)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" aria-hidden="true" />
        <div className="container-wide relative z-10 py-20 lg:py-28">
          <p className="text-accent-400 text-sm font-semibold uppercase tracking-widest mb-4 animate-fade-in">
            Premium Self-Drive Camper Rentals
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-sand-50 max-w-4xl text-balance leading-[1.1]">
            Travel. Stay. Explore.{" "}
            <span className="text-accent-400">Your Home on Wheels.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-sand-300 max-w-xl leading-relaxed">
            Rent a fully equipped camper van and hit the road on your terms.
            No driver — just freedom, comfort, and adventure.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => void handleBookClick()}
              className="inline-flex items-center justify-center rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-600"
            >
              Book Your Van
            </button>
            <ButtonLink
              href="/vans"
              variant="outline"
              size="lg"
              className="border-sand-400 text-sand-100 hover:border-accent-400 hover:text-accent-300"
            >
              Explore Our Vans
            </ButtonLink>
          </div>
        </div>
      </section>

      <PageContent className="bg-sand-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-600 mb-3">
            Step 3 Complete
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Public site shell is live
          </h2>
          <p className="mt-3 text-sand-500">
            Header, footer, mobile navigation, and WhatsApp CTA are ready.
            Full page content builds start in Step 4.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/vans" variant="secondary" size="sm">
              Our Vans
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="sm">
              Contact
            </ButtonLink>
            <Link
              href="/design-system"
              className="inline-flex items-center text-sm font-medium text-forest-600 hover:text-forest-700 underline-offset-4 hover:underline"
            >
              View design system
            </Link>
          </div>
        </div>
      </PageContent>
    </>
  );
}
