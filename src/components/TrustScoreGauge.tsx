"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  FileCheck,
  History,
  Activity,
  Eye,
  DollarSign,
  Gauge,
  Sliders
} from "lucide-react";
import { RiskScore } from "@/lib/types";
import { getScoreColor } from "@/lib/utils";

interface TrustScoreGaugeProps {
  score?: RiskScore | null;
}

export default function TrustScoreGauge({ score }: TrustScoreGaugeProps) {
  const [showFormula, setShowFormula] = useState(false);

  if (!score) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
        <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Trust Score Uncalculated</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Upload vehicle documents, service records, or photos to execute the CARX scoring algorithm.
        </p>
      </div>
    );
  }

  const colors = getScoreColor(score.overall_score);
  const circumference = 2 * Math.PI * 54; // radius 54
  const strokeDashoffset = circumference - (score.overall_score / 100) * circumference;

  const categories = [
    {
      key: "documentation",
      label: "Documentation",
      weight: score.weights_used?.documentation ?? 0.20,
      score: score.documentation_score,
      icon: FileCheck,
      description: "RC, insurance, warranty papers, and authentic service invoices.",
    },
    {
      key: "service_history",
      label: "Service History",
      weight: score.weights_used?.service_history ?? 0.15,
      score: score.service_history_score,
      icon: History,
      description: "Interval regularity, authorized facility checks, and gap anomalies.",
    },
    {
      key: "mileage_consistency",
      label: "Mileage Consistency",
      weight: score.weights_used?.mileage_consistency ?? 0.15,
      score: score.mileage_score,
      icon: Gauge,
      description: "Chronological odometer progression and rollback analysis.",
    },
    {
      key: "visual_condition",
      label: "Visual Condition",
      weight: score.weights_used?.visual_condition ?? 0.15,
      score: score.visual_score,
      icon: Eye,
      description: "Computer vision multi-angle paint, dent, and tyre wear detection.",
    },
    {
      key: "mechanical_diagnostic",
      label: "Mechanical / OBD",
      weight: score.weights_used?.mechanical_diagnostic ?? 0.15,
      score: score.mechanical_score,
      icon: Activity,
      description: "ECU diagnostic trouble codes, battery voltage, and mechanic checks.",
    },
    {
      key: "market_price_risk",
      label: "Market Price Risk",
      weight: score.weights_used?.market_price_risk ?? 0.10,
      score: score.market_score,
      icon: DollarSign,
      description: "Asking price comparison against statistical fair-value range.",
    },
    {
      key: "ownership_usage_risk",
      label: "Ownership & Usage",
      weight: score.weights_used?.ownership_usage_risk ?? 0.10,
      score: score.ownership_score,
      icon: TrendingUp,
      description: "Annual usage pace, owner count, and usage profile.",
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-black text-white font-mono tracking-tight">
              CARX Vehicle Trust Score
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              0–100 Scale
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Explainable mathematical derivation across 7 verified telemetry categories.
          </p>
        </div>

        {/* Data Confidence Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Data Confidence
            </span>
            <span className="text-sm font-bold font-mono text-cyan-400">
              {score.confidence_score}%
            </span>
          </div>
          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${score.confidence_score}%` }}
            />
          </div>
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Toggle Scoring Methodology Formula"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Gauge & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 items-center">
        {/* Left: Circular Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`${colors.text} transition-all duration-1000 ease-out`}
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-5xl font-black font-mono tracking-tighter ${colors.text}`}>
                {score.overall_score}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mt-1">
                out of 100
              </span>
              <span
                className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {score.overall_score >= 80 ? "High Trust" : score.overall_score >= 60 ? "Moderate Trust" : "High Risk"}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3 max-w-[220px]">
            {score.overall_score >= 80
              ? "Vehicle demonstrates high documentation completeness and mechanical consistency."
              : score.overall_score >= 60
              ? "Vehicle shows moderate trust with specific negotiation points or pending maintenance."
              : "Multiple critical risk factors detected. Pre-purchase inspection highly advised."}
          </p>
        </div>

        {/* Right: 7-Category Breakdown */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Category Weights & Scores</span>
            <span className="font-mono">Contribution</span>
          </div>

          {categories.map((cat) => {
            const Icon = cat.icon;
            const hasData = cat.score !== null && cat.score !== undefined;
            const catScore: number = hasData ? Number(cat.score) : 0;
            const effectiveScore = hasData ? Math.round(catScore * cat.weight) : 0;

            return (
              <div
                key={cat.key}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({Math.round(cat.weight * 100)}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    {hasData ? (
                      <>
                        <span className="text-slate-400">
                          {Math.round(catScore)} / 100
                        </span>
                        <span className="text-emerald-400 font-bold">
                          +{effectiveScore} pts
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">
                        Normalized (No Data)
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  {hasData ? (
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        catScore >= 80
                          ? "bg-emerald-400"
                          : catScore >= 60
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${catScore}%` }}
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-800/50 dashed" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Explanation Collapsible */}
      {showFormula && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-900/40 text-xs text-slate-300 font-mono space-y-2 animate-fadeIn">
          <p className="text-cyan-400 font-bold">
            Transparent Actuarial Normalization Formula:
          </p>
          <p className="text-slate-400 text-[11px]">
            Final Score = Σ (Available Category Score × Weight) ÷ Σ (Available Weights).
            When evidence for a category is not provided, the score is not penalized arbitrarily to zero;
            instead, the weights are dynamically normalized to maintain a fair 0–100 scale, while the
            Data Confidence index is proportionally adjusted.
          </p>
        </div>
      )}

      {/* Explanatory Factors: Positives vs Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
        {/* Positive Factors */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Positive Factors ({score.positive_factors?.length || 0})</span>
          </div>
          {score.positive_factors && score.positive_factors.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {score.positive_factors.map((pos, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{pos}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No significant positive markers verified yet.</p>
          )}
        </div>

        {/* Risk Factors */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Risk Factors & Cautions ({score.risk_factors?.length || 0})</span>
          </div>
          {score.risk_factors && score.risk_factors.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {score.risk_factors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No major adverse risk factors detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
