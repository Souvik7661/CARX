export interface RiskScore {
  overall_score: number;
  confidence_score: number;
  documentation_score?: number | null;
  service_history_score?: number | null;
  mileage_score?: number | null;
  visual_score?: number | null;
  mechanical_score?: number | null;
  market_score?: number | null;
  ownership_score?: number | null;
  positive_factors: string[];
  risk_factors: string[];
  weights_used: Record<string, number>;
  calculated_at: string;
}

export interface Valuation {
  estimated_fair_min: number;
  estimated_fair_max: number;
  asking_price: number;
  price_difference: number;
  recommendation: "BUY" | "NEGOTIATE" | "AVOID";
  valuation_notes?: string | null;
  calculated_at: string;
}

export interface DamageFinding {
  id: string;
  panel: string;
  damage_type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  bbox_coords?: string | null;
  notes?: string | null;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  angle: string;
  image_url: string;
  detected_damages?: any[];
  created_at: string;
}

export interface ServiceRecord {
  id: string;
  date: string;
  odometer: number;
  service_type: string;
  workshop?: string | null;
  total_cost: number;
  parts_replaced?: string | null;
  notes?: string | null;
  is_flagged: boolean;
  flag_reason?: string | null;
  source: string;
}

export interface DocumentRecord {
  id: string;
  vehicle_id: string;
  doc_type: string;
  file_name: string;
  file_size: number;
  status: string;
  confidence: number;
  uploaded_at: string;
  extracted_data?: Record<string, any> | null;
}

export interface InspectionFinding {
  id: string;
  category: string;
  item_name: string;
  condition: "Pass" | "Attention" | "Fail";
  estimated_repair_cost: number;
  severity: string;
  notes?: string | null;
}

export interface Inspection {
  id: string;
  vehicle_id: string;
  battery_voltage?: number | null;
  coolant_temp?: number | null;
  engine_health?: string | null;
  notes?: string | null;
  mechanic_name?: string | null;
  is_completed: boolean;
  completed_at?: string | null;
  obd_codes?: { code: string; description: string }[];
  findings: InspectionFinding[];
}

export interface Vehicle {
  id: string;
  vin?: string | null;
  reg_no?: string | null;
  make: string;
  model: string;
  variant?: string | null;
  year: number;
  fuel_type: string;
  transmission: string;
  mileage?: number | null;
  asking_price?: number | null;
  location?: string | null;
  image_url?: string | null;
  status: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;

  risk_score?: RiskScore | null;
  valuation?: Valuation | null;
  images?: VehicleImage[];
  documents?: DocumentRecord[];
  service_records?: ServiceRecord[];
  damage_findings?: DamageFinding[];
  inspections?: Inspection[];
}

export interface MileageAnalysis {
  status: "Consistent" | "Potential inconsistency" | "Unable to verify" | "Strong evidence of consistency";
  confidence: number;
  summary: string;
  data_points: { date: string; odometer: number; source: string }[];
  rollback_risk: "None" | "Low" | "High";
  annual_average_km?: number | null;
  anomalies?: string[];
}

export interface OwnershipCost {
  term_years: number;
  purchase_price: number;
  fuel_cost: number;
  insurance_cost: number;
  maintenance_cost: number;
  tyres_cost: number;
  depreciation_cost: number;
  total_cost: number;
  assumptions?: any;
}

export interface RepairPrediction {
  vehicle_id: string;
  total_estimated_repair_min: number;
  total_estimated_repair_max: number;
  predictions: {
    component: string;
    estimated_min: number;
    estimated_max: number;
    priority: "Low" | "Medium" | "High";
    reason: string;
    category: string;
  }[];
}

export interface VehicleComparisonCard {
  vehicle: Vehicle;
  trust_score: number;
  data_confidence: number;
  fair_value_range: string;
  asking_price_formatted: string;
  repair_risk: string;
  service_confidence: number;
  five_year_tco: string;
  recommendation: string;
}

export interface ComparisonResult {
  vehicles: VehicleComparisonCard[];
  best_overall_vehicle_id: string;
  best_overall_title: string;
  rationale: string;
}

export interface DealerStats {
  total_inventory: number;
  aging_inventory_count: number;
  price_risk_count: number;
  inspection_required_count: number;
  average_trust_score: number;
  items: {
    vehicle_id: string;
    title: string;
    year: number;
    mileage?: number | null;
    asking_price?: number | null;
    estimated_fair_min?: number | null;
    estimated_fair_max?: number | null;
    trust_score?: number | null;
    recommendation?: string | null;
    days_in_stock: number;
    is_aging: boolean;
    price_risk: boolean;
    inspection_required: boolean;
  }[];
}

export interface ScoringWeights {
  documentation: number;
  service_history: number;
  mileage_consistency: number;
  visual_condition: number;
  mechanical_diagnostic: number;
  market_price_risk: number;
  ownership_usage_risk: number;
}
