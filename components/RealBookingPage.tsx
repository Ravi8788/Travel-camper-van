"use client";

import { useState } from "react";
import { Check, CreditCard, LoaderCircle } from "lucide-react";
import { Button, Card, CardContent, Container, FormField, Input, Select } from "@/components/ui";
import { useVansStore } from "@/lib/store/VansStore";
import { createBooking, mockProcessPayment } from "@/lib/services/bookings";
import { getUnavailableDates } from "@/lib/services/availability";
import { formatCurrency } from "@/lib/utils";

export function RealBookingPage() {
  const { vehicles } = useVansStore();
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [form, setForm] = useState({ name: "", email: "", phone: "", start: "", end: "", pickup: "Pune", drop: "Pune", travellers: 2 });
  const [booking, setBooking] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const vehicle = vehicles.find((item) => item.id === vehicleId);
  const minDate = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10);
  const total = vehicle ? vehicle.pricePerDay * 3 + vehicle.securityDeposit : 0;

  const submit = async () => {
    if (!vehicle || !form.name || !form.email || !form.start || !form.end) { setError("Please complete the required booking details."); return; }
    setError(""); setProcessing(true);
    try {
      const unavailable = await getUnavailableDates(vehicle.id);
      if (unavailable.some((date) => date >= form.start && date <= form.end)) throw new Error("Some selected dates are unavailable. Please choose different dates.");
      const created = await createBooking({ vehicle_id: vehicle.id, guest_name: form.name, guest_email: form.email, guest_phone: form.phone, start_date: form.start, end_date: form.end, pickup_location: form.pickup, drop_location: form.drop, travellers: form.travellers, rental_amount: vehicle.pricePerDay * 3, security_deposit: vehicle.securityDeposit, total_amount: total });
      setBooking(created);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create booking."); }
    finally { setProcessing(false); }
  };

  const pay = async () => { if (!booking) return; setProcessing(true); setError(""); try { setBooking(await mockProcessPayment(booking.id)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Payment could not be processed."); } finally { setProcessing(false); } };
  if (booking?.status === "confirmed") return <Container className="py-16"><Card className="mx-auto max-w-xl"><CardContent className="p-8 text-center"><Check className="mx-auto h-12 w-12 text-emerald-600" /><p className="mt-5 text-sm font-bold uppercase tracking-widest text-emerald-700">Booking confirmed</p><h1 className="mt-2 font-display text-3xl font-bold">{booking.booking_number}</h1><p className="mt-3 text-slate-500">Your payment was simulated successfully and the booking is saved in Supabase.</p></CardContent></Card></Container>;
  return <Container className="py-10 sm:py-16"><Card className="mx-auto max-w-3xl"><CardContent className="p-5 sm:p-8"><p className="text-sm font-bold uppercase tracking-widest text-accent-600">Live booking</p><h1 className="mt-2 font-display text-4xl font-bold">Reserve your home on wheels</h1>{error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{!booking ? <div className="mt-8 grid gap-5 sm:grid-cols-2"><FormField label="Vehicle" required><Select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} options={vehicles.map((item) => ({ value: item.id, label: item.name }))} /></FormField><FormField label="Travellers"><Input type="number" min={1} value={form.travellers} onChange={(event) => setForm({ ...form, travellers: Number(event.target.value) })} /></FormField><FormField label="Name" required><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField><FormField label="Email" required><Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></FormField><FormField label="Phone"><Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></FormField><FormField label="Pickup location"><Input value={form.pickup} onChange={(event) => setForm({ ...form, pickup: event.target.value })} /></FormField><FormField label="Return location"><Input value={form.drop} onChange={(event) => setForm({ ...form, drop: event.target.value })} /></FormField><FormField label="Pickup date" required><Input type="date" min={minDate} value={form.start} onChange={(event) => setForm({ ...form, start: event.target.value })} /></FormField><FormField label="Return date" required><Input type="date" min={form.start || minDate} value={form.end} onChange={(event) => setForm({ ...form, end: event.target.value })} /></FormField><div className="flex items-end sm:col-span-2"><Button onClick={() => void submit()} loading={processing}>Continue to payment</Button></div></div> : <div className="mt-8 rounded-xl bg-slate-50 p-6"><div className="flex items-center gap-3"><CreditCard className="h-6 w-6 text-slate-700" /><div><h2 className="font-semibold">Mock payment</h2><p className="text-sm text-slate-500">This simulates a gateway checkout. No real payment is taken.</p></div></div><p className="mt-6 text-3xl font-bold">{formatCurrency(total)}</p><Button className="mt-6" onClick={() => void pay()} disabled={processing}>{processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Pay now (simulated)</Button></div>}</CardContent></Card></Container>;
}
