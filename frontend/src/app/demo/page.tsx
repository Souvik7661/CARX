"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { Vehicle } from "@/lib/types";
import { api } from "@/lib/api";
import { formatINR, formatKm, getScoreColor, getVerdictConfig } from "@/lib/utils";

export default function DemoShowcasePage() {
  const [demos, setDemos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const loadDemos = async () => {
    try {
      setLoading(true);
      const list = await api.getDemoVehicles();
      setDemos(list);
    } catch (err) {
      console.error("Failed to load demo vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemos();
  }, []);

  const handleResetSeed = async () => {
    setResetting(true);
    try {
      await api.seedDemoData();
      await loadDemos();
    } catch (err: any) {
      alert("Error resetting seed data: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
                Controlled Demo Archetypes
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Explore 3 realistic automotive case studies demonstrating the algorithmic reasoning behind BUY, NEGOTIATE, and AVOID verdicts.
            </p>
          </div>

          <button
            onClick={handleResetSeed}
            disabled={resetting}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold text-xs flex items-center gap-2 border border-slate-800 transition-all self-start sm:self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>{resetting ? "Re-seeding Sandbox..." : "Reset Demo Sandbox"}</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-cyan-400">
            Loading demo vehicles...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demos.map((v) => {
              const score = v.risk_score?.overall_score || 70;
              const colors = getScoreColor(score);
              const verdict = v.valuation?.recommendation || "NEGOTIATE";
              const config = getVerdictConfig(verdict);

              return (
                <div
                  key={v.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col shadow-xl group"
                >
                  {/* Photo with Badge */}
                  <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.image_url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop&q=80"}
                      alt={v.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono tracking-wider border ${config.badgeClass}`}>
                        {config.icon} {config.label}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white font-mono text-xs font-bold border border-slate-800">
                      Score: <span className={colors.text}>{score}</span>/100
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white font-mono">
                        {v.year} {v.make} {v.model}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {formatKm(v.mileage)} • {v.fuel_type} • {v.location || "India"}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Asking Price</span>
                          <span className="font-bold text-white">{formatINR(v.asking_price)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Fair Market Band</span>
                          <span className="font-bold text-cyan-400">
                            {v.valuation ? `${formatINR(v.valuation.estimated_fair_min, true)} – ${formatINR(v.valuation.estimated_fair_max, true)}` : "—"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-2">
                        {v.valuation?.valuation_notes || config.desc}
                      </p>
                    </div>

                    <Link
                      href={`/vehicles/${v.id}`}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-transparent"
                    >
                      <span>Open Workspace Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
