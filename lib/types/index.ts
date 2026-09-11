export type VehicleStatus = "available" | "booked" | "on_rent" | "maintenance" | "inactive";

export type FuelType = "petrol" | "diesel" | "cng" | "electric";
export type Transmission = "manual" | "automatic";

export interface VehicleDimensions {
  lengthFt: number;
  widthFt: number;
  heightFt: number;
}

export interface VehicleFacilities {
  bedroom: string[];
  washroom: string[];
  kitchen: string[];
  storage: string[];
  charging: string[];
}

export interface VehicleFacilityDetails {
  sleeping: string;
  kitchen: string;
  washroom: string;
  storage: string;
  charging: string;
  essentials: string[];
}

export interface VehicleImageTags {
  exterior: string[];
  interior: string[];
  kitchen: string[];
  bedroom: string[];
  washroom: string[];
  storage: string[];
}

export interface VehicleAdditionalCharge {
  name: string;
  amount: number;
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  model: string;
  registrationNumber: string;
  description: string;
  shortDescription: string;
  pricePerDay: number;
  securityDeposit: number;
  passengerCapacity: number;
  sleepingCapacity: number;
  fuelType: FuelType;
  transmission: Transmission;
  dimensions: VehicleDimensions;
  dimensionsText?: string;
  drivingRequirements: string[];
  drivingRequirementsText?: string;
  amenities: string[];
  facilities: VehicleFacilities;
  facilityDetails: VehicleFacilityDetails;
  images: string[];
  imageTags: VehicleImageTags;
  videoUrl?: string;
  coverImage?: string;
  additionalCharges: VehicleAdditionalCharge[];
  status: VehicleStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected";

export type PaymentStatus = "pending" | "paid" | "partial" | "refunded" | "failed";

export interface Booking {
  id: string;
  bookingNumber: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropLocation: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  rentalAmount: number;
  securityDeposit: number;
  additionalCharges: number;
  totalAmount: number;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus = "active" | "inactive" | "blocked";

export interface CustomerDocument {
  id: string;
  type: "driving_licence" | "id_proof" | "address_proof";
  fileName: string;
  status: "pending" | "verified" | "rejected";
  uploadedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  dateOfBirth?: string;
  licenceNumber?: string;
  totalBookings: number;
  lastBookingDate?: string;
  status: CustomerStatus;
  documents: CustomerDocument[];
  notes?: string;
  createdAt: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected" | "featured";

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId?: string;
  destination: string;
  rating: number;
  text: string;
  photoUrl?: string;
  status: ReviewStatus;
  createdAt: string;
}

export type OfferType =
  | "weekend"
  | "early_booking"
  | "long_trip"
  | "couple"
  | "seasonal";

export type OfferStatus = "active" | "scheduled" | "expired" | "draft";

export interface Offer {
  id: string;
  name: string;
  description: string;
  discountPercent: number;
  type: OfferType;
  startDate: string;
  endDate: string;
  status: OfferStatus;
  terms: string[];
  createdAt: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  recommendedDuration: string;
  routeInfo: string;
  tags: string[];
  featured: boolean;
}

export interface RoadTripPackage {
  id: string;
  destinationId: string;
  name: string;
  route: string;
  itinerary: string[];
  distanceKm: number;
  fuelEstimate: string;
  suggestedStays: string[];
  status: "coming_soon" | "active";
}

export type AvailabilityStatus =
  | "available"
  | "booked"
  | "blocked"
  | "maintenance";

export interface AvailabilityEntry {
  id: string;
  vehicleId: string;
  date: string;
  status: AvailabilityStatus;
  note?: string;
}

export interface SeasonalPricing {
  id: string;
  name: string;
  vehicleId?: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  active: boolean;
}

export interface AdditionalCharge {
  id: string;
  name: string;
  amount: number;
  description: string;
  active: boolean;
}

export interface PricingConfig {
  defaultPricePerDay: number;
  defaultSecurityDeposit: number;
  seasonalPricing: SeasonalPricing[];
  additionalCharges: AdditionalCharge[];
}

export interface ReferralProgram {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  terms: string[];
  active: boolean;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsEmbedUrl?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  advanceBookingDays: number;
  cancellationPolicyText: string;
  securityDepositPolicyText: string;
  rentalAgreementText: string;
  selfDriveConditionsText: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category:
    | "booking"
    | "vehicle"
    | "self_drive"
    | "payment"
    | "security_deposit"
    | "cancellation"
    | "fuel"
    | "pickup_return";
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  activeBookings: number;
  upcomingBookings: number;
  totalRevenue: number;
  pendingActions: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface BookingFormData {
  vehicleId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  acceptedTerms: boolean;
}
