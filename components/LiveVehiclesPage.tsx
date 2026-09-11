"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Check, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { AdminShell } from "@/components/PhaseModules";
import { Button, Card, CardContent, CardHeader, CardTitle, FormField, Input, Select, Textarea } from "@/components/ui";
import { createVehicle, deleteVehicle, getVehicles, updateVehicle, uploadVehicleImage } from "@/lib/services/vehicles";
import type { Vehicle, VehicleImageTags, VehicleStatus } from "@/lib/types";

const imageTags: Array<keyof VehicleImageTags> = ["exterior", "interior", "kitchen", "bedroom", "washroom", "storage"];
const statusOptions = ["available", "booked", "on_rent", "maintenance", "inactive"].map((value) => ({ value, label: value.replace("_", " ") }));
const blankImageTags = (): VehicleImageTags => ({ exterior: [], interior: [], kitchen: [], bedroom: [], washroom: [], storage: [] });
const blankVehicle = (): Vehicle => ({
  id: "new", slug: "", name: "", model: "", registrationNumber: "", description: "", shortDescription: "", pricePerDay: 0, securityDeposit: 0,
  passengerCapacity: 2, sleepingCapacity: 2, fuelType: "diesel", transmission: "manual", dimensions: { lengthFt: 0, widthFt: 0, heightFt: 0 },
  dimensionsText: "", drivingRequirements: [], drivingRequirementsText: "", amenities: [], facilities: { bedroom: [], washroom: [], kitchen: [], storage: [], charging: [] },
  facilityDetails: { sleeping: "", kitchen: "", washroom: "", storage: "", charging: "", essentials: [] }, images: [], imageTags: blankImageTags(), videoUrl: "", coverImage: "", additionalCharges: [], status: "available", featured: false, createdAt: "", updatedAt: "",
});

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function LiveVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [draft, setDraft] = useState<Vehicle>(blankVehicle());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    try { setVehicles(await getVehicles()); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load vehicles."); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const reset = () => { setDraft(blankVehicle()); setEditingId(null); setTab("basic"); setError(""); };
  const patch = <K extends keyof Vehicle>(key: K, value: Vehicle[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const patchFacility = (key: keyof Vehicle["facilityDetails"], value: string | string[]) => setDraft((current) => ({ ...current, facilityDetails: { ...current.facilityDetails, [key]: value } }));

  const addItem = (key: "amenities" | "drivingRequirements" | "essentials", value: string) => {
    if (!value.trim()) return;
    if (key === "essentials") patchFacility(key, [...draft.facilityDetails.essentials, value.trim()]);
    else patch(key, [...draft[key], value.trim()]);
  };
  const removeItem = (key: "amenities" | "drivingRequirements" | "essentials", index: number) => {
    if (key === "essentials") patchFacility(key, draft.facilityDetails.essentials.filter((_, itemIndex) => itemIndex !== index));
    else patch(key, draft[key].filter((_, itemIndex) => itemIndex !== index));
  };
  const upload = async (event: ChangeEvent<HTMLInputElement>, tag: keyof VehicleImageTags) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map(uploadVehicleImage));
      patch("imageTags", { ...draft.imageTags, [tag]: [...draft.imageTags[tag], ...urls] });
      patch("images", Array.from(new Set([...draft.images, ...urls])));
      if (!draft.coverImage) patch("coverImage", urls[0]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Image upload failed."); } finally { event.target.value = ""; }
  };
  const validate = () => {
    if (!draft.name.trim()) return "Vehicle name is required.";
    if (!draft.registrationNumber.trim()) return "Registration number is required.";
    if (draft.pricePerDay <= 0) return "Daily rental price must be greater than zero.";
    if (draft.passengerCapacity <= 0 || draft.sleepingCapacity <= 0) return "Capacity values must be greater than zero.";
    return "";
  };
  const save = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setNotice("");
    const validationError = validate(); if (validationError) { setError(validationError); return; }
    setSaving(true);
    try {
      const gallery = Array.from(new Set([...draft.images, ...Object.values(draft.imageTags).flat()]));
      const payload = { ...draft, slug: draft.slug || slugify(draft.name), shortDescription: draft.shortDescription || draft.description.slice(0, 140), images: gallery, coverImage: draft.coverImage || gallery[0] };
      const saved = editingId ? await updateVehicle({ ...payload, id: editingId }) : await createVehicle(payload);
      setVehicles((current) => editingId ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      setNotice(editingId ? "Vehicle updated successfully." : "Vehicle created successfully."); reset();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save vehicle."); } finally { setSaving(false); }
  };
  const edit = (vehicle: Vehicle) => { setEditingId(vehicle.id); setDraft({ ...vehicle, imageTags: vehicle.imageTags ?? blankImageTags(), facilityDetails: vehicle.facilityDetails ?? blankVehicle().facilityDetails, additionalCharges: vehicle.additionalCharges ?? [] }); setTab("basic"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id: string) => { if (!window.confirm("Delete this vehicle?")) return; try { await deleteVehicle(id); setVehicles((current) => current.filter((item) => item.id !== id)); if (editingId === id) reset(); setNotice("Vehicle deleted."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete vehicle."); } };

  const listEditor = (label: string, items: string[], key: "amenities" | "drivingRequirements" | "essentials") => <div className="space-y-2"><div className="flex flex-wrap gap-2">{items.map((item, index) => <span key={`${item}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{item}<button type="button" onClick={() => removeItem(key, index)} aria-label={`Remove ${item}`}><X className="h-3 w-3" /></button></span>)}</div><div className="flex gap-2"><Input placeholder={label} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addItem(key, event.currentTarget.value); event.currentTarget.value = ""; } }} /><Button type="button" size="sm" variant="outline" onClick={(event) => { const input = event.currentTarget.previousElementSibling as HTMLInputElement; addItem(key, input.value); input.value = ""; }}><Plus className="h-4 w-4" /> Add</Button></div></div>;

  return <AdminShell><main className="admin-page p-4 sm:p-8"><header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-slate-500">Live Supabase fleet</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Vehicles</h1><p className="mt-2 text-sm text-slate-500">Create, edit, price, describe, and publish every camper in your fleet.</p></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => void load()}><RefreshCw className="h-4 w-4" /> Refresh</Button><Button type="button" size="sm" onClick={reset}><Plus className="h-4 w-4" /> New vehicle</Button></div></header>{(error || notice) && <p className={`mb-4 rounded-xl p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || notice}</p>}
    <Card className="mb-6" padding="none"><CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 p-5"><CardTitle>{editingId ? "Edit vehicle" : "Add vehicle"}</CardTitle>{editingId && <Button type="button" size="icon" variant="ghost" onClick={reset} aria-label="Close editor"><X className="h-4 w-4" /></Button>}</CardHeader><CardContent className="p-5"><form onSubmit={save} className="space-y-6"><div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-2">{["basic", "capacity", "facilities", "pricing", "media"].map((item) => <button type="button" key={item} onClick={() => setTab(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold capitalize ${tab === item ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{item}</button>)}</div>
      {tab === "basic" && <div className="grid gap-4 md:grid-cols-2"><FormField label="Vehicle name" required><Input value={draft.name} onChange={(event) => patch("name", event.target.value)} placeholder="Mahabaleshwar Cruiser" /></FormField><FormField label="Model"><Input value={draft.model} onChange={(event) => patch("model", event.target.value)} placeholder="Tata Winger" /></FormField><FormField label="Registration number" required><Input value={draft.registrationNumber} onChange={(event) => patch("registrationNumber", event.target.value)} placeholder="MH12AB1234" /></FormField><FormField label="Status"><Select value={draft.status} onChange={(event) => patch("status", event.target.value as VehicleStatus)} options={statusOptions} /></FormField><FormField label="Description" className="md:col-span-2"><Textarea value={draft.description} onChange={(event) => patch("description", event.target.value)} placeholder="Describe this camper for customers" /></FormField><FormField label="Short description" className="md:col-span-2"><Input value={draft.shortDescription} onChange={(event) => patch("shortDescription", event.target.value)} placeholder="A compact summary for cards" /></FormField></div>}
      {tab === "capacity" && <div className="grid gap-4 md:grid-cols-2"><FormField label="Passengers" required><Input type="number" min={1} value={draft.passengerCapacity} onChange={(event) => patch("passengerCapacity", Number(event.target.value))} /></FormField><FormField label="Beds" required><Input type="number" min={1} value={draft.sleepingCapacity} onChange={(event) => patch("sleepingCapacity", Number(event.target.value))} /></FormField><FormField label="Fuel"><Select value={draft.fuelType} onChange={(event) => patch("fuelType", event.target.value as Vehicle["fuelType"])} options={["diesel", "petrol", "cng", "electric"].map((value) => ({ value, label: value }))} /></FormField><FormField label="Transmission"><Select value={draft.transmission} onChange={(event) => patch("transmission", event.target.value as Vehicle["transmission"])} options={[{ value: "manual", label: "Manual" }, { value: "automatic", label: "Automatic" }]} /></FormField><FormField label="Dimensions"><Input value={draft.dimensionsText ?? ""} onChange={(event) => patch("dimensionsText", event.target.value)} placeholder="18 ft x 7 ft x 9 ft" /></FormField><FormField label="Driving requirements"><Input value={draft.drivingRequirementsText ?? ""} onChange={(event) => patch("drivingRequirementsText", event.target.value)} placeholder="Valid Indian driving licence" /></FormField></div>}
      {tab === "facilities" && <div className="space-y-5"><div className="grid gap-4 md:grid-cols-2">{(["sleeping", "kitchen", "washroom", "storage", "charging"] as const).map((key) => <FormField key={key} label={`${key} details`}><Input value={draft.facilityDetails[key]} onChange={(event) => patchFacility(key, event.target.value)} placeholder={`Describe the ${key} area`} /></FormField>)}</div><FormField label="Travel essentials">{listEditor("Add an essential", draft.facilityDetails.essentials, "essentials")}</FormField><FormField label="Amenities">{listEditor("Add an amenity", draft.amenities, "amenities")}</FormField><FormField label="Driving requirements">{listEditor("Add a requirement", draft.drivingRequirements, "drivingRequirements")}</FormField></div>}
      {tab === "pricing" && <div className="space-y-5"><div className="grid gap-4 md:grid-cols-2"><FormField label="Daily rental price" required><Input type="number" min={0} value={draft.pricePerDay} onChange={(event) => patch("pricePerDay", Number(event.target.value))} /></FormField><FormField label="Security deposit"><Input type="number" min={0} value={draft.securityDeposit} onChange={(event) => patch("securityDeposit", Number(event.target.value))} /></FormField></div><div className="flex items-center justify-between"><h3 className="font-semibold">Additional charges</h3><Button type="button" size="sm" variant="outline" onClick={() => patch("additionalCharges", [...draft.additionalCharges, { name: "", amount: 0 }])}><Plus className="h-4 w-4" /> Add charge</Button></div>{draft.additionalCharges.map((charge, index) => <div key={index} className="grid gap-2 md:grid-cols-[1fr_160px_40px]"><Input value={charge.name} onChange={(event) => patch("additionalCharges", draft.additionalCharges.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} placeholder="Late return" /><Input type="number" min={0} value={charge.amount} onChange={(event) => patch("additionalCharges", draft.additionalCharges.map((item, itemIndex) => itemIndex === index ? { ...item, amount: Number(event.target.value) } : item))} /><Button type="button" size="icon" variant="ghost" onClick={() => patch("additionalCharges", draft.additionalCharges.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove charge"><Trash2 className="h-4 w-4 text-red-600" /></Button></div>)}</div>}
      {tab === "media" && <div className="space-y-5"><div className="grid gap-4 md:grid-cols-2">{imageTags.map((tag) => <div key={tag} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold capitalize">{tag} images</h3><label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"><Upload className="h-3 w-3" /> Upload<input type="file" accept="image/*" multiple className="hidden" onChange={(event) => void upload(event, tag)} /></label></div><div className="flex flex-wrap gap-2">{draft.imageTags[tag].map((src, index) => <div key={`${src}-${index}`} className="relative h-20 w-20 overflow-hidden rounded-lg"><img src={src} alt={`${tag} ${index + 1}`} className="h-full w-full object-cover" /><button type="button" className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white" onClick={() => { patch("imageTags", { ...draft.imageTags, [tag]: draft.imageTags[tag].filter((_, itemIndex) => itemIndex !== index) }); patch("images", draft.images.filter((image) => image !== src)); }} aria-label={`Remove ${tag} image`}><X className="h-3 w-3" /></button><button type="button" className="absolute inset-x-1 bottom-1 rounded bg-black/60 px-1 text-[10px] text-white" onClick={() => patch("coverImage", src)}>Set cover</button></div>)}</div>{!draft.imageTags[tag].length && <p className="text-sm text-slate-500">No images uploaded.</p>}</div>)}</div><FormField label="Video tour URL"><Input value={draft.videoUrl ?? ""} onChange={(event) => patch("videoUrl", event.target.value)} placeholder="https://youtube.com/..." /></FormField>{draft.coverImage && <div className="rounded-xl border border-slate-200 p-3"><p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Camera className="h-4 w-4" /> Cover image</p><img src={draft.coverImage} alt="Vehicle cover" className="h-40 w-full rounded-lg object-cover" /></div>}</div>}
      <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row"><Button type="button" variant="outline" onClick={reset}>Clear</Button>{editingId && <Button type="button" variant="danger" onClick={() => void remove(editingId)}><Trash2 className="h-4 w-4" /> Delete</Button>}<Button type="submit" loading={saving}><Check className="h-4 w-4" /> {editingId ? "Update vehicle" : "Save vehicle"}</Button></div></form></CardContent></Card>
    <Card padding="none"><CardHeader className="p-5"><CardTitle>Saved vehicles</CardTitle></CardHeader><CardContent className="space-y-2 p-5 pt-0">{loading ? <p className="text-sm text-slate-500">Loading vehicles...</p> : vehicles.length === 0 ? <p className="text-sm text-slate-500">No vehicles saved yet.</p> : vehicles.map((vehicle) => <div key={vehicle.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"><div className="flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">{(vehicle.coverImage || vehicle.images[0]) && <img src={vehicle.coverImage || vehicle.images[0]} alt={vehicle.name} className="h-full w-full object-cover" />}</div><div><p className="font-semibold">{vehicle.name}</p><p className="text-xs text-slate-500">{vehicle.registrationNumber || vehicle.model} - {vehicle.passengerCapacity} seats / {vehicle.sleepingCapacity} beds</p></div></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => edit(vehicle)}>Edit</Button><Button type="button" size="icon" variant="ghost" onClick={() => void remove(vehicle.id)} aria-label={`Delete ${vehicle.name}`}><Trash2 className="h-4 w-4 text-red-600" /></Button></div></div>)}</CardContent></Card>
  </main></AdminShell>;
}

