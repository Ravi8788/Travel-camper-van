import type { FaqItem } from "@/lib/types";

export const faqItems: FaqItem[] = [
  {
    id: "faq-001",
    category: "booking",
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 4 days in advance. Peak season (Dec–Jan, long weekends) fills up fast — book 2–3 weeks ahead for best availability.",
  },
  {
    id: "faq-002",
    category: "booking",
    question: "What is the minimum rental period?",
    answer: "Minimum rental is 2 nights (3 days). Long-trip discounts apply for bookings of 7+ consecutive nights.",
  },
  {
    id: "faq-003",
    category: "vehicle",
    question: "What amenities are included in the camper?",
    answer:
      "All our campers include bedding, kitchen basics, utensils, camping chairs, and charging ports. Specific amenities vary by van — check individual van pages for full details.",
  },
  {
    id: "faq-004",
    category: "vehicle",
    question: "Can I take the camper off-road?",
    answer:
      "Our campers are designed for paved and well-maintained roads. Off-road driving, beach driving, and entering restricted zones is not permitted and may void insurance coverage.",
  },
  {
    id: "faq-005",
    category: "self_drive",
    question: "Is a driver provided?",
    answer:
      "No. Travel On Wheels is a self-drive rental service. You drive the camper yourself. All drivers must meet our eligibility requirements and be listed on the rental agreement.",
  },
  {
    id: "faq-006",
    category: "self_drive",
    question: "What documents do I need?",
    answer:
      "Valid Indian driving licence (original), government ID (Aadhaar/PAN/Passport), and address proof. Documents are verified at pickup — upload in advance to speed up handover.",
  },
  {
    id: "faq-007",
    category: "payment",
    question: "What payment methods are accepted?",
    answer:
      "We accept UPI, credit/debit cards, and net banking. Full payment (rental + security deposit) is required at booking confirmation.",
  },
  {
    id: "faq-008",
    category: "payment",
    question: "When is the security deposit refunded?",
    answer:
      "Within 48 hours of vehicle return and inspection, provided there is no damage, excessive cleaning required, or late return.",
  },
  {
    id: "faq-009",
    category: "security_deposit",
    question: "Why is a security deposit required?",
    answer:
      "The ₹5,000 refundable deposit covers potential damage, cleaning, or policy violations. It is fully refunded if the van is returned in good condition and on time.",
  },
  {
    id: "faq-010",
    category: "cancellation",
    question: "What is the cancellation policy?",
    answer:
      "7+ days before pickup: full rental refund. 3–6 days: 50% rental refund. Less than 3 days: no rental refund. See our Cancellation & Refund Policy page for full details.",
  },
  {
    id: "faq-011",
    category: "fuel",
    question: "Who pays for fuel?",
    answer:
      "Fuel is the customer's responsibility. Vans are handed over with a full tank and must be returned with a full tank. Fuel costs are not included in the rental price.",
  },
  {
    id: "faq-012",
    category: "pickup_return",
    question: "Where can I pick up and return the van?",
    answer:
      "Primary hub: Koramangala, Bangalore. We also offer pickup at Bangalore Airport, Mysore City Centre, and Goa (Panjim). One-way drops to a different location incur an additional charge.",
  },
];

export function getFaqsByCategory(category: FaqItem["category"]): FaqItem[] {
  return faqItems.filter((f) => f.category === category);
}
