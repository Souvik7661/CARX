"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, Cpu, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Vehicle } from "@/lib/types";
import { api } from "@/lib/api";

export default function InspectorPortalPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [mechanicName, setMechanicName] = useState("Rajesh Sharma (Senior Master Technician)");
  const [batteryVoltage, setBatteryVoltage] = useState("12.6");
  const [coolantTemp, setCoolantTemp] = useState("89.0");
  const [engineHealth, setEngineHealth] = useState("GOOD");
  const [obdInput, setObdInput] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getVehicles().then((list) => {
      setVehicles(list);
      if (list.length > 0) setSelectedVehicleId(list[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) return;

    setSubmitting(true);
    try {
      const parsedObd = obdInput
        .split("\n")
        .filter((l) => l.trim())
        .map((line) => {
          const parts = line.split(":");
          return {
            code: parts[0]?.trim() || "DTC",
            description: parts[1]?.trim() || "Powertrain fault",
          };
        });

      await api.recordInspection(selectedVehicleId, {
        battery_voltage: Number(batteryVoltage),
        coolant_temp: Number(coolantTemp),
        engine_health: engineHealth,
        mechanic_name: mechanicName,
        obd_codes: parsedObd,
        notes: notes || "Diagnostic scan & physical inspection completed.",
      });

      setSuccess(true);
    } catch (err: any) {
      alert("Error submitting inspection: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
              Technician & OBD Scanner Diagnostic Terminal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Certified mechanic portal for logging physical vehicle health, OBD-II scanner trouble codes (DTCs), and mechanical observations.
          </p>
        </div>

        {/* Notice of Distinction */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <strong className="text-white block font-mono">Human Sign-off Separation:</strong>
            <p className="text-slate-400 leading-relaxed">
              Every data point entered here is archived under <strong className="text-white">Human Certified Inspection</strong>.
              It is explicitly isolated on generated CARX Reports from probabilistic AI photographic models.
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center space-y-4 shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white font-mono">
              Certified Inspection Successfully Recorded
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The diagnostic telemetry, OBD codes, and technician notes have been committed to the vehicle intelligence dossier.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <button
                onClick={() => setSuccess(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Log Another Inspection
              </button>
              <Link
                href={`/vehicles/${selectedVehicleId}`}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2"
              >
                <span>View Updated Vehicle Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            {/* 1. Target Vehicle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Subject Vehicle
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model} ({v.reg_no || "No Reg"} • {v.vin || "No VIN"})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Inspector Details & Live Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Inspector / Mechanic</label>
                <input
                  type="text"
                  required
                  value={mechanicName}
                  onChange={(e) => setMechanicName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Battery Voltage (V)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={batteryVoltage}
                  onChange={(e) => setBatteryVoltage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Coolant Temp (°C)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={coolantTemp}
                  onChange={(e) => setCoolantTemp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Engine Health Rating</label>
                <select
                  value={engineHealth}
                  onChange={(e) => setEngineHealth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  <option value="EXCELLENT">EXCELLENT</option>
                  <option value="GOOD">GOOD</option>
                  <option value="FAIR">FAIR</option>
                  <option value="POOR">POOR</option>
                </select>
              </div>
            </div>

            {/* 3. OBD Scan Codes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>OBD-II Diagnostic Trouble Codes (DTCs)</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Format: CODE : Description (One per line)
                </span>
              </label>
              <textarea
                rows={3}
                value={obdInput}
                onChange={(e) => setObdInput(e.target.value)}
                placeholder="e.g. P0300 : Random/Multiple Cylinder Misfire Detected&#10;P0420 : Catalyst System Efficiency Below Threshold"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* 4. Physical Observations */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Physical Mechanical Observations & Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes on underbody rust, steering tie rods, brake rotor lip, transmission clutch bite, fluid leaks..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{submitting ? "Committing Certified Record..." : "Submit Certified Inspection"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
