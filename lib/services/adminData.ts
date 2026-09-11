import { createClient } from "@/utils/supabase/client";

export type AdminTable = "customers" | "bookings" | "reviews" | "offers" | "destinations" | "availability" | "pricing_config" | "business_settings";

export async function getAdminRows(table: AdminTable) {
  const query = createClient().from(table).select("*");
  const { data, error } = table === "pricing_config" || table === "business_settings" ? await query : await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateAdminRow(table: AdminTable, id: string, values: Record<string, unknown>) {
  const query = createClient().from(table).update(values);
  const { data, error } = table === "pricing_config" || table === "business_settings" ? await query.eq("id", true).select().single() : await query.eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAdminRow(table: AdminTable, id: string) {
  const { error } = await createClient().from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function createAdminRow(table: AdminTable, values: Record<string, unknown>) {
  const { data, error } = await createClient().from(table).insert(values).select().single();
  if (error) throw error;
  return data;
}
