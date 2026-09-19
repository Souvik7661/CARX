"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Activity,
  Zap,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Car,
  Radio,
  Gauge
} from "lucide-react";
import { DriveSenseCar } from "@/lib/drivesense-types";

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: DriveSenseCar | null;
}

export default function DiagnosticsModal({
  isOpen,
  onClose,
  car,
}: DiagnosticsModalProps) {
  const [activeTab, setActiveTab] = useState<"live" | "dtc">("live");
  const [waveOffset, setWaveOffset] = useState(0);

  // Animate oscilloscope waveform
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const diagnostics = car?.diagnostics ?? {
    rpm: 0,
    batteryVoltage: 0,
    engineTemp: 0,
    dtcCodesCount: 0,
    dtcCodes: [],
    connectionStatus: "Offline",
  };

  const isConnected = !!car;

  // Generate dynamic oscilloscope waveform points
  const points: string[] = [];
  const width = 360;
  const height = 60;
  const numPoints = 36;
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * width;
    const t = (i + waveOffset * 0.4) * 0.4;
    // Oscilloscope pulse simulation
    const y = isConnected
      ? height / 2 + Math.sin(t) * 16 + Math.cos(t * 2.3) * 6
      : height / 2;
    points.push(`${x},${y}`);
  }
  const polylineStr = points.join(" ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl p-5 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Live Diagnostics
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-emerald-400 animate-ping" : "bg-slate-500"
                }`}
              />
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                {isConnected ? "Connected via OBD-II" : "OBD-II Standby"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 OBD-II Primary Metrics (Matching Screen 4) */}
        <div className="grid grid-cols-4 gap-2 my-4">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center">
            <div className="flex justify-center text-cyan-400 mb-1">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm sm:text-base font-mono font-black text-white">
              {isConnected ? diagnostics.rpm : "--"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">RPM</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center">
            <div className="flex justify-center text-amber-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm sm:text-base font-mono font-black text-white">
              {isConnected ? `${diagnostics.batteryVoltage}V` : "--"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Battery</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center">
            <div className="flex justify-center text-rose-400 mb-1">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm sm:text-base font-mono font-black text-white">
              {isConnected ? `${diagnostics.engineTemp}°C` : "--"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Engine Temp</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center">
            <div className="flex justify-center text-indigo-400 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <p
              className={`text-sm sm:text-base font-mono font-black ${
                diagnostics.dtcCodesCount > 0 ? "text-rose-400" : "text-white"
              }`}
            >
              {isConnected ? diagnostics.dtcCodesCount : "--"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">DTC Codes</p>
          </div>
        </div>

        {/* Center: Vector Chassis Top-Down Schematic (NO CAR PHOTO) */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="relative w-44 h-48 flex items-center justify-center">
            <svg
              className="w-full h-full text-slate-400"
              viewBox="0 0 160 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Chassis Contour */}
              <path
                d="M40 50 C40 25 60 15 80 15 C100 15 120 25 120 50 L125 140 C125 170 115 200 80 200 C45 200 35 170 35 140 Z"
                stroke="#38bdf8"
                strokeWidth="2"
                fill="#0b132b"
              />
              {/* Wheels */}
              <rect x="18" y="45" width="14" height="28" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
              <rect x="128" y="45" width="14" height="28" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
              <rect x="18" y="145" width="14" height="28" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
              <rect x="128" y="145" width="14" height="28" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />

              {/* Engine Node */}
              <circle
                cx="80"
                cy="55"
                r="10"
                className={`animate-pulse ${
                  diagnostics.engineTemp > 100
                    ? "fill-rose-500 shadow-[0_0_12px_#f43f5e]"
                    : "fill-emerald-500 shadow-[0_0_12px_#10b981]"
                }`}
              />
              <circle cx="80" cy="55" r="16" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />

              {/* Center Transmission/Battery */}
              <rect x="65" y="90" width="30" height="40" rx="4" fill="#0369a1" fillOpacity="0.4" stroke="#0284c7" />

              {/* Exhaust/Emissions Node */}
              <circle cx="80" cy="180" r="6" fill="#38bdf8" />
            </svg>

            <div className="absolute top-2 right-0">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                Top-Down CAN Bus
              </span>
            </div>
          </div>
        </div>

        {/* Tabs: Live Data | Trouble Codes */}
        <div className="grid grid-cols-2 gap-2 mt-2 mb-3">
          <button
            onClick={() => setActiveTab("live")}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "live"
                ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live Data
          </button>
          <button
            onClick={() => setActiveTab("dtc")}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "dtc"
                ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Trouble Codes ({diagnostics.dtcCodesCount})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "live" ? (
          /* Live Waveform Oscilloscope */
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300">
                O2 & Crankshaft Oscilloscope
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Real-Time
              </span>
            </div>

            <svg className="w-full h-16" viewBox="0 0 360 60">
              {/* Background Grid */}
              <line x1="0" y1="15" x2="360" y2="15" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="0" y1="30" x2="360" y2="30" stroke="#1e293b" strokeWidth="0.8" />
              <line x1="0" y1="45" x2="360" y2="45" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
              {/* Animated Waveform */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                points={polylineStr}
                style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.6))" }}
              />
            </svg>
          </div>
        ) : (
          /* DTC Codes List */
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 min-h-[90px]">
            {diagnostics.dtcCodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-400 mb-1" />
                <p className="text-xs font-bold text-white">No Diagnostic Trouble Codes</p>
                <p className="text-[11px] text-slate-400">ECU scan completed. All systems operational.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {diagnostics.dtcCodes.map((dtc) => (
                  <div
                    key={dtc.code}
                    className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40 flex items-start gap-2 text-left"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-bold text-rose-300">
                        {dtc.code}
                      </span>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        {dtc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
