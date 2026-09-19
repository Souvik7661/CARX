import { Vehicle, RiskScore, Valuation, OwnershipCost } from "./types";

export const initialVehicles: Vehicle[] = [
  {
    id: "v-honda-city-2024",
    vin: "MAKGM2650EN001842",
    reg_no: "MH02DQ8841",
    make: "Honda",
    model: "City ZX",
    year: 2024,
    variant: "ZX CVT",
    fuel_type: "Petrol",
    transmission: "Automatic",
    mileage: 28450,
    asking_price: 1350000,
    location: "Mumbai, MH",
    status: "Active",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-09-19T18:00:00Z",
    is_demo: false,
  },
  {
    id: "v-bmw-320d-2022",
    vin: "WBA8E31070F982142",
    reg_no: "DL01AB1234",
    make: "BMW",
    model: "3 Series",
    year: 2022,
    variant: "320d Luxury Line",
    fuel_type: "Diesel",
    transmission: "Automatic",
    mileage: 42300,
    asking_price: 3650000,
    location: "New Delhi, DL",
    status: "Active",
    created_at: "2026-02-10T12:00:00Z",
    updated_at: "2026-09-18T15:30:00Z",
    is_demo: true,
  },
  {
    id: "v-creta-sx-2023",
    vin: "MALC381CLNM048211",
    reg_no: "KA05MN5678",
    make: "Hyundai",
    model: "Creta",
    year: 2023,
    variant: "SX (O) Turbo",
    fuel_type: "Petrol",
    transmission: "DCT",
    mileage: 19800,
    asking_price: 1720000,
    location: "Bangalore, KA",
    status: "Active",
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-09-19T12:00:00Z",
    is_demo: true,
  },
];

let vehiclesState: Vehicle[] = [...initialVehicles];

export function getStoredVehicles(): Vehicle[] {
  return vehiclesState;
}

export function findVehicleById(id: string): Vehicle | undefined {
  return vehiclesState.find((v) => v.id === id);
}

export function saveVehicle(vehicle: Partial<Vehicle>): Vehicle {
  const existingIdx = vehiclesState.findIndex((v) => v.id === vehicle.id);
  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    const updated = {
      ...vehiclesState[existingIdx],
      ...vehicle,
      updated_at: now,
    } as Vehicle;
    vehiclesState[existingIdx] = updated;
    return updated;
  } else {
    const newVehicle: Vehicle = {
      id: vehicle.id || `v-${Date.now()}`,
      make: vehicle.make || "Vehicle",
      model: vehicle.model || "Model",
      year: vehicle.year || 2024,
      fuel_type: vehicle.fuel_type || "Petrol",
      transmission: vehicle.transmission || "Manual",
      mileage: vehicle.mileage || 0,
      asking_price: vehicle.asking_price || 1000000,
      status: "Active",
      created_at: now,
      updated_at: now,
      is_demo: false,
      ...vehicle,
    };
    vehiclesState = [newVehicle, ...vehiclesState];
    return newVehicle;
  }
}

export function calculateRiskScore(vehicle: Vehicle): RiskScore {
  return {
    overall_score: 92,
    confidence_score: 94,
    documentation_score: 95,
    service_history_score: 92,
    mileage_score: 88,
    visual_score: 90,
    mechanical_score: 94,
    market_score: 86,
    ownership_score: 96,
    positive_factors: [
      "Single owner registered with clear digital RC & hypothecation clear",
      "Regular periodic maintenance records confirmed with OEM dealer",
      "Odometer telemetry consistent with annual usage metrics",
      "Zero severe structural collision damage detected",
    ],
    risk_factors: ["Next major 30,000 km periodic service due in ~1,550 km"],
    weights_used: {
      documentation: 0.25,
      service_history: 0.2,
      mileage: 0.15,
      mechanical: 0.2,
      visual: 0.1,
      market: 0.1,
    },
    calculated_at: new Date().toISOString(),
  };
}

export function calculateValuation(vehicle: Vehicle, askingPrice?: number): Valuation {
  const price = askingPrice || vehicle.asking_price || 1200000;
  const fairMin = Math.round(price * 0.94);
  const fairMax = Math.round(price * 1.03);
  const diff = price - fairMin;
  const rec: "BUY" | "NEGOTIATE" | "AVOID" =
    diff <= 30000 ? "BUY" : diff <= 80000 ? "NEGOTIATE" : "AVOID";

  return {
    estimated_fair_min: fairMin,
    estimated_fair_max: fairMax,
    asking_price: price,
    price_difference: diff,
    recommendation: rec,
    valuation_notes: `Fair market value for ${vehicle.year} ${vehicle.make} ${vehicle.model} based on regional secondary market transactions.`,
    calculated_at: new Date().toISOString(),
  };
}

export function calculateOwnershipCost(vehicle: Vehicle, termYears: number = 5): OwnershipCost {
  const purchasePrice = vehicle.asking_price || 1200000;
  const fuelCost = Math.round(12000 * 7.5 * termYears);
  const maintenanceCost = Math.round(18000 * termYears);
  const insuranceCost = Math.round(28000 * termYears);
  const tyresCost = Math.round(16000 * Math.ceil(termYears / 3));
  const depreciationCost = Math.round(purchasePrice * 0.42);
  const totalCost = fuelCost + maintenanceCost + insuranceCost + tyresCost + depreciationCost;

  return {
    term_years: termYears,
    purchase_price: purchasePrice,
    fuel_cost: fuelCost,
    insurance_cost: insuranceCost,
    maintenance_cost: maintenanceCost,
    tyres_cost: tyresCost,
    depreciation_cost: depreciationCost,
    total_cost: totalCost,
    assumptions: {
      annual_km: 12000,
      fuel_cost_per_liter: 104,
      cost_per_km: Math.round((totalCost / (12000 * termYears)) * 10) / 10,
    },
  };
}
