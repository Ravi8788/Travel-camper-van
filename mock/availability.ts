import type { AvailabilityEntry } from "@/lib/types";

function generateAvailability(vehicleId: string, month: number, year: number): AvailabilityEntry[] {
  const entries: AvailabilityEntry[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    let status: AvailabilityEntry["status"] = "available";

    if (vehicleId === "veh-003" && day >= 20 && day <= 23) status = "booked";
    if (vehicleId === "veh-001" && day >= 10 && day <= 14) status = "booked";
    if (vehicleId === "veh-002" && day >= 1 && day <= 8) status = "booked";
    if (day === 15 && vehicleId === "veh-001") status = "maintenance";
    if (day === 28 && vehicleId === "veh-002") status = "blocked";

    entries.push({
      id: `avail-${vehicleId}-${date}`,
      vehicleId,
      date,
      status,
      note: status === "blocked" ? "Reserved for inspection" : undefined,
    });
  }

  return entries;
}

export const availability: AvailabilityEntry[] = [
  ...generateAvailability("veh-001", 4, 2026),
  ...generateAvailability("veh-002", 4, 2026),
  ...generateAvailability("veh-003", 4, 2026),
];

export function getAvailabilityForVehicle(vehicleId: string): AvailabilityEntry[] {
  return availability.filter((a) => a.vehicleId === vehicleId);
}

export function getAvailabilityForDate(vehicleId: string, date: string): AvailabilityEntry | undefined {
  return availability.find((a) => a.vehicleId === vehicleId && a.date === date);
}
