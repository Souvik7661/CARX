"use client";

import React from "react";
import { ChevronRight, ShieldCheck, AlertCircle, CheckCircle, Info } from "lucide-react";
import { DriveSenseCar } from "@/lib/drivesense-types";

interface HealthGaugeProps {
  car: DriveSenseCar | null;
  onViewDetails?: () => void;
}

export default function HealthGauge({ car, onViewDetails }: HealthGaugeProps) {
  const isAvailable = !!car;
  const score = car?.healthScore ?? 0;

  const isGood = score >= 80;
  const isFair = score >= 60 && score < 80;

  const strokeColor = !isAvailable
    ? "#263554"
    : isGood
    ? "#10b981"
    : isFair
    ? "#f59e0b"
    : "#ef4444";

  const glowShadow = !isAvailable
    ? "none"
    : isGood
    ? "0 0 20px rgba(16, 185, 129, 0.45)"
    : isFair
    ? "0 0 20px rgba(245, 158, 11, 0.45)"
    : "0 0 20px rgba(239, 68, 68, 0.45)";

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isAvailable
    ? circumference - (score / 100) * circumference
    : circumference;

  const subsystems = car?.subsystems ?? {
    engine: "Good",
    battery: "Good",
    brakes: "Good",
    tyres: "Good",
    fluids: "Good",
  };

  // Friendly consumer labels
  const items = [
    { label: "Engine & Motor", status: isAvailable ? subsystems.engine : "Standby", emoji: "🚗" },
    { label: "Battery & Electrical", status: isAvailable ? subsystems.battery : "Standby", emoji: "🔋" },
    { label: "Brakes & Safety", status: isAvailable ? subsystems.brakes : "Standby", emoji: "🛑" },
    { label: "Tyres & Pressure", status: isAvailable ? subsystems.tyres : "Standby", emoji: "🛞" },
    { label: "Fluids & Coolant", status: isAvailable ? subsystems.fluids : "Standby", emoji: "💧" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl neu-card p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Vehicle Health
          </h3>
          <p className="text-xs text-slate-400">All key mechanical subsystems</p>
        </div>

        <button
          onClick={onViewDetails}
          disabled={!isAvailable}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition-colors"
        >
          <span>Diagnostic Scan</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Body: Neumorphic Circular Well & Friendly Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-4">
        {/* Sunken Neumorphic Circular Housing */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 neu-circle-inset p-3 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              {/* Recessed Background Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#080c16"
                strokeWidth="11"
                fill="none"
              />
              {/* Dynamic Progress Ring */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: `drop-shadow(${glowShadow})`,
                  transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease",
                }}
              />
            </svg>

            {/* Center Embossed Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono text-white tracking-tight">
                {isAvailable ? `${score}%` : "--%"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">HEALTH</span>
            </div>
          </div>

          <p
            className={`text-sm font-bold mt-2.5 ${
              !isAvailable
                ? "text-slate-400"
                : isGood
                ? "text-emerald-400"
                : isFair
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {isAvailable ? car.healthStatus : "Standby Mode"}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isAvailable ? car.healthMessage : "Add car to run automatic inspection"}
          </p>
        </div>

        {/* Consumer Subsystems Checklist */}
        <div className="sm:col-span-7 space-y-2">
          {items.map((item) => {
            const isItemGood = item.status === "Good";
            const isItemStandby = item.status === "Standby";

            return (
              <div
                key={item.label}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl neu-inset-subtle text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.emoji}</span>
                  <span className="font-medium text-slate-200">{item.label}</span>
                </div>

                <span
                  className={`font-semibold text-[11px] px-2 py-0.5 rounded-full ${
                    isItemStandby
                      ? "text-slate-500 bg-slate-900"
                      : isItemGood
                      ? "text-emerald-400 bg-emerald-950/60"
                      : "text-amber-400 bg-amber-950/60"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Automatic OBD-II Telemetry</span>
        <span className="text-cyan-400 font-medium">
          {isAvailable ? "● Live Monitored" : "○ Waiting for Car"}
        </span>
      </div>
    </div>
  );
}
