"use client";

import React from "react";
import { History, AlertTriangle, CheckCircle2, ShieldCheck, Wrench } from "lucide-react";
import { ServiceRecord } from "@/lib/types";
import { formatINR } from "@/lib/utils";

interface ServiceTimelineProps {
  records: ServiceRecord[];
  confidenceScore?: number;
  confidenceReason?: string;
  anomalies?: string[];
}

export default function ServiceTimeline({
  records,
  confidenceScore = 80,
  confidenceReason,
  anomalies = [],
}: ServiceTimelineProps) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Top Banner: Service Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Chronological Service Timeline
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Audit trail of recorded maintenance visits, parts replaced, and anomalous interval gaps.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Service Confidence
          </span>
          <span className="text-lg font-black font-mono text-cyan-400">
            {confidenceScore}%
          </span>
        </div>
      </div>

      {confidenceReason && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
          <strong className="text-cyan-400">Confidence Analysis: </strong>
          {confidenceReason}
        </div>
      )}

      {/* Anomalies Alert Box */}
      {anomalies.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Timeline Flags & Irregularities ({anomalies.length})</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {anomalies.map((anom, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{anom}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Timeline */}
      {records.length === 0 ? (
        <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
          No service records logged. Historical maintenance pattern cannot be confirmed.
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {records.map((rec, idx) => {
            const isFlagged = rec.is_flagged;
            return (
              <div key={rec.id || idx} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isFlagged
                      ? "bg-amber-500/20 border-amber-400 text-amber-400"
                      : "bg-slate-900 border-cyan-400 text-cyan-400"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isFlagged ? "bg-amber-400" : "bg-cyan-400"
                    }`}
                  />
                </div>

                {/* Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        {rec.date}
                      </span>
                      <span className="text-xs font-extrabold font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                        {Number(rec.odometer).toLocaleString()} km
                      </span>
                    </div>

                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {rec.total_cost > 0 ? formatINR(rec.total_cost) : "Complimentary Service"}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200">
                    {rec.service_type}
                  </h4>

                  {rec.workshop && (
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-slate-400" />
                      <span>{rec.workshop}</span>
                    </p>
                  )}

                  {isFlagged && rec.flag_reason && (
                    <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px] font-mono">
                      Alert: {rec.flag_reason}
                    </div>
                  )}

                  {rec.notes && (
                    <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2 rounded">
                      &ldquo;{rec.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
