/**
 * Data access layer — swap these functions for Supabase queries in the next phase.
 * UI components should only import from here, never directly from mock/*.ts files.
 */

export { vehicles } from "@/mock/vehicles";
export { destinations, roadTripPackages } from "@/mock/destinations";
export { reviews, getAverageRating, getRatingDistribution } from "@/mock/reviews";
export { offers } from "@/mock/offers";
export { customers } from "@/mock/customers";
export { bookings } from "@/mock/bookings";
export {
  availability,
  getAvailabilityForVehicle,
  getAvailabilityForDate,
} from "@/mock/availability";
export { pricingConfig } from "@/mock/pricing";
export { referralProgram } from "@/mock/referrals";
export { businessSettings } from "@/mock/settings";
export { faqItems, getFaqsByCategory } from "@/mock/faq";
export {
  dashboardStats,
  bookingTrends,
  revenueTrends,
  popularVans,
  bookingStatusBreakdown,
  monthlyPerformance,
} from "@/mock/dashboard-stats";

import { vehicles } from "@/mock/vehicles";
import { bookings } from "@/mock/bookings";
import { customers } from "@/mock/customers";
import { reviews } from "@/mock/reviews";
import { offers } from "@/mock/offers";
import { destinations, roadTripPackages } from "@/mock/destinations";
import { businessSettings } from "@/mock/settings";
import { dashboardStats } from "@/mock/dashboard-stats";
import type { Vehicle, Booking, Customer, Review, Offer, Destination } from "@/lib/types";

export function getVehicles(): Vehicle[] {
  return vehicles;
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getFeaturedVehicle(): Vehicle | undefined {
  return vehicles.find((v) => v.featured);
}

export function getAvailableVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.status === "available");
}

export function getBookings(): Booking[] {
  return bookings;
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function getBookingsByCustomer(customerId: string): Booking[] {
  return bookings.filter((b) => b.customerId === customerId);
}

export function getCustomers(): Customer[] {
  return customers;
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function getReviews(): Review[] {
  return reviews.filter((r) => r.status === "approved" || r.status === "featured");
}

export function getAllReviews(): Review[] {
  return reviews;
}

export function getOffers(): Offer[] {
  return offers;
}

export function getActiveOffers(): Offer[] {
  return offers.filter((o) => o.status === "active");
}

export function getDestinations(): Destination[] {
  return destinations;
}

export function getFeaturedDestinations(): Destination[] {
  return destinations.filter((d) => d.featured);
}

export function getRoadTripPackages() {
  return roadTripPackages;
}

export function getDashboardStats() {
  return dashboardStats;
}

export function getSettings() {
  return businessSettings;
}

export function getAdvanceBookingDays(): number {
  return businessSettings.advanceBookingDays;
}
