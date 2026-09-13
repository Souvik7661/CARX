"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Store, AlertTriangle, Clock, ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";
import { DealerStats } from "@/lib/types";
import { api } from "@/lib/api";
import { formatINR, formatKm, getScoreColor, getVerdictConfig } from "@/lib/utils";

export default function DealerDashboardPage() {
  const [stats, setStats] = useState<DealerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDealerStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
              Dealer Portfolio & Inventory Risk Operations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time inventory metrics calculated directly from stored vehicle records. Identify aging stock, margin vulnerability, and pending inspections.
          </p>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400">Active Inventory Count</span>
            <div className="text-3xl font-black font-mono text-white">
              {stats?.total_inventory ?? 0}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Total managed units</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400">Aging Inventory (&gt;60 Days)</span>
            <div className="text-3xl font-black font-mono text-amber-400">
              {stats?.aging_inventory_count ?? 0}
            </div>
            <span className="text-[11px] text-amber-400/80 font-mono">Depreciation holding cost</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400">Price Risk Units</span>
            <div className="text-3xl font-black font-mono text-red-400">
              {stats?.price_risk_count ?? 0}
            </div>
            <span className="text-[11px] text-red-400/80 font-mono">Priced above market fair-max</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400">Physical Inspection Required</span>
            <div className="text-3xl font-black font-mono text-cyan-400">
              {stats?.inspection_required_count ?? 0}
            </div>
            <span className="text-[11px] text-cyan-400/80 font-mono">Pending mechanic sign-off</span>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Vehicle Inventory Risk Registry
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Portfolio Average Score: <strong className="text-cyan-400">{stats?.average_trust_score ?? 75}</strong>/100
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 font-mono text-slate-400">
                  <th className="p-3.5">Vehicle Title</th>
                  <th className="p-3.5">Odometer</th>
                  <th className="p-3.5">Asking Price</th>
                  <th className="p-3.5">Estimated Fair Value</th>
                  <th className="p-3.5">Trust Score</th>
                  <th className="p-3.5">Days in Stock</th>
                  <th className="p-3.5">Risk Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {stats?.items?.map((item) => {
                  const score = item.trust_score || 70;
                  const cols = getScoreColor(score);
                  return (
                    <tr key={item.vehicle_id} className="hover:bg-slate-850/40">
                      <td className="p-3.5 font-bold text-white font-sans">
                        {item.title}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {formatKm(item.mileage)}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {formatINR(item.asking_price)}
                      </td>
                      <td className="p-3.5 text-cyan-400">
                        {item.estimated_fair_min
                          ? `${formatINR(item.estimated_fair_min, true)} – ${formatINR(item.estimated_fair_max, true)}`
                          : "—"}
                      </td>
                      <td className="p-3.5">
                        <span className={`font-bold ${cols.text}`}>{score}</span>/100
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            item.is_aging
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "text-slate-300"
                          }`}
                        >
                          {item.days_in_stock} days
                        </span>
                      </td>
                      <td className="p-3.5">
                        {item.price_risk ? (
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 font-bold border border-red-800 text-[10px]">
                            Overpriced
                          </span>
                        ) : item.inspection_required ? (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                            Needs Inspection
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 text-[10px]">
                            Prime Stock
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/vehicles/${item.vehicle_id}`}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
