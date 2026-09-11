"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Edit3, ImagePlus, Package, Plus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/PhaseModules";
import { Button, Card, CardContent, CardHeader, CardTitle, FormField, Input, Select, Textarea } from "@/components/ui";
import { createPackage, deletePackage, getAllPackagesAdmin, type PackageInput, type PackageItineraryDay, type PackageRecord, type PackageStatus, updatePackage, uploadPackageImage } from "@/lib/services/packages";

type Draft = PackageInput;
const blankDay = (day: number): PackageItineraryDay => ({ day, title: "", description: "", activities: [] });
const blankDraft: Draft = { title: "", slug: "", location: "Mahabaleshwar", description: "", duration_days: 3, price: 0, inclusions: [], exclusions: [], itinerary: [blankDay(1)], images: [], status: "Draft" };
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    try { setPackages(await getAllPackagesAdmin()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load packages."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const reset = () => { setDraft(blankDraft); setEditingId(null); setFiles([]); setError(""); };
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const days = Array.isArray(draft.itinerary) ? draft.itinerary as PackageItineraryDay[] : [];
  const updateDay = (index: number, patch: Partial<PackageItineraryDay>) => set("itinerary", days.map((day, dayIndex) => dayIndex === index ? { ...day, ...patch } : day));
  const addDay = () => set("itinerary", [...days, blankDay(days.length + 1)]);
  const removeDay = (index: number) => set("itinerary", days.filter((_, dayIndex) => dayIndex !== index).map((day, dayIndex) => ({ ...day, day: dayIndex + 1 })));
  const edit = (item: PackageRecord) => { setEditingId(item.id); setDraft({ ...item, itinerary: item.itinerary?.length ? item.itinerary : [blankDay(1)], inclusions: item.inclusions ?? [], exclusions: item.exclusions ?? [], images: item.images ?? [] }); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const uploaded = await Promise.all(files.map(uploadPackageImage));
      const payload = { ...draft, images: [...draft.images, ...uploaded], price: Number(draft.price), duration_days: Number(draft.duration_days) };
      if (editingId) await updatePackage(editingId, payload); else await createPackage(payload);
      setNotice(editingId ? "Package updated." : "Package created."); reset(); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save package."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this package? This cannot be undone.")) return;
    try { await deletePackage(id); setPackages((current) => current.filter((item) => item.id !== id)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete package."); }
  };

  const togglePublished = async (item: PackageRecord) => {
    try {
      const status: PackageStatus = item.status === "Published" ? "Draft" : "Published";
      const updated = await updatePackage(item.id, { status });
      setPackages((current) => current.map((currentItem) => currentItem.id === item.id ? updated : currentItem));
      setNotice(status === "Published" ? "Package published." : "Package hidden from the public page.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not change package visibility.");
    }
  };

  const renderList = (key: "inclusions" | "exclusions", label: string) => <FormField className="sm:col-span-2" label={label} hint="Add one item at a time"><div className="space-y-2">{draft[key].map((item, index) => <div className="flex gap-2" key={`${key}-${index}`}><Input value={item} onChange={(event) => set(key, draft[key].map((value, valueIndex) => valueIndex === index ? event.target.value : value))} placeholder={label.slice(0, -1)} /><Button type="button" size="icon" variant="ghost" onClick={() => set(key, draft[key].filter((_, valueIndex) => valueIndex !== index))} aria-label={`Remove ${label.toLowerCase().slice(0, -1)}`}><X className="h-4 w-4" /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => set(key, [...draft[key], ""])}><Plus className="h-4 w-4" /> Add item</Button></div></FormField>;

  const visible = packages.filter((item) => `${item.title} ${item.location}`.toLowerCase().includes(search.toLowerCase()));
  return <AdminShell><main className="admin-page p-5 sm:p-8"><header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-slate-500">Live Supabase data</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Packages</h1><p className="mt-2 text-sm text-slate-500">Create simple, bookable escapes for Mahabaleshwar, Panchgani, and Tapola.</p></div><Button variant="outline" onClick={reset}><Plus className="h-4 w-4" /> New package</Button></header>{(error || notice) && <p className={`mb-4 rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-forest-50 text-forest-700"}`}>{error || notice}</p>}<Card className="mb-5"><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{editingId ? "Edit package" : "Create package"}</CardTitle>{editingId && <Button size="icon" variant="ghost" onClick={reset} aria-label="Close editor"><X className="h-5 w-5" /></Button>}</CardHeader><CardContent><form className="grid gap-4 sm:grid-cols-2" onSubmit={save}><FormField label="Package name" required><Input required value={draft.title} onChange={(event) => { set("title", event.target.value); if (!editingId) set("slug", slugify(event.target.value)); }} placeholder="Monsoon lake escape" /></FormField><FormField label="Web address" hint="Generated automatically"><Input required value={draft.slug} onChange={(event) => set("slug", slugify(event.target.value))} /></FormField><FormField label="Location" required><Select value={draft.location} onChange={(event) => set("location", event.target.value)} options={[{ value: "Mahabaleshwar", label: "Mahabaleshwar" }, { value: "Panchgani", label: "Panchgani" }, { value: "Tapola", label: "Tapola" }]} /></FormField><FormField label="Visibility"><Select value={draft.status} onChange={(event) => set("status", event.target.value as PackageStatus)} options={[{ value: "Draft", label: "Draft - keep private" }, { value: "Published", label: "Published - show publicly" }, { value: "Unavailable", label: "Unavailable - hide temporarily" }]} /></FormField><FormField label="How many days?" required><Input required min={1} type="number" value={draft.duration_days} onChange={(event) => set("duration_days", Number(event.target.value))} /></FormField><FormField label="Price (INR)" required><Input required min={0} type="number" value={draft.price} onChange={(event) => set("price", Number(event.target.value))} /></FormField><FormField className="sm:col-span-2" label="Short description" required><Textarea required value={draft.description} onChange={(event) => set("description", event.target.value)} placeholder="What makes this trip special?" /></FormField>{renderList("inclusions", "What's included?")}{renderList("exclusions", "What's not included?")}<section className="sm:col-span-2"><div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Day-by-day plan</h3><p className="text-xs text-slate-500">Write the plan in normal words. No JSON or CSV.</p></div><Button type="button" size="sm" variant="outline" onClick={addDay}><Plus className="h-4 w-4" /> Add day</Button></div><div className="space-y-3">{days.map((day, index) => <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={`day-${index}`}><div className="mb-2 flex items-center justify-between"><strong>Day {index + 1}</strong>{days.length > 1 && <Button type="button" size="icon" variant="ghost" onClick={() => removeDay(index)} aria-label={`Remove day ${index + 1}`}><Trash2 className="h-4 w-4 text-red-600" /></Button>}</div><div className="grid gap-2"><Input required value={day.title} onChange={(event) => updateDay(index, { title: event.target.value })} placeholder="Day title" /><Textarea value={day.description ?? ""} onChange={(event) => updateDay(index, { description: event.target.value })} placeholder="What will guests do this day?" /><Input value={(day.activities ?? []).join(", ")} onChange={(event) => updateDay(index, { activities: event.target.value.split(",").map((activity) => activity.trim()).filter(Boolean) })} placeholder="Activities, separated by commas" /></div></div>)}</div></section><FormField className="sm:col-span-2" label="Photos"><Input type="file" accept="image/*" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /><p className="mt-1 text-xs text-slate-500">Choose one or more photos. The first photo becomes the cover.</p></FormField><div className="flex flex-wrap gap-2 sm:col-span-2"><Button type="submit" loading={saving}><Package className="h-4 w-4" /> {editingId ? "Save package" : "Create package"}</Button>{editingId && <Button type="button" variant="outline" onClick={reset}>Cancel</Button>}</div></form></CardContent></Card><div className="mb-3 flex items-center gap-3"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search packages" className="max-w-md bg-white" /><span className="text-sm text-slate-500">{packages.length} total</span></div>{loading ? <Card><CardContent className="p-5 text-sm text-slate-500">Loading packages...</CardContent></Card> : visible.length === 0 ? <Card><CardContent className="p-8 text-center text-sm text-slate-500"><ImagePlus className="mx-auto mb-2 h-8 w-8" />No packages yet.</CardContent></Card> : <div className="grid gap-3 lg:grid-cols-2">{visible.map((item) => <Card key={item.id} padding="none"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-accent-600">{item.location}</p><h2 className="mt-1 text-xl font-bold">{item.title}</h2></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{item.status}</span></div><p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.description}</p><div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm"><span>{item.duration_days} days · INR {Number(item.price).toLocaleString("en-IN")}</span><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => edit(item)} aria-label={`Edit ${item.title}`}><Edit3 className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(item.id)} aria-label={`Delete ${item.title}`}><Trash2 className="h-4 w-4 text-red-600" /></Button></div></div></CardContent></Card>)}</div>}</main></AdminShell>;
}
