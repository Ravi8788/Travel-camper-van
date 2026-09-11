import { createClient } from "@/utils/supabase/client";

export type AvailabilityStatus = "available" | "blocked" | "maintenance";

export async function getAvailability(vehicleId: string, startDate?: string, endDate?: string) {
  let query = createClient().from("availability").select("*").eq("vehicle_id", vehicleId).order("date");
  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function blockDates(vehicleId: string, dates: string[], note = "") {
  return setDates(vehicleId, dates, "blocked", note);
}

export async function markMaintenance(vehicleId: string, dates: string[], note = "") {
  return setDates(vehicleId, dates, "maintenance", note);
}

async function setDates(vehicleId: string, dates: string[], status: AvailabilityStatus, note: string) {
  const rows = dates.map((date) => ({ vehicle_id: vehicleId, date, status, note }));
  const { data, error } = await createClient().from("availability").upsert(rows, { onConflict: "vehicle_id,date" }).select();
  if (error) throw error;
  return data ?? [];
}

export async function unblockDates(vehicleId: string, dates: string[]) {
  const { error } = await createClient().from("availability").delete().eq("vehicle_id", vehicleId).in("date", dates);
  if (error) throw error;
}

export async function getUnavailableDates(vehicleId: string) {
  const [availability, bookings] = await Promise.all([
    createClient().from("availability").select("date,status").eq("vehicle_id", vehicleId).in("status", ["blocked", "maintenance"]),
    createClient().from("bookings").select("start_date,end_date").eq("vehicle_id", vehicleId).in("status", ["pending", "confirmed"]),
  ]);
  if (availability.error) throw availability.error;
  if (bookings.error) throw bookings.error;
  const dates = (availability.data ?? []).map((row) => row.date as string);
  for (const booking of bookings.data ?? []) {
    const cursor = new Date(booking.start_date as string);
    const end = new Date(booking.end_date as string);
    while (cursor <= end) { dates.push(cursor.toISOString().slice(0, 10)); cursor.setDate(cursor.getDate() + 1); }
  }
  return [...new Set(dates)];
}
