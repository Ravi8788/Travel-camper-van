"use client";

import { useEffect, useState } from "react";
import { Check, Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/PhaseModules";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Textarea } from "@/components/ui";
import { createAdminRow, deleteAdminRow, getAdminRows, updateAdminRow, type AdminTable } from "@/lib/services/adminData";

export type Section = Exclude<AdminTable, "pricing_config" | "business_settings"> | "pricing" | "settings";
const config: Record<Section, { table: AdminTable; title: string; description: string; columns: string[] }> = {
  customers: { table: "customers", title: "Customers", description: "Live customer accounts and verification records.", columns: ["name", "email", "phone", "status"] },
  bookings: { table: "bookings", title: "Bookings", description: "Live bookings without route-based requirements.", columns: ["booking_number", "start_date", "end_date", "status", "payment_status", "total_amount"] },
  reviews: { table: "reviews", title: "Reviews", description: "Moderate customer feedback from Supabase.", columns: ["customer_name", "rating", "destination", "status"] },
  offers: { table: "offers", title: "Offers", description: "Manage live promotional offers.", columns: ["name", "discount_percent", "start_date", "end_date", "status"] },
  destinations: { table: "destinations", title: "Destinations", description: "Inspiration content only. Destinations are not required for bookings.", columns: ["name", "recommended_duration", "route_info", "featured"] },
  availability: { table: "availability", title: "Availability", description: "Live vehicle date availability and maintenance blocks.", columns: ["vehicle_id", "date", "status", "note"] },
  pricing: { table: "pricing_config", title: "Pricing", description: "Central pricing defaults and rules.", columns: ["default_price_per_day", "default_security_deposit"] },
  settings: { table: "business_settings", title: "Settings", description: "Business information and booking policies.", columns: ["business_name", "email", "phone", "advance_booking_days"] },
};

const pretty = (key: string) => key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function LiveAdminModule({ section }: { section: Section }) {
  const current = config[section];
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const load = async () => {
    setLoading(true); setError("");
    try { setRows(await getAdminRows(current.table) as Record<string, unknown>[]); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load live data. Run the core Supabase migration first."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [current.table]);

  const save = async () => {
    if (!editing) return;
    try {
      const id = String(editing.id ?? true);
      const values = Object.fromEntries(current.columns.map((column) => [column, editing[column]]));
      if (editing.id) await updateAdminRow(current.table, id, values);
      else await createAdminRow(current.table, values);
      setNotice("Saved to Supabase."); setEditing(null); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this record."); }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this record?")) return;
    try { await deleteAdminRow(current.table, id); setRows((items) => items.filter((item) => String(item.id) !== id)); setNotice("Deleted from Supabase."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete this record."); }
  };

  return <AdminShell><main className="admin-page p-5 sm:p-8"><header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-slate-500">Live Supabase module</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{current.title}</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">{current.description}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => void load()}><RefreshCw className="h-4 w-4" /> Refresh</Button><Button size="sm" onClick={() => setEditing({})}><Plus className="h-4 w-4" /> Add</Button></div></header>{(error || notice) && <p className={`mb-4 rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-forest-50 text-forest-700"}`}>{error || notice}</p>}{editing && <Card className="mb-5"><CardHeader><CardTitle>{editing.id ? "Edit record" : `Add ${current.title.toLowerCase()}`}</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">{current.columns.map((column) => <label key={column} className="space-y-1 text-sm font-medium"><span>{pretty(column)}</span>{column === "status" ? <Select value={String(editing[column] ?? "")} onChange={(event) => setEditing({ ...editing, [column]: event.target.value })} options={[{ value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "confirmed", label: "Confirmed" }, { value: "approved", label: "Approved" }, { value: "published", label: "Published" }, { value: "draft", label: "Draft" }, { value: "blocked", label: "Blocked" }]} /> : <Input value={String(editing[column] ?? "")} onChange={(event) => setEditing({ ...editing, [column]: event.target.value })} />}</label>)}<div className="flex gap-2 sm:col-span-2"><Button onClick={() => void save()}><Check className="h-4 w-4" /> Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div></CardContent></Card>}{loading ? <Card><CardContent className="p-6 text-sm text-slate-500">Loading live records...</CardContent></Card> : rows.length === 0 ? <Card><CardContent className="p-8 text-center text-sm text-slate-500">No live records yet. Add the first one above.</CardContent></Card> : <Card><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{current.columns.map((column) => <th className="p-3" key={column}>{pretty(column)}</th>)}<th className="p-3">Actions</th></tr></thead><tbody>{rows.map((row) => <tr className="border-b border-slate-100" key={String(row.id)}>{current.columns.map((column) => <td className="p-3" key={column}>{typeof row[column] === "object" ? JSON.stringify(row[column]) : String(row[column] ?? "-" )}</td>)}<td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setEditing(row)} aria-label="Edit"><Edit3 className="h-4 w-4" /></Button>{row.id && <Button size="icon" variant="ghost" onClick={() => void remove(String(row.id))} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-600" /></Button>}</div></td></tr>)}</tbody></table></CardContent></Card>}</main></AdminShell>;
}
