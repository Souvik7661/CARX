"use client";

import React, { useState, useEffect } from "react";
import { Settings, Sliders, Activity, Database, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";
import { ScoringWeights } from "@/lib/types";
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const [health, setHealth] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [weights, setWeights] = useState<ScoringWeights>({
    documentation: 0.20,
    service_history: 0.15,
    mileage_consistency: 0.15,
    visual_condition: 0.15,
    mechanical_diagnostic: 0.15,
    market_price_risk: 0.10,
    ownership_usage_risk: 0.10,
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [savingWeights, setSavingWeights] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const loadAdminData = async () => {
    try {
      const [h, j, w, logs] = await Promise.all([
        api.getAdminHealth(),
        api.getAdminJobs(),
        api.getScoringWeights(),
        api.getAuditLogs(),
      ]);
      setHealth(h);
      setJobs(j);
      setWeights(w);
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleSliderChange = (key: keyof ScoringWeights, val: number) => {
    setWeights({ ...weights, [key]: val });
  };

  const handleSaveWeights = async () => {
    setSavingWeights(true);
    setSavedMsg(false);
    try {
      await api.updateScoringWeights(weights);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err: any) {
      alert("Failed to update weights: " + err.message);
    } finally {
      setSavingWeights(false);
    }
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
                System Administration & Model Configuration
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Live observability, background asynchronous job queues, and dynamic trust scoring weight calibration.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-2 border border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh State</span>
          </button>
        </div>

        {/* Health Telemetry Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">API & Database Status</span>
            <div className="flex items-center gap-2 text-emerald-400 text-lg font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{health?.database === "connected" ? "Operational" : "Degraded"}</span>
            </div>
            <span className="text-[10px] text-slate-500 block">FastAPI Protocol Online</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Vehicles in Registry</span>
            <div className="text-2xl font-black text-white">{health?.total_vehicles ?? 0}</div>
            <span className="text-[10px] text-slate-500 block">Active monitored units</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total AI Jobs Processed</span>
            <div className="text-2xl font-black text-cyan-400">{health?.total_jobs ?? 0}</div>
            <span className="text-[10px] text-slate-500 block">OCR & Vision workloads</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Active Background Jobs</span>
            <div className="text-2xl font-black text-amber-400">{health?.active_jobs ?? 0}</div>
            <span className="text-[10px] text-slate-500 block">Queued or Processing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Dynamic Scoring Weights Sliders */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Configurable Trust Scoring Weights</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust category mathematical contribution in real-time. Target aggregate = 1.00 (100%).
                </p>
              </div>

              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  Math.abs(totalWeight - 1.0) < 0.01
                    ? "text-emerald-400 bg-emerald-950 border border-emerald-800"
                    : "text-amber-400 bg-amber-950 border border-amber-800"
                }`}
              >
                Sum: {totalWeight.toFixed(2)}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {[
                { key: "documentation", label: "Documentation Category" },
                { key: "service_history", label: "Service History Category" },
                { key: "mileage_consistency", label: "Mileage Consistency Category" },
                { key: "visual_condition", label: "Visual Condition Category" },
                { key: "mechanical_diagnostic", label: "Mechanical / OBD Diagnostic" },
                { key: "market_price_risk", label: "Market Price Risk Category" },
                { key: "ownership_usage_risk", label: "Ownership & Usage Profile" },
              ].map(({ key, label }) => {
                const wKey = key as keyof ScoringWeights;
                const val = weights[wKey];
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{label}</span>
                      <span className="font-bold text-cyan-400">
                        {(val * 100).toFixed(0)}% ({val.toFixed(2)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.40"
                      step="0.01"
                      value={val}
                      onChange={(e) => handleSliderChange(wKey, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {savedMsg && (
                <span className="text-xs text-emerald-400 font-mono">
                  ✓ Weights committed to live database!
                </span>
              )}
              <div className="flex justify-end gap-3 ml-auto">
                <button
                  onClick={handleSaveWeights}
                  disabled={savingWeights}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {savingWeights ? "Updating Models..." : "Save Configured Weights"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Asynchronous AI Processing Jobs Queue */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>AI Processing Jobs Queue</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {jobs.length} tracked
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {jobs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  No processing jobs recorded in queue.
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{job.job_type}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          job.status === "COMPLETED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : job.status === "PROCESSING"
                            ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                            : "bg-red-950 text-red-400 border border-red-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 truncate">
                      Vehicle: {job.vehicle_id}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-850">
                      <span>Progress: {job.progress}%</span>
                      <span>{new Date(job.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Immutable Platform Audit Logs</span>
          </h3>

          <div className="overflow-x-auto max-h-[300px] scrollbar-thin">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Entity Type</th>
                  <th className="p-2.5">Entity ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/40 text-slate-300">
                    <td className="p-2.5 text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-2.5 font-bold text-cyan-400">{log.action}</td>
                    <td className="p-2.5">{log.entity_type}</td>
                    <td className="p-2.5 text-slate-400">{log.entity_id || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
