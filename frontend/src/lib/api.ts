import {
  Vehicle,
  RiskScore,
  Valuation,
  MileageAnalysis,
  OwnershipCost,
  RepairPrediction,
  ComparisonResult,
  DealerStats,
  ScoringWeights,
  ServiceRecord
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let errMsg = `Request failed with status ${res.status}`;
      try {
        const errData = await res.json();
        errMsg = errData.detail || errData.error || errMsg;
      } catch {
        // use default
      }
      throw new Error(errMsg);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Vehicles
  getVehicles: (query?: string, isDemo?: boolean) => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (isDemo !== undefined) params.append("is_demo", String(isDemo));
    return fetchJSON<Vehicle[]>(`/vehicles?${params.toString()}`);
  },

  getVehicle: (id: string) => fetchJSON<Vehicle>(`/vehicles/${id}`),

  createVehicle: (data: Partial<Vehicle>) =>
    fetchJSON<Vehicle>("/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateVehicle: (id: string, data: Partial<Vehicle>) =>
    fetchJSON<Vehicle>(`/vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Documents
  uploadDocument: (vehicleId: string, docType: string, file: File) => {
    const formData = new FormData();
    formData.append("doc_type", docType);
    formData.append("file", file);
    return fetchJSON<any>(`/vehicles/${vehicleId}/documents`, {
      method: "POST",
      body: formData,
    });
  },

  getDocuments: (vehicleId: string) =>
    fetchJSON<any[]>(`/vehicles/${vehicleId}/documents`),

  updateDocumentExtraction: (docId: string, extractedData: any) =>
    fetchJSON<any>(`/documents/${docId}/extraction`, {
      method: "PUT",
      body: JSON.stringify({ extracted_data: extractedData, is_verified: true }),
    }),

  // Images & Visual CV
  uploadImage: (vehicleId: string, angle: string, file: File) => {
    const formData = new FormData();
    formData.append("angle", angle);
    formData.append("file", file);
    return fetchJSON<any>(`/vehicles/${vehicleId}/images`, {
      method: "POST",
      body: formData,
    });
  },

  getImages: (vehicleId: string) =>
    fetchJSON<any[]>(`/vehicles/${vehicleId}/images`),

  getDamages: (vehicleId: string) =>
    fetchJSON<any[]>(`/vehicles/${vehicleId}/damages`),

  // Service History
  getServiceRecords: (vehicleId: string) =>
    fetchJSON<ServiceRecord[]>(`/vehicles/${vehicleId}/service-records`),

  addServiceRecord: (vehicleId: string, record: Partial<ServiceRecord>) =>
    fetchJSON<ServiceRecord>(`/vehicles/${vehicleId}/service-records`, {
      method: "POST",
      body: JSON.stringify(record),
    }),

  getServiceHistoryAnalysis: (vehicleId: string) =>
    fetchJSON<any>(`/vehicles/${vehicleId}/service-history`),

  // Mileage
  getMileageAnalysis: (vehicleId: string) =>
    fetchJSON<MileageAnalysis>(`/vehicles/${vehicleId}/mileage`),

  // Analysis & Trust Score
  triggerAnalysis: (vehicleId: string) =>
    fetchJSON<any>(`/vehicles/${vehicleId}/analyze`, { method: "POST" }),

  getScore: (vehicleId: string) =>
    fetchJSON<RiskScore>(`/vehicles/${vehicleId}/score`),

  // Valuation
  getValuation: (vehicleId: string) =>
    fetchJSON<Valuation>(`/vehicles/${vehicleId}/valuation`),

  recalculateValuation: (vehicleId: string, askingPrice: number) =>
    fetchJSON<Valuation>(`/vehicles/${vehicleId}/valuation`, {
      method: "POST",
      body: JSON.stringify({ asking_price: askingPrice }),
    }),

  // Ownership (TCO)
  getOwnershipCost: (vehicleId: string, termYears: number = 5) =>
    fetchJSON<OwnershipCost>(`/vehicles/${vehicleId}/ownership-cost?term_years=${termYears}`),

  recalculateOwnershipCost: (vehicleId: string, params: any) =>
    fetchJSON<OwnershipCost>(`/vehicles/${vehicleId}/ownership-cost`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  // Repairs
  getRepairPredictions: (vehicleId: string) =>
    fetchJSON<RepairPrediction>(`/vehicles/${vehicleId}/repairs`),

  // Inspections & OBD
  recordInspection: (vehicleId: string, data: any) =>
    fetchJSON<any>(`/vehicles/${vehicleId}/inspections`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getInspections: (vehicleId: string) =>
    fetchJSON<any[]>(`/vehicles/${vehicleId}/inspections`),

  // Reports
  generateReport: (vehicleId: string) =>
    fetchJSON<any>(`/vehicles/${vehicleId}/report`, { method: "POST" }),

  getReportByCode: (code: string) =>
    fetchJSON<any>(`/reports/${code}`),

  // Comparison
  compareVehicles: (vehicleIds: string[]) =>
    fetchJSON<ComparisonResult>("/compare", {
      method: "POST",
      body: JSON.stringify({ vehicle_ids: vehicleIds }),
    }),

  // Dealer
  getDealerStats: () => fetchJSON<DealerStats>("/dealer/stats"),

  // Admin
  getAdminHealth: () => fetchJSON<any>("/admin/health"),
  getAdminJobs: () => fetchJSON<any[]>("/admin/jobs"),
  getScoringWeights: () => fetchJSON<ScoringWeights>("/admin/weights"),
  updateScoringWeights: (weights: ScoringWeights) =>
    fetchJSON<ScoringWeights>("/admin/weights", {
      method: "PUT",
      body: JSON.stringify(weights),
    }),
  getAuditLogs: () => fetchJSON<any[]>("/admin/audit-logs"),

  // Demo
  getDemoVehicles: () => fetchJSON<Vehicle[]>("/demo/vehicles"),
  seedDemoData: () => fetchJSON<any>("/demo/seed", { method: "POST" }),
};
