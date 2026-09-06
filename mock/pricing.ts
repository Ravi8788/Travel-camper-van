import type { PricingConfig } from "@/lib/types";

export const pricingConfig: PricingConfig = {
  defaultPricePerDay: 5000,
  defaultSecurityDeposit: 5000,
  seasonalPricing: [
    {
      id: "season-001",
      name: "Peak Season (Dec–Jan)",
      startDate: "2025-12-01",
      endDate: "2026-01-31",
      pricePerDay: 6500,
      active: true,
    },
    {
      id: "season-002",
      name: "Monsoon Rate (Jun–Sep)",
      startDate: "2026-06-01",
      endDate: "2026-09-30",
      pricePerDay: 4000,
      active: true,
    },
    {
      id: "season-003",
      name: "Festive Season (Oct–Nov)",
      startDate: "2026-10-01",
      endDate: "2026-11-30",
      pricePerDay: 5500,
      active: false,
    },
  ],
  additionalCharges: [
    {
      id: "charge-001",
      name: "Late Return Fee",
      amount: 2000,
      description: "Per day beyond agreed return time",
      active: true,
    },
    {
      id: "charge-002",
      name: "Cleaning Fee",
      amount: 1500,
      description: "If van returned in excessively dirty condition",
      active: true,
    },
    {
      id: "charge-003",
      name: "Extra Driver",
      amount: 500,
      description: "Per day for additional authorised driver",
      active: true,
    },
    {
      id: "charge-004",
      name: "One-Way Drop",
      amount: 3000,
      description: "Drop at different location than pickup",
      active: true,
    },
  ],
};
