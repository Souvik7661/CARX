"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Search,
  Layers,
  Wrench,
  Store,
  Settings,
  Sparkles,
  Menu,
  X,
  Activity
} from "lucide-react";
import { api } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    api.getAdminHealth()
      .then(() => setIsHealthy(true))
      .catch(() => setIsHealthy(false));
  }, []);

  const navLinks = [
    { href: "/analyze", label: "Analyze Vehicle", icon: Search },
    { href: "/demo", label: "Demo Showcase", icon: Sparkles },
    { href: "/compare", label: "Compare (3)", icon: Layers },
    { href: "/dealer", label: "Dealer Hub", icon: Store },
    { href: "/inspector", label: "Inspector Mode", icon: Wrench },
    { href: "/admin", label: "System Config", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black tracking-wider text-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-transform">
            CX
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                CAR<span className="text-cyan-400">X</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-semibold uppercase tracking-wider border border-cyan-800/50">
                Intelligence
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Trust & Decision Layer
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-slate-800/80 text-cyan-400 border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action & Status Badges */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isHealthy === true
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : isHealthy === false
                  ? "bg-amber-400"
                  : "bg-slate-500"
              }`}
            />
            <span className="text-slate-400">
              {isHealthy === true ? "Engine Online" : "Connecting..."}
            </span>
          </div>

          <Link
            href="/analyze"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95"
          >
            Start Analysis
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-slate-800 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/analyze"
              onClick={() => setMobileOpen(false)}
              className="block w-full py-2.5 text-center rounded-lg bg-cyan-500 text-white text-sm font-semibold"
            >
              Analyze a Vehicle
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
