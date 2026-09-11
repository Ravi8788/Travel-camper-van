"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, RefreshCw, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/PhaseModules";
import { Button, Card, CardContent, CardHeader, CardTitle, FormField, Input, Select } from "@/components/ui";
import { getVehicles } from "@/lib/services/vehicles";
import { blockDates, getAvailability, markMaintenance, unblockDates } from "@/lib/services/availability";
import { createClient } from "@/utils/supabase/client";
import type { Vehicle } from "@/lib/types";

type BookingRange = { start_date: string; end_date: string };
type AvailabilityRow = { id: string; vehicle_id: string; date: string; status: "available" | "blocked" | "maintenance"; note: string | null };

const dateKey = (date: Date) => date.toISOString().slice(0, 10);
const dateRange = (start: string, end: string) => {
  const dates: string[] = [];
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (cursor <= last) { dates.push(dateKey(cursor)); cursor.setDate(cursor.getDate() + 1); }
  return dates;
};

export function AvailabilityManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [rows, setRows] = useState<AvailabilityRow[]>([]);
  const [bookings, setBookings] = useState<BookingRange[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"blocked" | "maintenance">("blocked");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadVehicles = async () => {
    const items = await getVehicles();
    setVehicles(items);
    setVehicleId((current) => current || items[0]?.id || "");
  };
  const loadDates = async (selectedVehicleId = vehicleId) => {
    if (!selectedVehicleId) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const [availability, { data: bookingData, error: bookingError }] = await Promise.all([
        getAvailability(selectedVehicleId),
        supabase.from("bookings").select("start_date,end_date").eq("vehicle_id", selectedVehicleId).in("status", ["pending", "confirmed"]),
      ]);
      if (bookingError) throw bookingError;
      setRows((availability ?? []) as AvailabilityRow[]);
      setBookings((bookingData ?? []) as BookingRange[]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load availability."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadVehicles(); }, []);
  useEffect(() => { if (vehicleId) void loadDates(vehicleId); }, [vehicleId]);

  const bookedDates = useMemo(() => new Set(bookings.flatMap((booking) => dateRange(booking.start_date, booking.end_date))), [bookings]);
  const visibleDates = useMemo(() => Array.from({ length: 42 }, (_, index) => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() + index); return dateKey(date); }), []);
  const rowByDate = useMemo(() => new Map(rows.map((row) => [row.date, row])), [rows]);
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);

  const save = async () => {
    setError(""); setNotice("");
    if (!vehicleId) { setError("Select a vehicle first."); return; }
    if (!startDate || !endDate) { setError("Choose a start and end date."); return; }
    if (endDate < startDate) { setError("End date must be after the start date."); return; }
    const dates = dateRange(startDate, endDate);
    const bookedInRange = dates.filter((date) => bookedDates.has(date));
    if (bookedInRange.length && !window.confirm("This range includes an active booking. Add the block anyway?")) return;
    if (dates.some((date) => rowByDate.has(date))) { setError("This range overlaps an existing block. Edit or remove the existing block first."); return; }
    setSaving(true);
    try {
      if (status === "blocked") await blockDates(vehicleId, dates, note.trim());
      else await markMaintenance(vehicleId, dates, note.trim());
      setStartDate(""); setEndDate(""); setNote(""); setNotice("Availability saved successfully."); await loadDates();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save availability."); }
    finally { setSaving(false); }
  };

  const removeBlock = async (date: string) => {
    if (bookedDates.has(date)) return;
    try { await unblockDates(vehicleId, [date]); setRows((current) => current.filter((row) => row.date !== date)); setNotice("Date unblocked."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not unblock date."); }
  };

  return <AdminShell><main className="admin-page p-4 sm:p-8"><header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-slate-500">Live Supabase calendar</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Availability</h1><p className="mt-2 text-sm text-slate-500">Block dates and schedule maintenance. Booked dates come from real bookings and cannot be edited here.</p></div><Button type="button" size="sm" variant="outline" onClick={() => void loadDates()}><RefreshCw className="h-4 w-4" /> Refresh</Button></header>
    {(error || notice) && <p className={`mb-4 rounded-xl p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || notice}</p>}
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><div className="space-y-6"><Card><CardHeader><CardTitle>Select vehicle</CardTitle></CardHeader><CardContent><Select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} options={vehicles.map((vehicle) => ({ value: vehicle.id, label: vehicle.name }))} placeholder={vehicles.length ? "Choose a vehicle" : "No vehicles available"} /><p className="mt-2 text-xs text-slate-500">{selectedVehicle ? `${selectedVehicle.name} · ${selectedVehicle.registrationNumber || selectedVehicle.model}` : "Select a vehicle by name to manage its dates."}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Calendar</CardTitle></CardHeader><CardContent><div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-600"><span className="text-emerald-600">Available</span><span className="text-blue-600">Booked</span><span className="text-slate-600">Blocked</span><span className="text-orange-600">Maintenance</span></div>{loading ? <p className="text-sm text-slate-500">Loading dates...</p> : <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-7">{visibleDates.map((date) => { const row = rowByDate.get(date); const booked = bookedDates.has(date); const state = booked ? "booked" : row?.status ?? "available"; return <div key={date} className={`rounded-lg border p-2 text-center text-xs ${state === "booked" ? "border-blue-200 bg-blue-50 text-blue-700" : state === "blocked" ? "border-slate-300 bg-slate-100 text-slate-700" : state === "maintenance" ? "border-orange-200 bg-orange-50 text-orange-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}><strong className="block">{date.slice(8)}</strong><span className="capitalize">{state}</span></div>; })}</div>}</CardContent></Card></div>
      <div className="space-y-6"><Card><CardHeader><CardTitle>Add / block dates</CardTitle></CardHeader><CardContent className="space-y-4"><FormField label="Vehicle"><Select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} options={vehicles.map((vehicle) => ({ value: vehicle.id, label: vehicle.name }))} placeholder="Choose vehicle" /></FormField><div className="grid gap-4 sm:grid-cols-2"><FormField label="Start date"><Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></FormField><FormField label="End date"><Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></FormField></div><FormField label="Status"><Select value={status} onChange={(event) => setStatus(event.target.value as "blocked" | "maintenance")} options={[{ value: "blocked", label: "Blocked" }, { value: "maintenance", label: "Maintenance" }]} /></FormField><FormField label="Reason / note"><Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Annual service or owner use" /></FormField><Button type="button" className="w-full" loading={saving} onClick={() => void save()}><Check className="h-4 w-4" /> Save dates</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Current blocks</CardTitle></CardHeader><CardContent className="space-y-2">{rows.length === 0 ? <p className="text-sm text-slate-500">No blocked or maintenance dates for this vehicle.</p> : rows.map((row) => <div key={row.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"><div><p className="text-sm font-semibold capitalize">{row.status} · {row.date}</p><p className="text-xs text-slate-500">{row.note || "No note"}</p></div><Button type="button" size="icon" variant="ghost" disabled={bookedDates.has(row.date)} onClick={() => void removeBlock(row.date)} aria-label={`Unblock ${row.date}`}><Trash2 className="h-4 w-4 text-red-600" /></Button></div>)}</CardContent></Card></div></div>
  </main></AdminShell>;
}
