"use client";

import React from "react";
import { Gauge, AlertTriangle, CheckCircle2, ShieldAlert, TrendingUp } from "lucide-react";
import { MileageAnalysis } from "@/lib/types";
import { formatKm } from "@/lib/utils";

interface MileageChartProps {
  analysis?: MileageAnalysis | null;
  currentDeclared?: number | null;
}

export default function MileageChart({ analysis, currentDeclared }: MileageChartProps) {
  if (!analysis) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
        Mileage consistency telemetry not loaded.
      </div>
    );
  }

  const isRollback = analysis.rollback_risk === "High";
  const isConsistent =
    analysis.status === "Strong evidence of consistency" ||
    analysis.status === "Consistent";

  // Compute graph scaling for SVG line
  const points = analysis.data_points || [];
  const maxOdo = Math.max(...points.map((p) => p.odometer), currentDeclared || 1000, 10000);
  const minOdo = Math.min(...points.map((p) => p.odometer), 0);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Mileage Consistency & Rollback Audit
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Chronological cross-verification across registration, dealership logs, and inspection inputs.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-xl text-xs font-bold font-mono tracking-wide border flex items-center gap-2 ${
              isRollback
                ? "bg-red-950 text-red-400 border-red-800"
                : isConsistent
                ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                : "bg-amber-950 text-amber-400 border-amber-800"
            }`}
          >
            {isRollback ? (
              <AlertTriangle className="w-4 h-4" />
            ) : isConsistent ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
            <span>{analysis.status}</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Confidence
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {analysis.confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div
        className={`p-4 rounded-xl border text-xs leading-relaxed ${
          isRollback
            ? "bg-red-950/30 border-red-800/60 text-red-300"
            : isConsistent
            ? "bg-slate-950 border-slate-800 text-slate-300"
            : "bg-amber-950/20 border-amber-800/50 text-amber-300"
        }`}
      >
        <p>
          <strong className="font-semibold text-white">Summary: </strong>
          {analysis.summary}
        </p>
      </div>

      {/* Rollback Risk Meter */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Odometer Rollback Probability</span>
          <span
            className={`font-mono font-bold ${
              isRollback ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {analysis.rollback_risk === "High"
              ? "CRITICAL RISK (Tampering Detected)"
              : analysis.rollback_risk === "Low"
              ? "LOW / UNLIKELY"
              : "NONE DETECTED"}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isRollback ? "bg-red-500 w-full" : "bg-emerald-500 w-[5%]"
            }`}
          />
        </div>

        {analysis.annual_average_km && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
            <span>Estimated Annual Pace:</span>
            <span className="text-cyan-400 font-bold">
              ~{Math.round(analysis.annual_average_km).toLocaleString()} km/year
            </span>
          </div>
        )}
      </div>

      {/* Data Points Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Chronological Readings ({points.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono"
            >
              <span className="text-[10px] text-slate-400 block">{pt.date}</span>
              <span className="text-sm font-bold text-white block">
                {pt.odometer.toLocaleString()} km
              </span>
              <span className="text-[10px] text-cyan-400 truncate block">
                {pt.source}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
