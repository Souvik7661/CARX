"use client";

import React, { useState } from "react";
import { TrendingUp, RefreshCw, Sliders, DollarSign, Calculator } from "lucide-react";
import { OwnershipCost } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { api } from "@/lib/api";

interface OwnershipCalculatorProps {
  vehicleId: string;
  initialTco?: OwnershipCost | null;
  fuelType?: string;
}

export default function OwnershipCalculator({
  vehicleId,
  initialTco,
  fuelType = "Petrol",
}: OwnershipCalculatorProps) {
  const [tco, setTco] = useState<OwnershipCost | null>(initialTco || null);
  const [termYears, setTermYears] = useState<number>(initialTco?.term_years || 5);
  const [annualKm, setAnnualKm] = useState<number>(12000);
  const [fuelPrice, setFuelPrice] = useState<number>(102);
  const [mileageKmpl, setMileageKmpl] = useState<number>(14.5);
  const [insuranceAnnual, setInsuranceAnnual] = useState<number>(24000);
  const [loading, setLoading] = useState(false);

  const handleRecalculate = async () => {
    setLoading(true);
    try {
      const res = await api.recalculateOwnershipCost(vehicleId, {
        term_years: termYears,
        annual_km: annualKm,
        fuel_price_per_litre: fuelPrice,
        fuel_efficiency_kmpl: mileageKmpl,
        insurance_annual: insuranceAnnual,
      });
      setTco(res);
    } catch (err: any) {
      alert("Error recalculating TCO: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTermChange = async (years: number) => {
    setTermYears(years);
    setLoading(true);
    try {
      const res = await api.getOwnershipCost(vehicleId, years);
      setTco(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Total Cost of Ownership (TCO) Financial Model
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Simulate operational costs including fuel burn, insurance renewals, routine maintenance, tyres, and depreciation.
          </p>
        </div>

        {/* 3-Yr / 5-Yr Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => handleTermChange(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              termYears === 3
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            3-Year Horizon
          </button>
          <button
            onClick={() => handleTermChange(5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              termYears === 5
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            5-Year Horizon
          </button>
        </div>
      </div>

      {/* Main Totals Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Estimated Cumulative {termYears}-Year Ownership Outlay
          </span>
          <div className="text-4xl font-black font-mono text-cyan-400 tracking-tight">
            {formatINR(tco?.total_cost)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Excludes salvage resale value. Estimated resale retention:{" "}
            <span className="text-emerald-400 font-mono font-bold">
              {formatINR((tco?.purchase_price || 0) - (tco?.depreciation_cost || 0))}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Monthly Run Rate</span>
            <span className="font-bold text-white">
              {formatINR((tco?.total_cost || 0) / (termYears * 12))} / mo
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Cost Per Traversed KM</span>
            <span className="font-bold text-white">
              ₹{(((tco?.total_cost || 0) - (tco?.purchase_price || 0)) / Math.max(1, annualKm * termYears)).toFixed(1)} / km
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Cost Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Purchase Price</span>
          <span className="text-sm font-black font-mono text-white">
            {formatINR(tco?.purchase_price, true)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Fuel Cost</span>
          <span className="text-sm font-black font-mono text-amber-400">
            {formatINR(tco?.fuel_cost, true)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Insurance Premiums</span>
          <span className="text-sm font-black font-mono text-blue-400">
            {formatINR(tco?.insurance_cost, true)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Scheduled Service</span>
          <span className="text-sm font-black font-mono text-purple-400">
            {formatINR(tco?.maintenance_cost, true)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Tyres & Battery</span>
          <span className="text-sm font-black font-mono text-rose-400">
            {formatINR(tco?.tyres_cost, true)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Asset Depreciation</span>
          <span className="text-sm font-black font-mono text-slate-400">
            {formatINR(tco?.depreciation_cost, true)}
          </span>
        </div>
      </div>

      {/* Assumptions Adjuster Form */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Adjust Actuarial Assumptions</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Annual Mileage (km)</label>
            <input
              type="number"
              step="1000"
              value={annualKm}
              onChange={(e) => setAnnualKm(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Fuel Price (₹/Litre)</label>
            <input
              type="number"
              step="1"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Fuel Efficiency (km/L)</label>
            <input
              type="number"
              step="0.5"
              value={mileageKmpl}
              onChange={(e) => setMileageKmpl(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Annual Insurance Premium (₹)</label>
            <input
              type="number"
              step="1000"
              value={insuranceAnnual}
              onChange={(e) => setInsuranceAnnual(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleRecalculate}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Recalculating..." : "Apply Custom Assumptions"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
