"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Camera,
  History,
  Gauge,
  DollarSign,
  TrendingUp,
  Wrench,
  Cpu,
  Download,
  Share2,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

import { Vehicle, MileageAnalysis, RepairPrediction, OwnershipCost } from "@/lib/types";
import { api } from "@/lib/api";
import { formatINR, formatKm, getScoreColor, getVerdictConfig } from "@/lib/utils";

// Components
import TrustScoreGauge from "@/components/TrustScoreGauge";
import DecisionCard from "@/components/DecisionCard";
import DamageViewer from "@/components/DamageViewer";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import ServiceTimeline from "@/components/ServiceTimeline";
import MileageChart from "@/components/MileageChart";
import ValuationCard from "@/components/ValuationCard";
import OwnershipCalculator from "@/components/OwnershipCalculator";
import RepairsList from "@/components/RepairsList";
import InspectorSection from "@/components/InspectorSection";

export default function VehicleWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [mileageAnalysis, setMileageAnalysis] = useState<MileageAnalysis | null>(null);
  const [serviceAnalysis, setServiceAnalysis] = useState<any | null>(null);
  const [repairs, setRepairs] = useState<RepairPrediction | null>(null);
  const [ownership, setOwnership] = useState<OwnershipCost | null>(null);

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const v = await api.getVehicle(vehicleId);
      setVehicle(v);

      // Load subsidiary telemetry in parallel
      const [mileageData, serviceData, repairsData, ownData] = await Promise.allSettled([
        api.getMileageAnalysis(vehicleId),
        api.getServiceHistoryAnalysis(vehicleId),
        api.getRepairPredictions(vehicleId),
        api.getOwnershipCost(vehicleId, 5),
      ]);

      if (mileageData.status === "fulfilled") setMileageAnalysis(mileageData.value);
      if (serviceData.status === "fulfilled") setServiceAnalysis(serviceData.value);
      if (repairsData.status === "fulfilled") setRepairs(repairsData.value);
      if (ownData.status === "fulfilled") setOwnership(ownData.value);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicle telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      loadData();
    }
  }, [vehicleId]);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      await api.triggerAnalysis(vehicleId);
      await loadData();
    } catch (err: any) {
      alert("Analysis failed: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const rep = await api.generateReport(vehicleId);
      setReportSuccess(rep.report_code);
      setActiveTab("report");
    } catch (err: any) {
      alert("Failed to generate report: " + err.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-cyan-400">
            Synthesizing Vehicle Telemetry & Trust Models...
          </p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Vehicle Not Found</h2>
          <p className="text-xs text-slate-400">{error || "Unable to locate vehicle record."}</p>
          <Link
            href="/analyze"
            className="inline-block px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold"
          >
            Create New Vehicle
          </Link>
        </div>
      </div>
    );
  }

  const score = vehicle.risk_score?.overall_score ?? 75;
  const confidence = vehicle.risk_score?.confidence_score ?? 50;
  const colors = getScoreColor(score);
  const verdict = vehicle.valuation?.recommendation || "NEGOTIATE";
  const verdictConfig = getVerdictConfig(verdict);

  const tabs = [
    { id: "overview", label: "Executive Overview", icon: Sparkles },
    { id: "score", label: "Trust Score (0–100)", icon: Gauge },
    { id: "documents", label: "Documents & OCR", icon: FileText, count: vehicle.documents?.length },
    { id: "inspection", label: "Computer Vision", icon: Camera, count: vehicle.damage_findings?.length },
    { id: "services", label: "Service History", icon: History, count: vehicle.service_records?.length },
    { id: "mileage", label: "Mileage Audit", icon: Gauge },
    { id: "valuation", label: "Fair Valuation", icon: DollarSign },
    { id: "ownership", label: "5-Yr Ownership TCO", icon: TrendingUp },
    { id: "repairs", label: "Upcoming Repairs", icon: Wrench, count: repairs?.predictions?.length },
    { id: "obd", label: "Inspector & OBD", icon: Cpu },
    { id: "report", label: "Intelligence Report", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* 1. TOP TELEMETRY BANNER */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Vehicle Title & Specs */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vehicle.image_url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80"}
                  alt={vehicle.model}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  {vehicle.variant && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {vehicle.variant}
                    </span>
                  )}
                  {vehicle.is_demo && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 font-mono border border-cyan-800/60">
                      DEMO ARCHETYPE
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                  <span>{formatKm(vehicle.mileage)}</span>
                  <span>•</span>
                  <span>{vehicle.fuel_type}</span>
                  <span>•</span>
                  <span>{vehicle.transmission}</span>
                  <span>•</span>
                  <span className="text-white font-bold">{formatINR(vehicle.asking_price)}</span>
                  {vehicle.reg_no && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-400">{vehicle.reg_no}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Big Trust Score & Verdict Pill */}
            <div className="flex items-center gap-4 self-end lg:self-center">
              {/* Trust Score Gauge Minimal */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Trust Score
                </span>
                <span className={`text-3xl font-black font-mono tracking-tight ${colors.text}`}>
                  {score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </span>
              </div>

              {/* Verdict Badge */}
              <div className={`px-4 py-2 rounded-xl text-sm font-black font-mono tracking-wider border ${verdictConfig.badgeClass}`}>
                {verdictConfig.icon} {verdictConfig.label}
              </div>

              {/* Actions */}
              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all active:scale-95"
                title="Re-run Holistic Synthesis"
              >
                <RefreshCw className={`w-4 h-4 ${analyzing ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{generatingReport ? "Synthesizing..." : "Dossier Report"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="border-b border-slate-800 bg-slate-950/90 sticky top-36 z-30 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? "border-cyan-400 text-cyan-400 bg-slate-900/50"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Primary Decision Banner */}
            <DecisionCard
              valuation={vehicle.valuation}
              riskScore={vehicle.risk_score}
              onExploreReport={() => setActiveTab("report")}
            />

            {/* Quick Two-Column: Trust Score Gauge & Fair Value Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <TrustScoreGauge score={vehicle.risk_score} />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <ValuationCard
                  vehicleId={vehicle.id}
                  valuation={vehicle.valuation}
                  onUpdated={(v) => setVehicle({ ...vehicle, valuation: v })}
                />
              </div>
            </div>

            {/* Quick Diagnostic Telemetry & Odometer Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MileageChart
                analysis={mileageAnalysis}
                currentDeclared={vehicle.mileage}
              />
              <ServiceTimeline
                records={vehicle.service_records || []}
                confidenceScore={serviceAnalysis?.confidence_score}
                confidenceReason={serviceAnalysis?.confidence_reason}
                anomalies={serviceAnalysis?.anomalies}
              />
            </div>
          </div>
        )}

        {/* TAB: TRUST SCORE */}
        {activeTab === "score" && (
          <div className="space-y-6">
            <TrustScoreGauge score={vehicle.risk_score} />
          </div>
        )}

        {/* TAB: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <DocumentUploadModal
              vehicleId={vehicle.id}
              documents={vehicle.documents || []}
              onSuccess={loadData}
            />
          </div>
        )}

        {/* TAB: INSPECTION & COMPUTER VISION */}
        {activeTab === "inspection" && (
          <div className="space-y-6">
            <DamageViewer
              vehicleId={vehicle.id}
              images={vehicle.images || []}
              damages={vehicle.damage_findings || []}
              onUploadSuccess={loadData}
            />
          </div>
        )}

        {/* TAB: SERVICE HISTORY */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <ServiceTimeline
              records={vehicle.service_records || []}
              confidenceScore={serviceAnalysis?.confidence_score}
              confidenceReason={serviceAnalysis?.confidence_reason}
              anomalies={serviceAnalysis?.anomalies}
            />
          </div>
        )}

        {/* TAB: MILEAGE AUDIT */}
        {activeTab === "mileage" && (
          <div className="space-y-6">
            <MileageChart
              analysis={mileageAnalysis}
              currentDeclared={vehicle.mileage}
            />
          </div>
        )}

        {/* TAB: VALUATION */}
        {activeTab === "valuation" && (
          <div className="space-y-6">
            <ValuationCard
              vehicleId={vehicle.id}
              valuation={vehicle.valuation}
              onUpdated={(v) => setVehicle({ ...vehicle, valuation: v })}
            />
          </div>
        )}

        {/* TAB: OWNERSHIP TCO */}
        {activeTab === "ownership" && (
          <div className="space-y-6">
            <OwnershipCalculator
              vehicleId={vehicle.id}
              initialTco={ownership}
              fuelType={vehicle.fuel_type}
            />
          </div>
        )}

        {/* TAB: REPAIRS */}
        {activeTab === "repairs" && (
          <div className="space-y-6">
            <RepairsList repairs={repairs} />
          </div>
        )}

        {/* TAB: OBD & INSPECTOR */}
        {activeTab === "obd" && (
          <div className="space-y-6">
            <InspectorSection
              vehicleId={vehicle.id}
              inspections={vehicle.inspections || []}
              onInspectionRecorded={loadData}
            />
          </div>
        )}

        {/* TAB: REPORT */}
        {activeTab === "report" && (
          <div className="space-y-6">
            {/* Printable Report View */}
            <div className="p-8 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-8 font-sans print:p-0 print:shadow-none print:border-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono tracking-tighter text-slate-950">
                      CAR<span className="text-cyan-600">X</span>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold uppercase border">
                      Intelligence Report
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Certified Algorithmic Dossier & Decision Support Analysis
                  </p>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-slate-900">
                    REPORT CODE: {reportSuccess || `CARX-2026-${vehicle.id.slice(0, 6).toUpperCase()}`}
                  </div>
                  <div className="text-slate-500">
                    DATE: {new Date().toLocaleDateString("en-IN")}
                  </div>
                  <div className="text-emerald-600 font-bold">DIGITALLY VERIFIED ✓</div>
                </div>
              </div>

              {/* Vehicle Title & Score Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-xs font-mono uppercase font-bold text-slate-500">
                    Identified Subject Vehicle
                  </span>
                  <h2 className="text-2xl font-black font-mono text-slate-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Trim: {vehicle.variant || "Standard"} • VIN: {vehicle.vin || "UNVERIFIED"} • Reg: {vehicle.reg_no || "UNREGISTERED"}
                  </p>
                  <p className="text-xs text-slate-600">
                    Odometer: {formatKm(vehicle.mileage)} • Location: {vehicle.location || "India"}
                  </p>
                </div>

                <div className="text-center sm:border-l sm:border-slate-200 sm:pl-6 flex flex-col justify-center items-center">
                  <span className="text-xs uppercase font-bold text-slate-500">Trust Score</span>
                  <div className="text-4xl font-black font-mono text-slate-900 mt-1">
                    {score} <span className="text-sm font-normal text-slate-500">/ 100</span>
                  </div>
                  <div className="mt-1 text-xs font-bold font-mono px-3 py-1 rounded bg-slate-900 text-white">
                    VERDICT: {verdict}
                  </div>
                </div>
              </div>

              {/* Positives & Risks Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <h4 className="font-bold text-emerald-900 uppercase">Verified Positive Factors</h4>
                  <ul className="space-y-1 text-emerald-800">
                    {vehicle.risk_score?.positive_factors?.map((p, i) => (
                      <li key={i}>✓ {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <h4 className="font-bold text-amber-900 uppercase">Risk Factors & Findings</h4>
                  <ul className="space-y-1 text-amber-800">
                    {vehicle.risk_score?.risk_factors?.map((r, i) => (
                      <li key={i}>! {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Financial & Valuation Summary */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase font-mono">
                  Fair Market Value & Price Target
                </h4>
                <div className="grid grid-cols-3 gap-4 font-mono pt-2">
                  <div>
                    <span className="text-slate-500 block">Asking Price</span>
                    <span className="font-bold text-sm text-slate-900">{formatINR(vehicle.asking_price)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fair Value Range</span>
                    <span className="font-bold text-sm text-cyan-700">
                      {vehicle.valuation ? `${formatINR(vehicle.valuation.estimated_fair_min, true)} – ${formatINR(vehicle.valuation.estimated_fair_max, true)}` : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Negotiation Target</span>
                    <span className="font-bold text-sm text-emerald-700">
                      {vehicle.valuation ? formatINR(vehicle.valuation.estimated_fair_min) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-[10px] text-slate-500 leading-relaxed pt-6 border-t border-slate-200 space-y-1">
                <p className="font-bold text-slate-700">Regulatory Disclaimer:</p>
                <p>
                  This CARX Vehicle Intelligence Report is synthesized from user-submitted documentation, high-resolution
                  computer vision photography, and statistical actuarial depreciation models. CARX does not warrant, certify,
                  or guarantee structural crashworthiness or internal mechanical components. An on-site certified mechanic
                  physical inspection is strongly recommended prior to funds transfer.
                </p>
              </div>

              {/* Print CTA */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-800 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Save PDF Dossier</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
