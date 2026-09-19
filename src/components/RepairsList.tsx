"use client";

import React from "react";
import { Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { RepairPrediction } from "@/lib/types";
import { formatINR } from "@/lib/utils";

interface RepairsListProps {
  repairs?: RepairPrediction | null;
}

export default function RepairsList({ repairs }: RepairsListProps) {
  if (!repairs || !repairs.predictions || repairs.predictions.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center text-xs text-slate-400">
        No impending repairs or wear-and-tear items predicted.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Predictive Maintenance & Near-Term Repairs
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Statistical component lifetime modeling based on mileage, vehicle age, and detected panel issues.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Estimated Near-Term Budget
          </span>
          <span className="text-base font-black font-mono text-cyan-400">
            {formatINR(repairs.total_estimated_repair_min, true)} – {formatINR(repairs.total_estimated_repair_max, true)}
          </span>
        </div>
      </div>

      {/* Disclaimers on categories */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono border-b border-slate-800/80 pb-3">
        <span className="text-slate-400">Provenance Tagging:</span>
        <div className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Detected Issue (Visual/OBD)</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Predicted Maintenance (Statistical Wear)</span>
        </div>
      </div>

      {/* Prediction Cards Grid */}
      <div className="space-y-3">
        {repairs.predictions.map((item, idx) => {
          const isHigh = item.priority === "High";
          const isMedium = item.priority === "Medium";
          const isDetected = item.category === "Detected Issue";

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isDetected
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {item.component}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isHigh
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : isMedium
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {item.priority} Priority
                  </span>

                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {formatINR(item.estimated_min)} – {formatINR(item.estimated_max)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {item.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
