import type { Destination, RoadTripPackage } from "@/lib/types";

export const destinations: Destination[] = [
  {
    id: "dest-001",
    slug: "coorg-coffee-trails",
    name: "Coorg Coffee Trails",
    description:
      "Wind through misty hills, coffee estates, and Abbey Falls. Perfect for a slow weekend escape with campfire evenings and sunrise viewpoints.",
    shortDescription: "Misty hills, coffee estates, and waterfall stops.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    recommendedDuration: "3–4 days",
    routeInfo: "Bangalore → Mysore → Kushalnagar → Madikeri",
    tags: ["Hill Station", "Weekend", "Nature", "Couples"],
    featured: true,
  },
  {
    id: "dest-002",
    slug: "goa-coastal-run",
    name: "Goa Coastal Run",
    description:
      "Beach-hop from North to South Goa. Park at secluded spots, cook fresh seafood in your van kitchen, and wake up to ocean views.",
    shortDescription: "Beach camping and coastal drives across Goa.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    recommendedDuration: "5–7 days",
    routeInfo: "Panjim → Anjuna → Palolem → Cabo de Rama",
    tags: ["Beach", "Coastal", "Friends", "Long Trip"],
    featured: true,
  },
  {
    id: "dest-003",
    slug: "western-ghats-loop",
    name: "Western Ghats Loop",
    description:
      "An epic loop through Karnataka's ghats — Chikmagalur, Agumbe, and Udupi. For travellers who want raw nature and off-grid camping.",
    shortDescription: "Epic ghat loop through rainforests and coast.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    recommendedDuration: "7–10 days",
    routeInfo: "Bangalore → Chikmagalur → Agumbe → Udupi → Gokarna",
    tags: ["Adventure", "Off-Grid", "Long Trip", "Nature"],
    featured: false,
  },
  {
    id: "dest-004",
    slug: "hampi-heritage",
    name: "Hampi Heritage",
    description:
      "Explore the boulder-strewn ruins of Vijayanagara Empire. Camp near the Tungabhadra river and explore ancient temples by day.",
    shortDescription: "Ancient ruins and riverside camping.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    recommendedDuration: "3–5 days",
    routeInfo: "Bangalore → Chitradurga → Hampi",
    tags: ["Heritage", "Culture", "Photography"],
    featured: false,
  },
];

export const roadTripPackages: RoadTripPackage[] = [
  {
    id: "pkg-001",
    destinationId: "dest-001",
    name: "Coorg Weekend Escape",
    route: "Bangalore → Kushalnagar → Madikeri → Abbey Falls",
    itinerary: [
      "Day 1: Pick up van, drive to Kushalnagar",
      "Day 2: Madikeri town, Raja's Seat sunset",
      "Day 3: Abbey Falls, Dubare Elephant Camp",
      "Day 4: Return via Mysore",
    ],
    distanceKm: 520,
    fuelEstimate: "₹4,500–₹5,500 (diesel, customer responsibility)",
    suggestedStays: ["Madikeri viewpoint camps", "Kushalnagar riverside"],
    status: "coming_soon",
  },
  {
    id: "pkg-002",
    destinationId: "dest-002",
    name: "Goa North to South",
    route: "Panjim → Anjuna → Palolem → Cabo de Rama",
    itinerary: [
      "Day 1: Panjim old town exploration",
      "Day 2: Anjuna & Vagator beaches",
      "Day 3: Drive south to Palolem",
      "Day 4–5: South Goa beaches and forts",
    ],
    distanceKm: 180,
    fuelEstimate: "₹2,000–₹3,000 (diesel, customer responsibility)",
    suggestedStays: ["Palolem beach parking", "Agonda quiet spots"],
    status: "coming_soon",
  },
];
