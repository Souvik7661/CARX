"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, ArrowRight, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import { Vehicle, ComparisonResult } from "@/lib/types";
import { api } from "@/lib/api";
import { formatINR, getScoreColor, getVerdictConfig } from "@/lib/utils";

export default function CompareVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getVehicles()
      .then((list) => {
        setVehicles(list);
        // Default select up to 3
        const initial = list.slice(0, 3).map((v) => v.id);
        setSelectedIds(initial);
        if (initial.length > 0) {
          api.compareVehicles(initial).then(setComparison).catch(console.error);
        }
      })
      .catch(console.error);
  }, []);

  const handleToggle = (id: string) => {
    let next: string[];
    if (selectedIds.includes(id)) {
      next = selectedIds.filter((x) => x !== id);
    } else {
      if (selectedIds.length >= 3) {
        alert("You can compare a maximum of 3 vehicles simultaneously.");
        return;
      }
      next = [...selectedIds, id];
    }
    setSelectedIds(next);

    if (next.length > 0) {
      setLoading(true);
      api.compareVehicles(next)
        .then(setComparison)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setComparison(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
              Side-by-Side Vehicle Comparison Matrix
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare up to 3 candidate vehicles. Evaluate trust score variance, fair valuation, looming repair risk, and 5-year ownership costs.
          </p>
        </div>

        {/* Vehicle Selection Chips */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">
            Select Candidates ({selectedIds.length}/3 selected):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {vehicles.map((v) => {
              const isSelected = selectedIds.includes(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => handleToggle(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {v.year} {v.make} {v.model} {isSelected ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Option AI Callout */}
        {comparison && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/40 space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>CARX Algorithmic Recommendation</span>
            </div>
            <h3 className="text-xl font-black text-white font-mono">
              Best Overall Acquisition: {comparison.best_overall_title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {comparison.rationale}
            </p>
          </div>
        )}

        {/* Side-by-Side Table Matrix */}
        {comparison && comparison.vehicles.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-xl bg-slate-900">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="p-4 text-slate-400 font-mono uppercase font-bold w-1/4">
                    Metric / Telemetry
                  </th>
                  {comparison.vehicles.map((c) => (
                    <th key={c.vehicle.id} className="p-4 text-white font-mono font-bold w-1/4">
                      <div className="space-y-1">
                        <span className="text-sm font-black block">
                          {c.vehicle.year} {c.vehicle.make} {c.vehicle.model}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal block font-sans">
                          {c.vehicle.variant || "Standard"}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {/* 1. Verdict */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-300 font-sans">CARX Verdict</td>
                  {comparison.vehicles.map((c) => {
                    const cfg = getVerdictConfig(c.recommendation);
                    return (
                      <td key={c.vehicle.id} className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.badgeClass}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* 2. Trust Score */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-300 font-sans">CARX Trust Score</td>
                  {comparison.vehicles.map((c) => {
                    const cols = getScoreColor(c.trust_score);
                    return (
                      <td key={c.vehicle.id} className="p-4">
                        <span className={`text-lg font-black ${cols.text}`}>
                          {c.trust_score}
                        </span>
                        <span className="text-slate-500 text-[10px]"> / 100</span>
                      </td>
                    );
                  })}
                </tr>

                {/* 3. Asking Price */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-300 font-sans">Asking Price</td>
                  {comparison.vehicles.map((c) => (
                    <td key={c.vehicle.id} className="p-4 font-bold text-white">
                      {c.asking_price_formatted}
                    </td>
                  ))}
                </tr>

                {/* 4. Fair Value Band */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-300 font-sans">Estimated Fair Value</td>
                  {comparison.vehicles.map((c) => (
                    <td key={c.vehicle.id} className="p-4 text-cyan-400 font-bold">
                      {c.fair_value_range}
                    </td>
                  ))}
                </tr>

                {/* 5. Repair Risk */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-300 font-sans">Predicted Repair Risk</td>
                  {comparison.vehicles.map((c) => (
                    <td
                      key={c.vehicle.id}
                      className={`p-4 font-bold ${
                        c.repair_risk === "Low"
                          ? "text-emerald-400"
                          : c.repair_risk === "Moderate"
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {c.repair_risk}
                    </td>
                  ))}
                </tr>

                {/* 6. Service Confidence */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-300 font-sans">Service History Confidence</td>
                  {comparison.vehicles.map((c) => (
                    <td key={c.vehicle.id} className="p-4 text-slate-300">
                      {c.service_confidence}%
                    </td>
                  ))}
                </tr>

                {/* 7. 5-Yr Ownership TCO */}
                <tr className="hover:bg-slate-850/40">
                  <td className="p-4 font-bold text-slate-300 font-sans">5-Year Cumulative TCO</td>
                  {comparison.vehicles.map((c) => (
                    <td key={c.vehicle.id} className="p-4 text-slate-200 font-bold">
                      {c.five_year_tco}
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr className="bg-slate-950">
                  <td className="p-4 font-bold text-slate-400 font-sans">Workspace</td>
                  {comparison.vehicles.map((c) => (
                    <td key={c.vehicle.id} className="p-4">
                      <Link
                        href={`/vehicles/${c.vehicle.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-[11px] transition-colors"
                      >
                        <span>Open Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
            Select candidate vehicles above to render the side-by-side decision matrix.
          </div>
        )}
      </div>
    </div>
  );
}
