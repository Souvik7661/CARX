export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";

export type VehicleCondition = "excellent" | "good" | "fair" | "attention";

export interface SubsystemStatus {
  engine: "Good" | "Warning" | "Critical";
  battery: "Good" | "Fair" | "Replace";
  brakes: "Good" | "Check Pads" | "Worn";
  tyres: "Good" | "Rotate Soon" | "Low Tread";
  fluids: "Good" | "Top Up" | "Low";
}

export interface ReminderItem {
  id: string;
  title: string;
  subtitle: string;
  status: "normal" | "urgent" | "soon";
  icon: "oil" | "shield" | "leaf" | "tyre" | "wrench";
}

export interface MonthlyExpenseRecord {
  month: string;
  amount: number;
  isCurrent?: boolean;
}

export interface ExpenseTransaction {
  id: string;
  title: string;
  vendor: string;
  amount: number;
  date: string;
  category: "fuel" | "service" | "tyres" | "insurance" | "others";
}

export interface DTCCode {
  code: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface OBDDiagnostics {
  rpm: number;
  batteryVoltage: number;
  engineTemp: number;
  dtcCodesCount: number;
  dtcCodes: DTCCode[];
  connectionStatus: "Connected via OBD-II" | "Connecting..." | "Offline";
}

export interface DriveSenseCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  regNumber: string;
  totalDistanceKm: number;
  avgMileage: string;
  condition: VehicleCondition;
  healthScore: number;
  healthStatus: "Excellent" | "Good" | "Needs Attention";
  healthMessage: string;
  subsystems: SubsystemStatus;
  reminders: ReminderItem[];
  expenses: {
    currentMonthTotal: number;
    percentageChange: number;
    monthlyHistory: MonthlyExpenseRecord[];
    breakdown: {
      fuel: number;
      service: number;
      tyres: number;
      insurance: number;
      others: number;
    };
    totalYearlySpent: number;
    yearlyPercentageChange: number;
    transactions: ExpenseTransaction[];
  };
  diagnostics: OBDDiagnostics;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

/**
 * Generator function to produce consistent and realistic telemetry data
 * for any car based on its condition, mileage, and fuel type.
 */
export function generateCarData(params: {
  id?: string;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  regNumber: string;
  totalDistanceKm: number;
  condition: VehicleCondition;
}): DriveSenseCar {
  const {
    id = `car_${Date.now()}`,
    brand,
    model,
    year,
    fuelType,
    regNumber,
    totalDistanceKm,
    condition,
  } = params;

  let healthScore = 92;
  let healthStatus: "Excellent" | "Good" | "Needs Attention" = "Excellent";
  let healthMessage = "Keep up the good care!";
  let avgMileage = fuelType === "Electric" ? "15.4 kWh/100km" : fuelType === "Diesel" ? "18.6 km/l" : "14.8 km/l";

  let subsystems: SubsystemStatus = {
    engine: "Good",
    battery: "Good",
    brakes: "Good",
    tyres: "Good",
    fluids: "Good",
  };

  let monthlyHistory: MonthlyExpenseRecord[] = [
    { month: "Apr", amount: 3200 },
    { month: "May", amount: 4100 },
    { month: "Jun", amount: 2900 },
    { month: "Jul", amount: 5400 },
    { month: "Aug", amount: 3800 },
    { month: "Sep", amount: 4850, isCurrent: true },
  ];
  let currentMonthTotal = 4850;
  let percentageChange = 12;
  let totalYearlySpent = 48320;
  let yearlyPercentageChange = -8;

  let diagnostics: OBDDiagnostics = {
    rpm: 870,
    batteryVoltage: 14.2,
    engineTemp: 91,
    dtcCodesCount: 0,
    dtcCodes: [],
    connectionStatus: "Connected via OBD-II",
  };

  let reminders: ReminderItem[] = [
    {
      id: "rem-1",
      title: fuelType === "Electric" ? "Motor & Coolant Inspection" : "Engine Oil Service",
      subtitle: "In 800 km",
      status: "normal",
      icon: "oil",
    },
    {
      id: "rem-2",
      title: "Insurance Renewal",
      subtitle: "25 Dec 2026",
      status: "normal",
      icon: "shield",
    },
    {
      id: "rem-3",
      title: "PUC Certificate",
      subtitle: "12 Jan 2027",
      status: "normal",
      icon: "leaf",
    },
    {
      id: "rem-4",
      title: "Tyre Rotation",
      subtitle: "In 3,000 km",
      status: "normal",
      icon: "tyre",
    },
  ];

  let breakdown = {
    fuel: 42,
    service: 28,
    tyres: 12,
    insurance: 10,
    others: 8,
  };

  let transactions: ExpenseTransaction[] = [
    {
      id: "tx-1",
      title: fuelType === "Electric" ? "Fast DC Charging" : "Fuel Refill",
      vendor: fuelType === "Electric" ? "Tata Power EZ Charge" : "IOCL, Shyamnagar",
      amount: fuelType === "Electric" ? 1150 : 2500,
      date: "12 Sep 2026",
      category: "fuel",
    },
    {
      id: "tx-2",
      title: fuelType === "Electric" ? "Cabin Filter & Fluid Check" : "Engine Oil Change",
      vendor: `${brand} Authorized Service Center`,
      amount: 8400,
      date: "5 Aug 2026",
      category: "service",
    },
    {
      id: "tx-3",
      title: "Tyre Replacement",
      vendor: "MRF Tyres Kolkata",
      amount: 18000,
      date: "12 Jun 2026",
      category: "tyres",
    },
  ];

  if (condition === "good") {
    healthScore = 78;
    healthStatus = "Good";
    healthMessage = "Routine maintenance recommended soon.";
    subsystems.brakes = "Check Pads";
    diagnostics.rpm = 910;
    diagnostics.batteryVoltage = 13.6;
    diagnostics.engineTemp = 94;
    currentMonthTotal = 6200;
    monthlyHistory = [
      { month: "Apr", amount: 4200 },
      { month: "May", amount: 3900 },
      { month: "Jun", amount: 6800 },
      { month: "Jul", amount: 4500 },
      { month: "Aug", amount: 5100 },
      { month: "Sep", amount: 6200, isCurrent: true },
    ];
    reminders[0].subtitle = "In 250 km (Due Soon)";
    reminders[0].status = "soon";
  } else if (condition === "fair" || condition === "attention") {
    healthScore = 54;
    healthStatus = "Needs Attention";
    healthMessage = "Inspection required: diagnostic codes detected.";
    subsystems.engine = "Warning";
    subsystems.battery = "Fair";
    subsystems.brakes = "Check Pads";
    diagnostics.rpm = 1040;
    diagnostics.batteryVoltage = 11.9;
    diagnostics.engineTemp = 101;
    diagnostics.dtcCodesCount = 2;
    diagnostics.dtcCodes = [
      { code: "P0300", description: "Random/Multiple Cylinder Misfire Detected", severity: "high" },
      { code: "P0420", description: "Catalyst System Efficiency Below Threshold", severity: "medium" },
    ];
    currentMonthTotal = 11450;
    percentageChange = 45;
    monthlyHistory = [
      { month: "Apr", amount: 5200 },
      { month: "May", amount: 6100 },
      { month: "Jun", amount: 8900 },
      { month: "Jul", amount: 7400 },
      { month: "Aug", amount: 9800 },
      { month: "Sep", amount: 11450, isCurrent: true },
    ];
    breakdown.service = 45;
    breakdown.fuel = 30;
    reminders.unshift({
      id: "rem-urgent",
      title: "Check Engine Warning (P0300)",
      subtitle: "Immediate action advised",
      status: "urgent",
      icon: "wrench",
    });
  }

  return {
    id,
    brand,
    model,
    year,
    fuelType,
    regNumber,
    totalDistanceKm,
    avgMileage,
    condition,
    healthScore,
    healthStatus,
    healthMessage,
    subsystems,
    reminders,
    expenses: {
      currentMonthTotal,
      percentageChange,
      monthlyHistory,
      breakdown,
      totalYearlySpent,
      yearlyPercentageChange,
      transactions,
    },
    diagnostics,
  };
}
