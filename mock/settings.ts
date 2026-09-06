import type { BusinessSettings } from "@/lib/types";
import { DEFAULT_ADVANCE_BOOKING_DAYS } from "@/lib/constants";

export const businessSettings: BusinessSettings = {
  businessName: "Travel On Wheels",
  tagline: "Travel. Stay. Explore. Your Home on Wheels.",
  email: "hello@travelonwheels.in",
  phone: "+91 98765 12345",
  whatsappNumber: "+919876512345",
  address: "Koregaon Park, North Main Road",
  city: "Pune",
  state: "Maharashtra",
  pincode: "411001",
  socialLinks: {
    instagram: "https://instagram.com/travelonwheels",
    facebook: "https://facebook.com/travelonwheels",
    youtube: "https://youtube.com/travelonwheels",
  },
  advanceBookingDays: DEFAULT_ADVANCE_BOOKING_DAYS,
  cancellationPolicyText:
    "Cancellations made 7+ days before pickup receive a full rental refund. 3–6 days: 50% rental refund. Less than 3 days: no rental refund. Security deposit is fully refundable upon satisfactory vehicle return.",
  securityDepositPolicyText:
    "A refundable security deposit of ₹5,000 is collected at booking. Refund processed within 48 hours of vehicle inspection post-return. Deductions apply for damage, excessive cleaning, or late return.",
  rentalAgreementText:
    "By booking, you agree to our self-drive terms, accept liability for the vehicle during the rental period, and confirm all driver eligibility requirements are met.",
  selfDriveConditionsText:
    "No driver is provided. Customer must hold a valid Indian driving licence, meet minimum age and experience requirements, and is fully responsible for the vehicle during the rental period.",
};
