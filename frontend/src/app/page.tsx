"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingDown,
  Gauge,
  FileCheck,
  AlertTriangle,
  Eye,
  CheckCircle2,
  DollarSign,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-850">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Vehicle Intelligence & Decision Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
              Know the car <span className="text-cyan-400">before</span> you buy it.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
              CARX uses vehicle telemetry, document OCR, computer vision, and actuarial analysis to help you understand the true condition, fair value, and ownership risk of a pre-owned vehicle.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/analyze"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Analyze a Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/demo"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm tracking-wide border border-slate-800 transition-all hover:border-slate-700 flex items-center justify-center gap-2"
              >
                <span>Explore 3 Live Demo Reports</span>
              </Link>
            </div>
          </div>

          {/* Hero Realistic Vehicle Intelligence Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80"
                    alt="2021 Hyundai Creta"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white font-mono">
                      2021 Hyundai Creta 1.5 SX
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-800/60">
                      LIVE PREVIEW
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    48,230 km • Petrol • Manual • Pune, Maharashtra
                  </p>
                </div>
              </div>

              {/* Score & Verdict Pill */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    CARX Trust Score
                  </span>
                  <span className="text-3xl font-black font-mono text-emerald-400">
                    86 <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-400 text-sm font-black font-mono tracking-wider">
                  🟢 BUY
                </div>
              </div>
            </div>

            {/* Metric Snippets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Fair Value</span>
                <span className="text-sm font-black font-mono text-cyan-400 mt-1 block">
                  ₹9.10L – ₹9.60L
                </span>
                <span className="text-[10px] text-emerald-400">Asking: ₹9.25L (Aligned)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Mileage Consistency</span>
                <span className="text-sm font-black font-mono text-emerald-400 mt-1 block">
                  Consistent ✓
                </span>
                <span className="text-[10px] text-slate-400">0 Rollback Probability</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Service Verification</span>
                <span className="text-sm font-black font-mono text-cyan-400 mt-1 block">
                  96% Confidence
                </span>
                <span className="text-[10px] text-slate-400">5 Verified Invoices</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Visual Inspection</span>
                <span className="text-sm font-black font-mono text-slate-200 mt-1 block">
                  Clean Panels
                </span>
                <span className="text-[10px] text-amber-400">Tyres wear in 8,000 km</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM WE SOLVE */}
      <section className="py-20 bg-slate-950 border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              The Asymmetry Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono">
              Why buying a pre-owned car is high risk.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The seller knows everything about the vehicle. The buyer knows only what they are told.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">
                Hidden Accident & Structural Damage
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Superficial paint polishing frequently masks structural apron re-welding, deployed airbags, and concealed subframe deformation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">
                Odometer Rollback Tampering
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                An estimated 30% of pre-owned vehicles have falsified odometers to inflate market values and hide severe powertrain wear.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">
                Arbitrary & Inflated Asking Prices
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dealers routinely list vehicles at 15–25% premiums over actual fair market value, leaving buyers without transparent counter-offer benchmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW CARX WORKS */}
      <section className="py-20 bg-slate-900/50 border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Autonomous Verification Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono">
              How CARX Works in 5 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                num: "01",
                title: "Identify",
                desc: "Enter basic vehicle specifications: registration number, VIN, make, model, and asking price.",
              },
              {
                num: "02",
                title: "Upload",
                desc: "Upload service invoices, RC, insurance policy, and multi-angle perspective photos.",
              },
              {
                num: "03",
                title: "Extract & Vision",
                desc: "OCR extracts telemetry with confidence ratings while computer vision checks panels for defects.",
              },
              {
                num: "04",
                title: "Synthesize",
                desc: "Scoring engine computes the 0–100 Trust Score and checks for chronological odometer anomalies.",
              },
              {
                num: "05",
                title: "Decide",
                desc: "Receive clear BUY / NEGOTIATE / AVOID verdict with negotiation targets and downloadable report.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative group hover:border-cyan-500/50 transition-colors"
              >
                <span className="text-2xl font-black font-mono text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-white font-mono">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE 3 VERDICTS: BUY, NEGOTIATE, AVOID */}
      <section className="py-20 bg-slate-950 border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Unambiguous Decision Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-mono">
              Actionable Verdicts, Zero Jargon
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 font-mono font-black text-lg border border-emerald-800">
                  🟢 BUY
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">Trust: 80–100</span>
              </div>
              <h3 className="text-base font-bold text-white">Low Risk & Fair Market Value</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Price is reasonably aligned with fair value bands. Clean service timeline with verified odometer records and no major frame deformation detected.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-emerald-900/40">
                Example: 2021 Hyundai Creta (Score: 86)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-amber-950 text-amber-400 font-mono font-black text-lg border border-amber-800">
                  🟡 NEGOTIATE
                </span>
                <span className="text-xs text-amber-400 font-mono font-semibold">Trust: 60–79</span>
              </div>
              <h3 className="text-base font-bold text-white">Acceptable Car, Inflated Price</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vehicle condition is acceptable, but asking price exceeds fair market range or manageable repairs (such as tyre wear or brake pads) require a discount.
              </p>
              <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-amber-900/40">
                Example: 2019 Jeep Compass (Score: 69)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-red-950 text-red-400 font-mono font-black text-lg border border-red-800">
                  🔴 AVOID
                </span>
                <span className="text-xs text-red-400 font-mono font-semibold">Trust: 0–59</span>
              </div>
              <h3 className="text-base font-bold text-white">Critical Risk & Tampering</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Major risk indicators identified: odometer rollback detected, non-OEM structural apron welding, active engine fault codes, or extreme price disconnect.
              </p>
              <div className="text-[11px] font-mono text-red-400 pt-2 border-t border-red-900/40">
                Example: 2018 BMW 320d (Score: 44)
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold text-xs border border-slate-800 hover:border-slate-700 transition-all"
            >
              <span>Test Drive All 3 Archetypes in Live Demo Mode</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
            Ready to evaluate a vehicle?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Create an analysis workspace in under 60 seconds. Upload photos and service records at your own pace to enrich the intelligence dossier.
          </p>
          <div className="pt-4">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <span>Analyze a Vehicle Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
