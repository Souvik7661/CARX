"use client";

import React, { useState } from "react";
import { Wrench, Cpu, AlertTriangle, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import { Inspection } from "@/lib/types";
import { api } from "@/lib/api";

interface InspectorSectionProps {
  vehicleId: string;
  inspections: Inspection[];
  onInspectionRecorded?: () => void;
}

export default function InspectorSection({
  vehicleId,
  inspections,
  onInspectionRecorded,
}: InspectorSectionProps) {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [mechanicName, setMechanicName] = useState("Rajesh Sharma (Certified Tech)");
  const [batteryVoltage, setBatteryVoltage] = useState("12.6");
  const [coolantTemp, setCoolantTemp] = useState("89.0");
  const [engineHealth, setEngineHealth] = useState("GOOD");
  const [obdInput, setObdInput] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeInspection = inspections[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parsedObd = obdInput
        .split("\n")
        .filter((l) => l.trim())
        .map((line) => {
          const parts = line.split(":");
          return {
            code: parts[0]?.trim() || "DTC",
            description: parts[1]?.trim() || "Engine management fault detected",
          };
        });

      await api.recordInspection(vehicleId, {
        battery_voltage: Number(batteryVoltage),
        coolant_temp: Number(coolantTemp),
        engine_health: engineHealth,
        mechanic_name: mechanicName,
        obd_codes: parsedObd,
        notes: notes || "Diagnostic scan & physical inspection completed.",
      });

      setShowEntryForm(false);
      if (onInspectionRecorded) onInspectionRecorded();
    } catch (err: any) {
      alert("Failed to submit inspection: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Diagnostic Telemetry & Physical Human Inspection
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Certified technician physical evaluation with live OBD-II scan parameters.
          </p>
        </div>

        <button
          onClick={() => setShowEntryForm(!showEntryForm)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all active:scale-95"
        >
          <UserCheck className="w-4 h-4" />
          <span>{showEntryForm ? "Close Inspector Portal" : "Log Technician Inspection"}</span>
        </button>
      </div>

      {/* Critical Banner: Distinction between Human Inspection & AI Analysis */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Methodology Integrity Notice</span>
          </div>
          <p className="text-xs text-slate-300">
            CARX strictly separates <strong className="text-white">AI Inference</strong> (photographic defect scoring & statistical depreciation) from <strong className="text-white">Human Physical Inspection</strong> (certified technician on-site torque, leak, and OBD-II scanner sign-off).
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-300 shrink-0">
          Status: {activeInspection ? "Human Verified ✓" : "Pending Inspection"}
        </div>
      </div>

      {/* Existing Inspection Review */}
      {activeInspection ? (
        <div className="space-y-4">
          {/* Key Readings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                ECU Engine Health
              </span>
              <span className="text-sm font-extrabold text-white block mt-0.5">
                {activeInspection.engine_health || "GOOD"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Battery Voltage
              </span>
              <span className="text-sm font-extrabold text-cyan-400 block mt-0.5">
                {activeInspection.battery_voltage ? `${activeInspection.battery_voltage.toFixed(1)}V` : "12.6V"}
              </span>
              <span className="text-[9px] text-slate-400">Normal range: 12.4V–14.4V</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Coolant Temp
              </span>
              <span className="text-sm font-extrabold text-white block mt-0.5">
                {activeInspection.coolant_temp ? `${activeInspection.coolant_temp.toFixed(1)}°C` : "89.0°C"}
              </span>
              <span className="text-[9px] text-slate-400">Operating: 85°C–98°C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Active DTC Faults
              </span>
              <span
                className={`text-sm font-extrabold block mt-0.5 ${
                  (activeInspection.obd_codes?.length || 0) > 0
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {activeInspection.obd_codes?.length || 0} Codes
              </span>
            </div>
          </div>

          {/* OBD Trouble Codes */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>OBD-II Diagnostic Scan Codes</span>
            </h4>

            {!activeInspection.obd_codes || activeInspection.obd_codes.length === 0 ? (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero DTC fault codes logged in vehicle Powertrain / Body / Chassis ECU.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {activeInspection.obd_codes.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-red-950/30 border border-red-800 text-xs flex items-start gap-3"
                  >
                    <span className="px-2 py-0.5 rounded bg-red-900 text-red-200 font-mono font-bold">
                      {c.code}
                    </span>
                    <span className="text-red-300 leading-relaxed font-medium">
                      {c.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mechanic Stamp & Notes */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Inspecting Mechanic:</span>
              <span className="text-white font-bold">{activeInspection.mechanic_name || "Certified Technician"}</span>
            </div>
            {activeInspection.notes && (
              <p className="text-slate-300 font-sans italic pt-1 border-t border-slate-800/60">
                &ldquo;{activeInspection.notes}&rdquo;
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
          No physical mechanic inspection recorded yet. Click &quot;Log Technician Inspection&quot; above to submit findings.
        </div>
      )}

      {/* Technician Data Entry Form */}
      {showEntryForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-4 animate-fadeIn"
        >
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Technician Inspection & OBD Input Form
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Mechanic Name / ID</label>
              <input
                type="text"
                value={mechanicName}
                onChange={(e) => setMechanicName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Battery Resting Voltage (V)</label>
              <input
                type="number"
                step="0.1"
                value={batteryVoltage}
                onChange={(e) => setBatteryVoltage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Coolant Operating Temp (°C)</label>
              <input
                type="number"
                step="1"
                value={coolantTemp}
                onChange={(e) => setCoolantTemp(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Engine Health Rating</label>
              <select
                value={engineHealth}
                onChange={(e) => setEngineHealth(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="EXCELLENT">EXCELLENT</option>
                <option value="GOOD">GOOD</option>
                <option value="FAIR">FAIR</option>
                <option value="POOR">POOR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-xs">
              OBD-II Trouble Codes (One per line, e.g. <code className="text-cyan-400">P0300 : Random Misfire</code>)
            </label>
            <textarea
              rows={3}
              value={obdInput}
              onChange={(e) => setObdInput(e.target.value)}
              placeholder="Leave empty if zero trouble codes detected."
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-xs">Mechanic Notes & Observations</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations on brakes, steering rack, clutch pedal bite point, etc."
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowEntryForm(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
            >
              {submitting ? "Signing & Storing..." : "Submit Certified Inspection"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
