import React from "react";
import Link from "next/link";
import { ShieldCheck, Info, Cpu, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-black text-sm">
                CX
              </div>
              <span className="font-extrabold text-lg text-white font-mono">
                CAR<span className="text-cyan-400">X</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              The independent intelligence and trust layer for used vehicle acquisitions.
              Synthesizing document OCR, computer vision, diagnostic telemetry, and actuarial depreciation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Fabrication Policy</span>
            </div>
          </div>

          {/* Column 2: Platform Workspaces */}
          <div>
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] mb-4">
              Intelligence Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/analyze" className="hover:text-cyan-400 transition-colors">
                  Vehicle Intake & Workspace
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-cyan-400 transition-colors">
                  Explore 3 Live Case Studies
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-cyan-400 transition-colors">
                  Side-by-Side Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/dealer" className="hover:text-cyan-400 transition-colors">
                  Dealer Inventory Risk Hub
                </Link>
              </li>
              <li>
                <Link href="/inspector" className="hover:text-cyan-400 transition-colors">
                  Mechanic & OBD Scanner Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Methodology Standards */}
          <div>
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] mb-4">
              Data Provenance Tags
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Verified Data: Official Govt RC & Policies</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>AI Inference: Computer Vision & OCR</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Estimated: Actuarial Depreciation Bands</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Demo Sandbox: Controlled Case Studies</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Technology & Health */}
          <div>
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] mb-4">
              System Architecture
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              FastAPI backend running SQLAlchemy ORM with Python 3.14. Deterministic 7-category scoring algorithm with dynamic weight normalization.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>API Protocol:</span>
                <span className="text-cyan-400">REST v1</span>
              </div>
              <div className="flex justify-between text-slate-400 mt-1">
                <span>Confidence Engine:</span>
                <span className="text-emerald-400">Deterministic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Safety Disclaimer (Mandatory) */}
        <div className="pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">
                Automotive Inspection & Valuation Advisory Disclaimer
              </p>
              <p>
                CARX is an algorithmic decision-support platform designed to assist prospective buyers in assessing
                pre-owned vehicles using available photographic evidence, OCR documentation, and statistical depreciation
                modeling. CARX does not warrant, certify, or guarantee mechanical roadworthiness, structural crashworthiness,
                or hidden internal defects. An on-site physical inspection by a licensed professional technician
                remains indispensable prior to finalizing any vehicle transaction.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} CARX Intelligence Technologies. All rights reserved.</p>
            <p className="font-mono text-slate-400">
              Know the car. Know the risk. Know the price.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
