import { redirect } from "next/navigation";
import { PlatformScreen } from "@/components/PlatformScreen";
import { AdminPackagesPage } from "@/components/AdminPackagesPage";
import { PublicPackageDetailsPage, PublicPackagesPage } from "@/components/PublicPackagesPage";
import { AdminDashboardUpgrade } from "@/components/AdminDashboardUpgrade";
import { LiveAdminModule, type Section } from "@/components/LiveAdminModule";
import { RealBookingPage } from "@/components/RealBookingPage";
import { Footer, Header, WhatsAppCTA } from "@/components/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const isAdminRoute = slug[0] === "admin";
  if (isAdminRoute && slug[1] !== "login") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") redirect("/admin/login");
  }
  if (slug.join("/") === "packages") return <><Header /><main><PublicPackagesPage /></main><Footer /><WhatsAppCTA /></>;
  if (slug[0] === "packages" && slug[1]) return <><Header /><main><PublicPackageDetailsPage slug={slug[1]} /></main><Footer /><WhatsAppCTA /></>;
  if (slug.join("/") === "book") return <><Header /><main><RealBookingPage /></main><Footer /><WhatsAppCTA /></>;
  if (slug.join("/") === "admin") return <main className="admin-shell"><AdminDashboardUpgrade /></main>;
  if (slug.join("/") === "admin/packages") return <main className="admin-shell"><AdminPackagesPage /></main>;
  const liveSections = ["customers", "bookings", "reviews", "offers", "destinations", "availability", "pricing", "settings"];
  if (isAdminRoute && slug[1] && liveSections.includes(slug[1])) return <main className="admin-shell"><LiveAdminModule section={slug[1] as Section} /></main>;
  if (isAdminRoute) return <main className="admin-shell"><PlatformScreen slug={slug} /></main>;
  return <><Header /><main><PlatformScreen slug={slug} /></main><Footer /><WhatsAppCTA /></>;
}
