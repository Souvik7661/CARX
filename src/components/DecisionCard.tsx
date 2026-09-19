"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Shield } from "lucide-react";
import { Valuation, RiskScore } from "@/lib/types";
import { formatINR, getVerdictConfig } from "@/lib/utils";

interface DecisionCardProps {
  valuation?: Valuation | null;
  riskScore?: RiskScore | null;
  onExploreReport?: () => void;
}

export default function DecisionCard({ valuation, riskScore, onExploreReport }: DecisionCardProps) {
  const recommendation = valuation?.recommendation || "NEGOTIATE";
  const config = getVerdictConfig(recommendation);

  const isBuy = recommendation === "BUY";
  const isNegotiate = recommendation === "NEGOTIATE";
  const isAvoid = recommendation === "AVOID";

  return (
    <div className={`rounded-2xl border p-6 shadow-xl transition-all ${
      isBuy
        ? "bg-emerald-950/20 border-emerald-500/40"
        : isNegotiate
        ? "bg-amber-950/20 border-amber-500/40"
        : "bg-red-950/20 border-red-500/40"
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Decision Title & Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-xl text-lg font-black font-mono tracking-wider border ${config.badgeClass}`}>
              {config.icon} {config.label}
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Algorithmic Decision Advisory
            </span>
          </div>

          <h4 className="text-lg font-bold text-white tracking-tight">
            {isBuy && "Strong Purchase Candidate: Low Risk Profile"}
            {isNegotiate && "Negotiation Recommended: Price Disparity Detected"}
            {isAvoid && "High Purchase Risk: Avoid Transaction"}
          </h4>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {valuation?.valuation_notes || config.desc}
          </p>
        </div>

        {/* Right Side: Key Numerical Summary */}
        <div className="flex flex-wrap items-center gap-4 md:border-l md:border-slate-800 md:pl-6">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center min-w-[120px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Asking Price
            </span>
            <span className="text-sm font-extrabold font-mono text-white">
              {formatINR(valuation?.asking_price, true)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Fair Value Band
            </span>
            <span className="text-sm font-extrabold font-mono text-cyan-400">
              {valuation?.estimated_fair_min ? `${formatINR(valuation.estimated_fair_min, true)} – ${formatINR(valuation.estimated_fair_max, true)}` : "—"}
            </span>
          </div>

          {onExploreReport && (
            <button
              onClick={onExploreReport}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <span>Full Dossier</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
