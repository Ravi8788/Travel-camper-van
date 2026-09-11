import { createClient } from "@/utils/supabase/client";

export type PackageStatus = "Draft" | "Published" | "Unavailable";

export type PackageItineraryDay = {
  day: number;
  title: string;
  description?: string;
  activities?: string[];
};

export type PackageRecord = {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  duration_days: number;
  price: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: PackageItineraryDay[];
  images: string[];
  status: PackageStatus;
  created_at: string;
  updated_at: string;
};

export type PackageInput = Omit<PackageRecord, "id" | "created_at" | "updated_at" | "itinerary"> & { itinerary: unknown };

function normalizeInput(input: PackageInput) {
  let itinerary = input.itinerary;
  if (typeof itinerary === "string") {
    try {
      itinerary = JSON.parse(itinerary);
    } catch {
      throw new Error("Itinerary must contain valid JSON.");
    }
  }
  if (!Array.isArray(itinerary)) throw new Error("Itinerary must be a JSON array.");
  return { ...input, itinerary };
}

export async function getPublishedPackages(): Promise<PackageRecord[]> {
  const { data, error } = await createClient().from("packages").select("*").eq("status", "Published").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PackageRecord[];
}

export async function getPackageBySlug(slug: string): Promise<PackageRecord | null> {
  const { data, error } = await createClient().from("packages").select("*").eq("slug", slug).eq("status", "Published").maybeSingle();
  if (error) throw error;
  return data as PackageRecord | null;
}

export async function getAllPackagesAdmin(): Promise<PackageRecord[]> {
  const { data, error } = await createClient().from("packages").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PackageRecord[];
}

export async function createPackage(input: PackageInput): Promise<PackageRecord> {
  const { data, error } = await createClient().from("packages").insert(normalizeInput(input)).select().single();
  if (error) throw error;
  return data as PackageRecord;
}

export async function updatePackage(id: string, input: Partial<PackageInput>): Promise<PackageRecord> {
  const { data, error } = await createClient().from("packages").update(normalizeInput(input as PackageInput)).eq("id", id).select().single();
  if (error) throw error;
  return data as PackageRecord;
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await createClient().from("packages").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadPackageImage(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const supabase = createClient();
  const { error } = await supabase.storage.from("package-images").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase.storage.from("package-images").getPublicUrl(path).data.publicUrl;
}
