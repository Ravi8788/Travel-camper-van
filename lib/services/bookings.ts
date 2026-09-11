import { createClient } from "@/utils/supabase/client";

export type BookingInput = {
  vehicle_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  drop_location: string;
  travellers: number;
  rental_amount: number;
  security_deposit: number;
  total_amount: number;
};

export async function createBooking(input: BookingInput) {
  const supabase = createClient();
  const { data: conflicts, error: conflictError } = await supabase.from("bookings").select("id").eq("vehicle_id", input.vehicle_id).in("status", ["pending", "confirmed"]).lte("start_date", input.end_date).gte("end_date", input.start_date);
  if (conflictError) throw conflictError;
  if (conflicts && conflicts.length > 0) throw new Error("Those dates are no longer available. Please choose different dates.");
  const bookingNumber = `TOW-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { data, error } = await supabase.from("bookings").insert({ ...input, booking_number: bookingNumber, status: "pending", payment_status: "pending" }).select().single();
  if (error) throw error;
  return data;
}

// Mock payment seam: replace this function with Razorpay checkout later.
export async function mockProcessPayment(bookingId: string) {
  await new Promise((resolve) => window.setTimeout(resolve, 1200));
  const { data, error } = await createClient().from("bookings").update({ payment_status: "paid", status: "confirmed", booking_status: "confirmed" }).eq("id", bookingId).select().single();
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(id: string, status: string) {
  const { data, error } = await createClient().from("bookings").update({ status, booking_status: status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
