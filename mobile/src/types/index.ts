export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  trim?: string;
  licensePlate: string;
  fuelType: FuelType;
  odometerKm: number;
  avgEfficiencyKmpl: number;
  healthScore: number;
  healthStatus: "Excellent" | "Good" | "Needs Attention" | "Critical";
  batteryLevelPercent?: number;
  fuelTankPercent?: number;
  subsystems: {
    engineHealth: number;
    brakeHealth: number;
    batteryHealth: number;
    tireHealth: number;
    transmissionHealth: number;
    electricalHealth: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type InspectionZone = "exterior" | "interior" | "engine" | "underbody";

export interface InspectionAngle {
  id: string;
  title: string;
  zone: InspectionZone;
  angleDeg: number;
  iconName: string;
  status: "verified" | "flagged" | "pending";
  damageDetected?: boolean;
  damageSeverity?: "low" | "medium" | "critical";
  notes?: string;
  photoUri?: string;
  capturedAt?: string;
}

export interface TripTelemetry {
  tripId: string;
  vehicleId: string;
  durationSeconds: number;
  distanceKm: number;
  avgSpeedKmh: number;
  fuelBurnedLiters: number;
  efficiencyKmpl: number;
  routePoints: { latitude: number; longitude: number; timestamp: number }[];
  isLive: boolean;
  startedAt: string;
  endedAt?: string;
}

export interface ExpenseRecord {
  id: string;
  vehicleId: string;
  category: "Fuel" | "Service" | "Insurance" | "Tolls" | "Accessories" | "Repairs";
  amountInr: number;
  liters?: number;
  costPerLiter?: number;
  odometerKm?: number;
  date: string;
  notes?: string;
}

export interface ServiceReminder {
  id: string;
  title: string;
  subtitle: string;
  dueKm?: number;
  dueDate?: string;
  urgency: "low" | "medium" | "high";
  completed: boolean;
}
