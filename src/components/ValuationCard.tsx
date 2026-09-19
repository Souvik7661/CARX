"use client";

import React, { useState } from "react";
import { DollarSign, TrendingDown, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { Valuation } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { api } from "@/lib/api";

interface ValuationCardProps {
  vehicleId: string;
  valuation?: Valuation | null;
  onUpdated?: (val: Valuation) => void;
}

export default function ValuationCard({ vehicleId, valuation, onUpdated }: ValuationCardProps) {
  const [askingInput, setAskingInput] = useState<number>(valuation?.asking_price || 900000);
  const [loading, setLoading] = useState(false);

  const handleRecalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await api.recalculateValuation(vehicleId, Number(askingInput));
      if (onUpdated) onUpdated(updated);
    } catch (err: any) {
      alert("Error recalculating valuation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isOverpriced = (valuation?.price_difference || 0) > 0;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Fair Market Valuation & Price Arbitrage
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Statistical regression curve adjusted for vehicle age, accumulated mileage, and detected panel defects.
          </p>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-cyan-400 font-mono border border-slate-700">
          Estimated Market Model
        </span>
      </div>

      {/* Main Numbers Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estimated Fair Value Band */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Estimated Fair Value Band</span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {valuation?.estimated_fair_min
              ? `${formatINR(valuation.estimated_fair_min, true)} – ${formatINR(valuation.estimated_fair_max, true)}`
              : "—"}
          </div>
          <p className="text-[11px] text-slate-400">
            Midpoint: {formatINR(((valuation?.estimated_fair_min || 0) + (valuation?.estimated_fair_max || 0)) / 2)}
          </p>
        </div>

        {/* Current Asking Price */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Current Asking Price</span>
          <div className="text-2xl font-black font-mono text-white">
            {formatINR(valuation?.asking_price)}
          </div>
          <p className="text-[11px] text-slate-400">
            Seller quoted listing price
          </p>
        </div>

        {/* Price Disparity */}
        <div
          className={`p-4 rounded-xl border space-y-1 ${
            isOverpriced
              ? "bg-amber-950/20 border-amber-800/60"
              : "bg-emerald-950/20 border-emerald-800/60"
          }`}
        >
          <span className="text-xs font-semibold text-slate-400">Market Price Disparity</span>
          <div
            className={`text-2xl font-black font-mono ${
              isOverpriced ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {isOverpriced ? "+" : ""}
            {formatINR(valuation?.price_difference)}
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
              isOverpriced
                ? "bg-amber-950 text-amber-300 border border-amber-800"
                : "bg-emerald-950 text-emerald-300 border border-emerald-800"
            }`}
          >
            {isOverpriced ? "Priced Above Fair Range" : "Competitively Priced"}
          </span>
        </div>
      </div>

      {/* Advisory Notes */}
      {valuation?.valuation_notes && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs text-slate-300 space-y-1">
          <strong className="text-cyan-400 font-semibold block">Negotiation Strategy:</strong>
          <p className="leading-relaxed">{valuation.valuation_notes}</p>
        </div>
      )}

      {/* Interactive Price Modifier */}
      <form
        onSubmit={handleRecalculate}
        className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Simulate Counter-Offer or Updated Asking Price (₹)
          </label>
          <input
            type="number"
            step="5000"
            value={askingInput}
            onChange={(e) => setAskingInput(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all self-end"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Calculating..." : "Recalculate Valuation"}</span>
        </button>
      </form>
    </div>
  );
}
