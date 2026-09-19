import { InspectionAngle, InspectionZone } from "../types";

export const DEFAULT_INSPECTION_ANGLES: InspectionAngle[] = [
  // 8 Exterior 360 Angles
  { id: "ext_front", title: "Front Bumper & Grille", zone: "exterior", angleDeg: 0, iconName: "camera", status: "pending" },
  { id: "ext_front_right", title: "Front Right Quarter Panel", zone: "exterior", angleDeg: 45, iconName: "camera", status: "pending" },
  { id: "ext_right_profile", title: "Right Side Profile & Doors", zone: "exterior", angleDeg: 90, iconName: "camera", status: "pending" },
  { id: "ext_rear_right", title: "Rear Right Quarter & Wheel", zone: "exterior", angleDeg: 135, iconName: "camera", status: "pending" },
  { id: "ext_rear", title: "Rear Bumper, Trunk & Exhaust", zone: "exterior", angleDeg: 180, iconName: "camera", status: "pending" },
  { id: "ext_rear_left", title: "Rear Left Quarter & Fuel Cap", zone: "exterior", angleDeg: 225, iconName: "camera", status: "pending" },
  { id: "ext_left_profile", title: "Left Side Profile & Mirrors", zone: "exterior", angleDeg: 270, iconName: "camera", status: "pending" },
  { id: "ext_front_left", title: "Front Left Wheel & Headlight", zone: "exterior", angleDeg: 315, iconName: "camera", status: "pending" },

  // Interior
  { id: "int_cockpit", title: "Dashboard & Steering Assembly", zone: "interior", angleDeg: 0, iconName: "gauge", status: "pending" },
  { id: "int_seats", title: "Seats, Upholstery & Seatbelts", zone: "interior", angleDeg: 180, iconName: "shield", status: "pending" },

  // Engine Bay
  { id: "eng_bay", title: "Engine Bay, Fluid Reservoirs & Belts", zone: "engine", angleDeg: 0, iconName: "wrench", status: "pending" },

  // Underbody
  { id: "und_chassis", title: "Exhaust, Suspension & Floor Pan", zone: "underbody", angleDeg: 0, iconName: "activity", status: "pending" },
];

export function validateAnglePhoto(photoUri: string): { isValid: boolean; warning?: string } {
  if (!photoUri) return { isValid: false, warning: "No photograph captured." };
  return { isValid: true };
}

export function detectMockDefects(angleId: string): { hasDefect: boolean; severity?: "low" | "medium" | "critical"; message?: string } {
  // Demo intelligence: detects micro-blemish on front bumper or underbody
  if (angleId === "ext_front") {
    return {
      hasDefect: true,
      severity: "low",
      message: "Minor paint chip detected near lower air dam (non-structural).",
    };
  }
  if (angleId === "und_chassis") {
    return {
      hasDefect: true,
      severity: "medium",
      message: "Heat shield clip slightly loosened. Recommended check at next service.",
    };
  }
  return { hasDefect: false };
}
