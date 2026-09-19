"use client";

import React, { useState } from "react";
import {
  Edit3,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  Gauge,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Car
} from "lucide-react";
import { DriveSenseCar } from "@/lib/drivesense-types";

interface ChassisWireframeProps {
  car: DriveSenseCar | null;
  onAddCarClick: () => void;
  onEditClick?: () => void;
  onSwitchCar?: () => void;
}

export default function ChassisWireframe({
  car,
  onAddCarClick,
  onEditClick,
  onSwitchCar,
}: ChassisWireframeProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  if (!car) {
    // EMPTY STATE (Consumer-friendly Neumorphic Soft UI)
    return (
      <div className="relative overflow-hidden rounded-3xl neu-card p-6 sm:p-8 backdrop-blur-xl group transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 neu-circle flex items-center justify-center text-slate-400">
              <Car className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                My Vehicle
                <span className="text-[10px] px-2.5 py-0.5 rounded-full neu-inset text-slate-400 font-mono">
                  STANDBY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Track fuel, maintenance, and vehicle health in one place
              </p>
            </div>
          </div>
        </div>

        {/* Center: Tactile Inset Well with Vector Wireframe (NO CAR PHOTOS) */}
        <div className="my-6 p-6 sm:p-8 rounded-2xl neu-inset flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-28 sm:w-60 sm:h-32 mb-4 flex items-center justify-center">
            {/* SVG Wireframe Schematic with scanning animation */}
            <svg
              className="w-full h-full text-slate-500/50"
              viewBox="0 0 240 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="40"
                y="20"
                width="160"
                height="80"
                rx="24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <path
                d="M70 20 L90 40 L150 40 L170 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M70 100 L90 80 L150 80 L170 100"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Wheels */}
              <rect x="55" y="10" width="22" height="12" rx="3" fill="currentColor" fillOpacity="0.3" />
              <rect x="163" y="10" width="22" height="12" rx="3" fill="currentColor" fillOpacity="0.3" />
              <rect x="55" y="98" width="22" height="12" rx="3" fill="currentColor" fillOpacity="0.3" />
              <rect x="163" y="98" width="22" height="12" rx="3" fill="currentColor" fillOpacity="0.3" />
              {/* Center Radar Crosshair */}
              <circle cx="120" cy="60" r="18" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="120" cy="60" r="3" fill="#06b6d4" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-mono tracking-wider text-cyan-400 neu-pill px-3.5 py-1">
                Awaiting Vehicle Link
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
            No Car Added Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
            Add your vehicle to see live fuel efficiency, upcoming oil & service reminders, and instant health diagnostics.
          </p>

          <div className="flex items-center justify-center">
            <button
              onClick={onAddCarClick}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl neu-btn-primary text-slate-950 font-bold text-xs tracking-wide"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Your Car</span>
            </button>
          </div>
        </div>

        {/* Consumer-Friendly Standby Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center pt-1">
          <div className="p-3 rounded-2xl neu-inset-subtle">
            <p className="text-[11px] text-slate-400 font-medium">Distance Driven</p>
            <p className="text-sm sm:text-base font-mono font-bold text-slate-400 mt-0.5">-- km</p>
          </div>
          <div className="p-3 rounded-2xl neu-inset-subtle">
            <p className="text-[11px] text-slate-400 font-medium">Fuel Efficiency</p>
            <p className="text-sm sm:text-base font-mono font-bold text-slate-400 mt-0.5">-- km/l</p>
          </div>
          <div className="p-3 rounded-2xl neu-inset-subtle">
            <p className="text-[11px] text-slate-400 font-medium">Condition</p>
            <p className="text-sm sm:text-base font-mono font-bold text-slate-400 mt-0.5">Standby</p>
          </div>
        </div>
      </div>
    );
  }

  // CONNECTED / UPLOADED VEHICLE STATE
  const isHealthy = car.healthScore >= 80;
  const isFair = car.healthScore >= 60 && car.healthScore < 80;

  return (
    <div className="relative overflow-hidden rounded-3xl neu-card p-6 sm:p-8 backdrop-blur-xl group transition-all">
      {/* Header with Tactile Emblem, Model, Specs, and Edit */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-800/40">
        <div className="flex items-center gap-3.5">
          {/* Neumorphic Emblem Housing (NO CAR PHOTO) */}
          <div className="w-13 h-13 neu-circle p-2.5 flex items-center justify-center shadow-lg">
            {car.brand.toLowerCase() === "bmw" ? (
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="20" cy="20" r="14" fill="#0f172a" />
                <path d="M20 6 A14 14 0 0 1 34 20 L20 20 Z" fill="#0284c7" />
                <path d="M6 20 A14 14 0 0 1 20 6 L20 20 Z" fill="#e2e8f0" />
                <path d="M20 20 L20 34 A14 14 0 0 1 6 20 Z" fill="#0284c7" />
                <path d="M20 20 L34 20 A14 14 0 0 1 20 34 Z" fill="#e2e8f0" />
              </svg>
            ) : (
              <div className="w-full h-full rounded-full bg-cyan-950/60 flex items-center justify-center text-cyan-400 font-mono font-black text-sm">
                {car.brand.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {car.brand} {car.model}
              </h2>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isHealthy
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                    : isFair
                    ? "bg-amber-950 text-amber-400 border border-amber-800/60"
                    : "bg-rose-950 text-rose-400 border border-rose-800/60"
                }`}
              >
                {car.healthStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {car.year} • {car.fuelType} • <span className="font-mono text-slate-300">{car.regNumber}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn text-slate-300 hover:text-white text-xs font-semibold"
              title="Edit car details"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edit</span>
            </button>
          )}

          {onSwitchCar && (
            <button
              onClick={onSwitchCar}
              className="p-2 rounded-xl neu-btn text-slate-400 hover:text-slate-200"
              title="Switch Vehicle"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Center: Tactile Inset Well with Vector Chassis Blueprint (NO CAR PHOTOS) */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl neu-inset flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm h-36 sm:h-40 flex items-center justify-center">
          {/* Vector Schematic Chassis */}
          <svg
            className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            viewBox="0 0 320 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background grid */}
            <line x1="20" y1="80" x2="300" y2="80" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            <line x1="160" y1="10" x2="160" y2="150" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

            {/* Aerodynamic body silhouette */}
            <path
              d="M50 80 C50 48 85 30 140 28 C200 26 250 42 270 70 C276 76 276 84 270 90 C250 118 200 134 140 132 C85 130 50 112 50 80 Z"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="#0d1424"
            />

            {/* Cabin Glass */}
            <path
              d="M110 44 C150 42 195 48 215 80 C195 112 150 118 110 116 C120 95 120 65 110 44 Z"
              stroke="#06b6d4"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              fill="#082f49"
              fillOpacity="0.3"
            />

            {/* Wheels & Calipers */}
            <rect x="210" y="16" width="34" height="14" rx="4" fill="#090d18" stroke="#0ea5e9" strokeWidth="1.5" />
            <rect x="210" y="130" width="34" height="14" rx="4" fill="#090d18" stroke="#0ea5e9" strokeWidth="1.5" />
            <rect x="76" y="16" width="34" height="14" rx="4" fill="#090d18" stroke="#0ea5e9" strokeWidth="1.5" />
            <rect x="76" y="130" width="34" height="14" rx="4" fill="#090d18" stroke="#0ea5e9" strokeWidth="1.5" />

            {/* Central Powertrain Unit */}
            <rect x="130" y="58" width="60" height="44" rx="6" fill="#0a1529" stroke="#0284c7" strokeWidth="1.5" />
            <path d="M145 68 L175 68 M145 80 L175 80 M145 92 L175 92" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* Sensor Nodes */}
            {/* 1. Engine */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveNode("Engine: " + car.subsystems.engine)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <circle
                cx="235"
                cy="80"
                r="7"
                className={`animate-pulse ${
                  car.subsystems.engine === "Good" ? "fill-emerald-400" : "fill-amber-400"
                }`}
              />
              <circle cx="235" cy="80" r="12" stroke={car.subsystems.engine === "Good" ? "#10b981" : "#f59e0b"} strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* 2. Battery */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveNode(`Battery: ${car.diagnostics.batteryVoltage}V`)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <circle cx="160" cy="80" r="6" className="fill-cyan-400" />
              <circle cx="160" cy="80" r="10" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* 3. Brakes */}
            <circle
              cx="227"
              cy="23"
              r="4"
              className={car.subsystems.brakes === "Good" ? "fill-emerald-400" : "fill-amber-400"}
              onMouseEnter={() => setActiveNode("Front Brakes: " + car.subsystems.brakes)}
              onMouseLeave={() => setActiveNode(null)}
            />
            <circle
              cx="227"
              cy="137"
              r="4"
              className={car.subsystems.brakes === "Good" ? "fill-emerald-400" : "fill-amber-400"}
              onMouseEnter={() => setActiveNode("Rear Brakes: " + car.subsystems.brakes)}
              onMouseLeave={() => setActiveNode(null)}
            />
          </svg>

          {/* Tooltip Pill */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[11px] font-medium px-3.5 py-1 rounded-full neu-pill text-cyan-300 shadow-md">
              {activeNode || "✨ Live Vehicle Telemetry • Tap nodes for details"}
            </span>
          </div>
        </div>
      </div>

      {/* Consumer-Friendly Metrics Row (Tactile sunken wells) */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl neu-inset-subtle">
          <p className="text-[11px] text-slate-400 font-medium">Distance Driven</p>
          <p className="text-base sm:text-lg font-mono font-black text-white mt-0.5">
            {car.totalDistanceKm.toLocaleString("en-IN")} km
          </p>
        </div>

        <div className="p-3 rounded-2xl neu-inset-subtle">
          <p className="text-[11px] text-slate-400 font-medium">Fuel Economy</p>
          <p className="text-base sm:text-lg font-mono font-black text-white mt-0.5">
            {car.avgMileage}
          </p>
        </div>

        <div className="p-3 rounded-2xl neu-inset-subtle">
          <p className="text-[11px] text-slate-400 font-medium">Condition</p>
          <p
            className={`text-base sm:text-lg font-mono font-black mt-0.5 ${
              isHealthy ? "text-emerald-400" : isFair ? "text-amber-400" : "text-rose-400"
            }`}
          >
            {car.healthStatus}
          </p>
        </div>
      </div>
    </div>
  );
}
