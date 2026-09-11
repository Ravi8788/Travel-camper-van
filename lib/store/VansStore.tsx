"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { Vehicle } from "@/lib/types";
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from "@/lib/services/vehicles";

type Action =
  | { type: "add"; vehicle: Vehicle }
  | { type: "update"; vehicle: Vehicle }
  | { type: "delete"; id: string };

type VansStoreValue = {
  vehicles: Vehicle[];
  savedVanIds: string[];
  addVan: (vehicle: Vehicle) => Promise<Vehicle>;
  updateVan: (vehicle: Vehicle) => Promise<Vehicle>;
  deleteVan: (id: string) => Promise<void>;
  toggleSavedVan: (id: string) => void;
};

const VansContext = createContext<VansStoreValue | null>(null);

function reducer(state: Vehicle[], action: Action): Vehicle[] {
  if (action.type === "add") return [...state, action.vehicle];
  if (action.type === "update") return state.map((vehicle) => vehicle.id === action.vehicle.id ? action.vehicle : vehicle);
  return state.filter((vehicle) => vehicle.id !== action.id);
}

export function VansProvider({ children }: { children: ReactNode }) {
  const [vehicles, dispatch] = useReducer(reducer, []);
  const [savedVanIds, setSavedVanIds] = useState<string[]>([]);
  useEffect(() => { getVehicles().then((items) => items.forEach((vehicle) => dispatch({ type: "add", vehicle }))).catch(() => undefined); }, []);
  const value = useMemo(() => ({
    vehicles,
    savedVanIds,
    addVan: async (vehicle: Vehicle) => { const saved = await createVehicle(vehicle); dispatch({ type: "add", vehicle: saved }); return saved; },
    updateVan: async (vehicle: Vehicle) => { const saved = await updateVehicle(vehicle); dispatch({ type: "update", vehicle: saved }); return saved; },
    deleteVan: async (id: string) => { await deleteVehicle(id); dispatch({ type: "delete", id }); },
    toggleSavedVan: (id: string) => setSavedVanIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]),
  }), [vehicles, savedVanIds]);
  return <VansContext.Provider value={value}>{children}</VansContext.Provider>;
}

export function useVansStore() {
  const value = useContext(VansContext);
  if (!value) throw new Error("useVansStore must be used inside VansProvider");
  return value;
}
