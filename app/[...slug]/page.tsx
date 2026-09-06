import { PlatformScreen } from "@/components/PlatformScreen";
import { Footer, Header, WhatsAppCTA } from "@/components/navigation";

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const isAdminRoute = slug[0] === "admin";
  if (isAdminRoute) return <main className="admin-shell"><PlatformScreen slug={slug} /></main>;
  return <><Header /><main><PlatformScreen slug={slug} /></main><Footer /><WhatsAppCTA /></>;
}
