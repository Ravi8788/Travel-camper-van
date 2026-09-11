import { redirect } from "next/navigation";
import { PlatformScreen } from "@/components/PlatformScreen";
import { AdminPackagesPage } from "@/components/AdminPackagesPage";
import { PublicPackageDetailsPage, PublicPackagesPage } from "@/components/PublicPackagesPage";
import { AdminDashboardUpgrade } from "@/components/AdminDashboardUpgrade";
import { LiveAdminModule, type Section } from "@/components/LiveAdminModule";
import { RealBookingPage } from "@/components/RealBookingPage";
import { LiveVehiclesPage } from "@/components/LiveVehiclesPage";
import { Footer, Header, WhatsAppCTA } from "@/components/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function CatchAllPage({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const query = await searchParams;
  const path = slug.join("/");
  const isAdminRoute = slug[0] === "admin";
  const isCustomerRoute = ["account", "book"].includes(path) || path.startsWith("account/");

  if (isAdminRoute && slug[1] !== "login") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") redirect("/admin/login");
  }

  if (isCustomerRoute && path !== "book") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }

  if (path === "book") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
      : { data: null };
    if (!user || profile?.role !== "customer") {
      const packageSlug = typeof query.package === "string" ? query.package : "";
      const nextPath = packageSlug ? `/book?package=${encodeURIComponent(packageSlug)}` : "/book";
      redirect(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }
  if (slug.join("/") === "packages") return <><Header /><main><PublicPackagesPage /></main><Footer /><WhatsAppCTA /></>;
  if (slug[0] === "packages" && slug[1]) return <><Header /><main><PublicPackageDetailsPage slug={slug[1]} /></main><Footer /><WhatsAppCTA /></>;
  if (slug.join("/") === "book") return <><Header /><main><RealBookingPage /></main><Footer /><WhatsAppCTA /></>;
  if (slug.join("/") === "admin") return <main className="admin-shell"><AdminDashboardUpgrade /></main>;
  if (slug.join("/") === "admin/packages") return <main className="admin-shell"><AdminPackagesPage /></main>;
  if (slug.join("/") === "admin/vehicles") return <main className="admin-shell"><LiveVehiclesPage /></main>;
  const liveSections = ["customers", "bookings", "reviews", "offers", "destinations", "availability", "pricing", "settings"];
  if (isAdminRoute && slug[1] && liveSections.includes(slug[1])) return <main className="admin-shell"><LiveAdminModule section={slug[1] as Section} /></main>;
  if (isAdminRoute) return <main className="admin-shell"><PlatformScreen slug={slug} /></main>;
  return <><Header /><main><PlatformScreen slug={slug} /></main><Footer /><WhatsAppCTA /></>;
}
