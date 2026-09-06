"use client";

import { createContext, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import { vehicles as seedVehicles } from "@/mock/vehicles";
import type { Vehicle } from "@/lib/types";

type Action =
  | { type: "add"; vehicle: Vehicle }
  | { type: "update"; vehicle: Vehicle }
  | { type: "delete"; id: string };

type VansStoreValue = {
  vehicles: Vehicle[];
  savedVanIds: string[];
  addVan: (vehicle: Vehicle) => void;
  updateVan: (vehicle: Vehicle) => void;
  deleteVan: (id: string) => void;
  toggleSavedVan: (id: string) => void;
};

const VansContext = createContext<VansStoreValue | null>(null);

function reducer(state: Vehicle[], action: Action): Vehicle[] {
  if (action.type === "add") return [...state, action.vehicle];
  if (action.type === "update") return state.map((vehicle) => vehicle.id === action.vehicle.id ? action.vehicle : vehicle);
  return state.filter((vehicle) => vehicle.id !== action.id);
}

export function VansProvider({ children }: { children: ReactNode }) {
  const [vehicles, dispatch] = useReducer(reducer, seedVehicles);
  const [savedVanIds, setSavedVanIds] = useState<string[]>([]);
  const value = useMemo(() => ({
    vehicles,
    savedVanIds,
    addVan: (vehicle: Vehicle) => dispatch({ type: "add", vehicle }),
    updateVan: (vehicle: Vehicle) => dispatch({ type: "update", vehicle }),
    deleteVan: (id: string) => dispatch({ type: "delete", id }),
    toggleSavedVan: (id: string) => setSavedVanIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]),
  }), [vehicles, savedVanIds]);
  return <VansContext.Provider value={value}>{children}</VansContext.Provider>;
}

export function useVansStore() {
  const value = useContext(VansContext);
  if (!value) throw new Error("useVansStore must be used inside VansProvider");
  return value;
}
