import { createClient } from "@/utils/supabase/client";
import type { Vehicle } from "@/lib/types";

const defaultImageTags = {
  exterior: [],
  interior: [],
  kitchen: [],
  bedroom: [],
  washroom: [],
  storage: [],
};

const defaultFacilityDetails = {
  sleeping: "",
  kitchen: "",
  washroom: "",
  storage: "",
  charging: "",
  essentials: [],
};

const fromRow = (row: Record<string, unknown>): Vehicle => ({
  id: String(row.id),
  slug: String(row.slug ?? ""),
  name: String(row.name ?? ""),
  model: String(row.model ?? ""),
  registrationNumber: String(row.registration_number ?? ""),
  description: String(row.description ?? ""),
  shortDescription: String(row.short_description ?? ""),
  pricePerDay: Number(row.price_per_day ?? 0),
  securityDeposit: Number(row.security_deposit ?? 0),
  passengerCapacity: Number(row.passenger_capacity ?? 1),
  sleepingCapacity: Number(row.sleeping_capacity ?? 1),
  fuelType: (row.fuel_type as Vehicle["fuelType"]) ?? "diesel",
  transmission: (row.transmission as Vehicle["transmission"]) ?? "manual",
  dimensions: (row.dimensions ?? { lengthFt: 0, widthFt: 0, heightFt: 0 }) as Vehicle["dimensions"],
  dimensionsText: row.dimensions_text ? String(row.dimensions_text) : undefined,
  drivingRequirements: (row.driving_requirements ?? []) as string[],
  drivingRequirementsText: row.driving_requirements_text ? String(row.driving_requirements_text) : undefined,
  amenities: (row.amenities ?? []) as string[],
  facilities: (row.facilities ?? { bedroom: [], washroom: [], kitchen: [], storage: [], charging: [] }) as Vehicle["facilities"],
  facilityDetails: (row.facility_details ?? defaultFacilityDetails) as Vehicle["facilityDetails"],
  images: (row.images ?? []) as string[],
  imageTags: (row.image_tags ?? defaultImageTags) as Vehicle["imageTags"],
  videoUrl: row.video_url as string | undefined,
  coverImage: row.cover_image ? String(row.cover_image) : undefined,
  additionalCharges: (row.additional_charges ?? []) as Vehicle["additionalCharges"],
  status: (row.status as Vehicle["status"]) ?? "available",
  featured: Boolean(row.featured),
  createdAt: String(row.created_at ?? ""),
  updatedAt: String(row.updated_at ?? ""),
});

const toRow = (vehicle: Vehicle, includeId = true) => ({
  ...(includeId && vehicle.id !== "new" ? { id: vehicle.id } : {}),
  slug: vehicle.slug,
  name: vehicle.name,
  model: vehicle.model,
  registration_number: vehicle.registrationNumber,
  description: vehicle.description,
  short_description: vehicle.shortDescription,
  price_per_day: vehicle.pricePerDay,
  security_deposit: vehicle.securityDeposit,
  passenger_capacity: vehicle.passengerCapacity,
  sleeping_capacity: vehicle.sleepingCapacity,
  fuel_type: vehicle.fuelType,
  transmission: vehicle.transmission,
  dimensions: vehicle.dimensions,
  dimensions_text: vehicle.dimensionsText ?? "",
  driving_requirements: vehicle.drivingRequirements,
  driving_requirements_text: vehicle.drivingRequirementsText ?? "",
  amenities: vehicle.amenities,
  facilities: vehicle.facilities,
  facility_details: vehicle.facilityDetails,
  images: vehicle.images,
  image_tags: vehicle.imageTags,
  video_url: vehicle.videoUrl,
  cover_image: vehicle.coverImage,
  additional_charges: vehicle.additionalCharges,
  status: vehicle.status,
  featured: vehicle.featured,
});

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await createClient().from("vehicles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => fromRow(row));
}

export async function createVehicle(vehicle: Vehicle): Promise<Vehicle> {
  const { data, error } = await createClient().from("vehicles").insert(toRow(vehicle, false)).select().single();
  if (error) throw new Error(`Vehicle save failed: ${error.message}${error.details ? ` (${error.details})` : ""}`);
  return fromRow(data);
}

export async function updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
  const { data, error } = await createClient().from("vehicles").update(toRow(vehicle)).eq("id", vehicle.id).select().single();
  if (error) throw new Error(`Vehicle update failed: ${error.message}${error.details ? ` (${error.details})` : ""}`);
  return fromRow(data);
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await createClient().from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadVehicleImage(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const supabase = createClient();
  const { error } = await supabase.storage.from("vehicle-images").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase.storage.from("vehicle-images").getPublicUrl(path).data.publicUrl;
}
