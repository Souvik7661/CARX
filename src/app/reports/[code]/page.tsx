"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  History,
  Gauge,
  DollarSign,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/utils";

export default function PublicReportPage() {
  const params = useParams();
  const reportCode = params.code as string;

  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reportCode) {
      api.getReportByCode(reportCode)
        .then(setReport)
        .catch((err) => setError(err.message || "Failed to load report."))
        .finally(() => setLoading(false));
    }
  }, [reportCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center text-xs font-mono text-cyan-400">
          Verifying cryptographic report stamp...
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Report Code Not Found or Expired</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <Link href="/" className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const s = report.summary || {};
  const v = s.vehicle || {};
  const t = s.trust_score || {};
  const val = s.valuation || {};
  const own = s.ownership_5yr || {};
  const ev = s.evidence_counts || {};

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to CARX Portal</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 border border-slate-800 shadow"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Print / Save PDF Dossier</span>
          </button>
        </div>

        {/* Printable White Paper Dossier Container */}
        <div className="p-8 sm:p-12 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-300 space-y-8 font-sans print:p-0 print:border-0 print:shadow-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black font-mono tracking-tighter text-slate-950">
                  CAR<span className="text-cyan-600">X</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold uppercase border border-slate-300">
                  Official Vehicle Intelligence Dossier
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Verified Multi-Modal Inspection & Decision-Support Audit
              </p>
            </div>

            <div className="text-right font-mono text-xs space-y-0.5">
              <div className="font-extrabold text-slate-900 text-sm">
                CODE: {report.report_code}
              </div>
              <div className="text-slate-600">
                Generated: {new Date(report.generated_at).toLocaleDateString("en-IN")}
              </div>
              <div className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Digitally Authenticated ✓</span>
              </div>
            </div>
          </div>

          {/* Section 1: Subject Vehicle Summary */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                1. Subject Vehicle Specification
              </span>
              <h2 className="text-2xl font-black font-mono text-slate-950">
                {v.title}
              </h2>
              <p className="text-xs text-slate-600">
                VIN: <strong className="font-mono text-slate-900">{v.vin}</strong> • Reg No: <strong className="font-mono text-slate-900">{v.reg_no}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Odometer: <strong className="font-mono text-slate-900">{Number(v.mileage || 0).toLocaleString()} km</strong> • Fuel: {v.fuel_type} • Transmission: {v.transmission}
              </p>
              <p className="text-xs text-slate-600">
                Declared Asking Price: <strong className="font-mono text-slate-900">{formatINR(v.asking_price)}</strong> • Region: {v.location}
              </p>
            </div>

            <div className="text-center sm:border-l sm:border-slate-200 sm:pl-6 flex flex-col items-center justify-center">
              <span className="text-xs uppercase font-bold text-slate-500 font-mono">
                Vehicle Trust Score
              </span>
              <div className="text-5xl font-black font-mono text-slate-950 mt-1">
                {t.score || 75}
                <span className="text-sm font-normal text-slate-500">/100</span>
              </div>
              <div className="mt-2 text-xs font-bold font-mono px-3 py-1 rounded bg-slate-900 text-white">
                VERDICT: {val.recommendation || "NEGOTIATE"}
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                Data Confidence: {t.confidence || 75}%
              </span>
            </div>
          </div>

          {/* Section 2: Positives & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <h3 className="font-bold text-emerald-900 uppercase font-mono tracking-wider">
                Verified Positive Factors
              </h3>
              <ul className="space-y-1.5 text-emerald-900">
                {t.positive_factors?.map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 uppercase font-mono tracking-wider">
                Adverse Findings & Risks
              </h3>
              <ul className="space-y-1.5 text-amber-900">
                {t.risk_factors?.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Fair Value & Negotiation Strategy */}
          <div className="p-6 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold uppercase font-mono text-slate-900 tracking-wider">
              Fair Market Valuation & Strategic Negotiation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono pt-1">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Asking Price</span>
                <span className="text-base font-black text-slate-900">{formatINR(val.asking_price)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Estimated Fair Value Band</span>
                <span className="text-base font-black text-cyan-700">
                  {formatINR(val.fair_min, true)} – {formatINR(val.fair_max, true)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Recommended Purchase Target</span>
                <span className="text-base font-black text-emerald-700">{formatINR(val.fair_min)}</span>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed font-sans pt-1">
              <strong>Advisory: </strong>{val.notes}
            </p>
          </div>

          {/* Section 4: 5-Year Ownership Projection */}
          <div className="p-6 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold uppercase font-mono text-slate-900 tracking-wider">
              5-Year Projected Total Cost of Ownership (TCO)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono pt-1">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Fuel Burn</span>
                <span className="font-bold text-slate-900">{formatINR(own.fuel_cost, true)}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Insurance</span>
                <span className="font-bold text-slate-900">{formatINR(own.insurance_cost, true)}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Maintenance</span>
                <span className="font-bold text-slate-900">{formatINR(own.maintenance_cost, true)}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Depreciation</span>
                <span className="font-bold text-slate-900">{formatINR(own.depreciation_cost, true)}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 text-white font-mono col-span-2 sm:col-span-1 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">5-Yr Total</span>
                <span className="font-bold text-cyan-400 text-sm">{formatINR(own.total_cost, true)}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Evidence & Provenance Audit */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">Verified Docs</span>
              <span className="font-bold text-slate-900">{ev.verified_documents ?? 0} Files</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Service Logs</span>
              <span className="font-bold text-slate-900">{ev.service_records ?? 0} Records</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Visual Inspections</span>
              <span className="font-bold text-slate-900">{ev.visual_inspections ?? 0} Findings</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Inspector Certified</span>
              <span className="font-bold text-emerald-700">
                {ev.inspector_verified ? "Yes (Verified ✓)" : "AI Inference Only"}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-[10px] text-slate-500 leading-relaxed pt-6 border-t border-slate-300 space-y-1 font-sans">
            <p className="font-bold text-slate-700">CARX Verification Disclaimer:</p>
            <p>{s.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
