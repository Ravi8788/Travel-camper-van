import { destinations, roadTripPackages } from "@/mock/destinations";
import { vehicles as vanSeed } from "@/mock/vehicles";
import { bookings } from "@/mock/bookings";
import { customers } from "@/mock/customers";
import { offers } from "@/mock/offers";
import { reviews } from "@/mock/reviews";
import type { Destination, Offer, Review, Vehicle } from "@/lib/types";

export function getVans(): Vehicle[] { return vanSeed; }
export function getVanById(id: string): Vehicle | undefined { return vanSeed.find((van) => van.id === id); }
export function getVanBySlug(slug: string): Vehicle | undefined { return vanSeed.find((van) => van.slug === slug); }
export function addVan(vehicle: Vehicle): Vehicle[] { return [...vanSeed, vehicle]; }
export function updateVan(vehicle: Vehicle): Vehicle[] { return vanSeed.map((item) => item.id === vehicle.id ? vehicle : item); }
export function deleteVan(id: string): Vehicle[] { return vanSeed.filter((item) => item.id !== id); }
export function getDestinations(): Destination[] { return destinations; }
export function getRoadTripPackages() { return roadTripPackages; }
export function getOffers(): Offer[] { return offers; }
export function getReviews(): Review[] { return reviews; }
export function getBookings() { return bookings; }
export function getCustomers() { return customers; }
