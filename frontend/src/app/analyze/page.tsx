"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Settings2,
  DollarSign,
  MapPin,
  CheckCircle2,
  Layers
} from "lucide-react";
import { api } from "@/lib/api";

export default function AnalyzeVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State with Progressive Disclosure
  const [regNo, setRegNo] = useState("");
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("Hyundai");
  const [model, setModel] = useState("Creta");
  const [variant, setVariant] = useState("1.5 SX Executive");
  const [year, setYear] = useState("2021");
  const [fuelType, setFuelType] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [mileage, setMileage] = useState("48230");
  const [askingPrice, setAskingPrice] = useState("925000");
  const [location, setLocation] = useState("Pune, Maharashtra");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !year) {
      setError("Please specify at least Make, Model, and Year to initialize the vehicle.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await api.createVehicle({
        reg_no: regNo || undefined,
        vin: vin || undefined,
        make: make.trim(),
        model: model.trim(),
        variant: variant.trim() || undefined,
        year: Number(year),
        fuel_type: fuelType,
        transmission: transmission,
        mileage: mileage ? Number(mileage) : undefined,
        asking_price: askingPrice ? Number(askingPrice) : undefined,
        location: location || undefined,
      });

      // Automatically trigger initial synthesis
      try {
        await api.triggerAnalysis(created.id);
      } catch (analysisErr) {
        console.warn("Initial analysis deferred:", analysisErr);
      }

      router.push(`/vehicles/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create vehicle workspace.");
      setLoading(false);
    }
  };

  const handlePreload = (preset: "creta" | "city" | "nexon") => {
    if (preset === "creta") {
      setRegNo("MH 12 QX 4921");
      setVin("MALC281CM8M129482");
      setMake("Hyundai");
      setModel("Creta");
      setVariant("1.5 SX Executive");
      setYear("2021");
      setFuelType("Petrol");
      setTransmission("Manual");
      setMileage("48230");
      setAskingPrice("925000");
      setLocation("Pune, Maharashtra");
    } else if (preset === "city") {
      setRegNo("MH 02 EE 7731");
      setVin("MAKGM461AL482910");
      setMake("Honda");
      setModel("City");
      setVariant("ZX i-VTEC");
      setYear("2022");
      setFuelType("Petrol");
      setTransmission("Automatic");
      setMileage("34500");
      setAskingPrice("1180000");
      setLocation("Mumbai, Maharashtra");
    } else {
      setRegNo("DL 8C BD 9901");
      setVin("MAT612800NL918231");
      setMake("Tata");
      setModel("Nexon");
      setVariant("XZ+ Lux");
      setYear("2023");
      setFuelType("Petrol");
      setTransmission("Manual");
      setMileage("19400");
      setAskingPrice("980000");
      setLocation("Delhi, NCR");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider">
            Vehicle Workspace Intake
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-mono">
            Initialize Vehicle Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Provide available vehicle specifications. You do not need all fields right now; you can progressively enrich documents and inspection photos in the workspace.
          </p>
        </div>

        {/* Quick Preload Presets */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Fast Auto-Fill Presets:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePreload("creta")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono transition-colors"
            >
              Hyundai Creta
            </button>
            <button
              type="button"
              onClick={() => handlePreload("city")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono transition-colors"
            >
              Honda City
            </button>
            <button
              type="button"
              onClick={() => handlePreload("nexon")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono transition-colors"
            >
              Tata Nexon
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Main Intake Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          {/* Section 1: Identification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>1. Vehicle Registration & Identifiers (Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. MH 12 QX 4921"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Enables automatic RC cross-checking
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  VIN / Chassis Number
                </label>
                <input
                  type="text"
                  placeholder="17-Character VIN (Optional)"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Verifies manufacturer recall & factory specs
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Core Specifications */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-3.5 h-3.5" />
              <span>2. Vehicle Specifications (Required)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Make *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyundai"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Creta"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Trim / Variant</label>
                <input
                  type="text"
                  placeholder="e.g. 1.5 SX Executive"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Manufacturing Year *</label>
                <input
                  type="number"
                  required
                  min="1990"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Telemetry & Pricing */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>3. Telemetry & Financial Context</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Odometer (km)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 48230"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Asking Price (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  placeholder="e.g. 925000"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Generating Workspace & Scoring..." : "Initialize Vehicle Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
