import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(val?: number | null, compact: boolean = false): string {
  if (val === undefined || val === null) return "—";
  if (compact) {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatKm(val?: number | null): string {
  if (val === undefined || val === null) return "— km";
  return `${new Intl.NumberFormat("en-IN").format(val)} km`;
}

export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  glow: string;
} {
  if (score >= 80) {
    return {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    };
  }
  if (score >= 60) {
    return {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    };
  }
  return {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
  };
}

export function getVerdictConfig(recommendation: string): {
  label: string;
  badgeClass: string;
  icon: string;
  desc: string;
} {
  const rec = (recommendation || "").toUpperCase();
  if (rec === "BUY") {
    return {
      label: "BUY",
      badgeClass: "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      icon: "🟢",
      desc: "Verified condition, consistent telemetry, and pricing tightly aligned with fair market value.",
    };
  }
  if (rec === "NEGOTIATE") {
    return {
      label: "NEGOTIATE",
      badgeClass: "bg-amber-500/15 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      icon: "🟡",
      desc: "Acceptable underlying vehicle condition, but asking price exceeds fair market range or manageable repairs are pending.",
    };
  }
  return {
    label: "AVOID",
    badgeClass: "bg-red-500/15 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    icon: "🔴",
    desc: "Critical anomaly detected (odometer rollback, structural damage, or severe market valuation disconnect).",
  };
}
