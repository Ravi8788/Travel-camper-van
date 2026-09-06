import type { DashboardStats, ChartDataPoint } from "@/lib/types";

export const dashboardStats: DashboardStats = {
  totalVehicles: 3,
  availableVehicles: 2,
  activeBookings: 1,
  upcomingBookings: 2,
  totalRevenue: 124500,
  pendingActions: 3,
};

export const bookingTrends: ChartDataPoint[] = [
  { label: "Jan", value: 4 },
  { label: "Feb", value: 6 },
  { label: "Mar", value: 8 },
  { label: "Apr", value: 5 },
  { label: "May", value: 7 },
  { label: "Jun", value: 3 },
];

export const revenueTrends: ChartDataPoint[] = [
  { label: "Jan", value: 85000 },
  { label: "Feb", value: 120000 },
  { label: "Mar", value: 145000 },
  { label: "Apr", value: 98000 },
  { label: "May", value: 132000 },
  { label: "Jun", value: 76000 },
];

export const popularVans: ChartDataPoint[] = [
  { label: "Wanderlust Pro", value: 12 },
  { label: "Nomad X", value: 8 },
  { label: "Coastal Cruiser", value: 6 },
];

export const bookingStatusBreakdown: ChartDataPoint[] = [
  { label: "Confirmed", value: 8 },
  { label: "Completed", value: 15 },
  { label: "Pending", value: 3 },
  { label: "Cancelled", value: 2 },
];

export const monthlyPerformance: ChartDataPoint[] = [
  { label: "Week 1", value: 32000 },
  { label: "Week 2", value: 45000 },
  { label: "Week 3", value: 38000 },
  { label: "Week 4", value: 52000 },
];
