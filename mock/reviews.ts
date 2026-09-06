import type { Review } from "@/lib/types";

export const reviews: Review[] = [
  {
    id: "rev-001",
    customerId: "cust-001",
    customerName: "Priya Sharma",
    vehicleId: "veh-001",
    destination: "Coorg",
    rating: 5,
    text: "Absolutely loved our Coorg trip in the Wanderlust Pro! Waking up to misty hills with fresh coffee from our van kitchen was magical. The team was super helpful with the handover.",
    photoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    status: "featured",
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "rev-002",
    customerId: "cust-002",
    customerName: "Arjun & Meera",
    vehicleId: "veh-002",
    destination: "Goa",
    rating: 5,
    text: "Took the Nomad X for a week in Goa with friends. Six of us fit comfortably and the outdoor kitchen was a game-changer. Already planning our next trip!",
    status: "approved",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "rev-003",
    customerId: "cust-003",
    customerName: "Rahul K.",
    vehicleId: "veh-003",
    destination: "Western Ghats",
    rating: 4,
    text: "The Coastal Cruiser was perfect for our couple's getaway. Easy to drive through ghats and park at viewpoints. Would've loved a slightly bigger fridge but overall excellent.",
    status: "approved",
    createdAt: "2025-12-05T10:00:00Z",
  },
  {
    id: "rev-004",
    customerId: "cust-004",
    customerName: "Ananya Desai",
    destination: "Hampi",
    rating: 5,
    text: "First time camper van experience and Travel On Wheels made it seamless. The booking process was clear, van was spotless, and the freedom to explore at our pace was unmatched.",
    status: "approved",
    createdAt: "2025-11-18T10:00:00Z",
  },
  {
    id: "rev-005",
    customerId: "cust-005",
    customerName: "Vikram Patel",
    vehicleId: "veh-001",
    destination: "Coorg",
    rating: 5,
    text: "Premium experience from start to finish. The van felt like a boutique hotel on wheels. Security deposit refund was processed within 48 hours of return.",
    status: "approved",
    createdAt: "2026-03-01T10:00:00Z",
  },
];

export function getAverageRating(): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getRatingDistribution(): Record<number, number> {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    dist[r.rating] = (dist[r.rating] ?? 0) + 1;
  });
  return dist;
}
