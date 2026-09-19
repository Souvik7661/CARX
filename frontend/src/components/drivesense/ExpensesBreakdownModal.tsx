"use client";

import React, { useState } from "react";
import {
  X,
  TrendingDown,
  TrendingUp,
  Fuel,
  Wrench,
  RotateCw,
  Shield,
  CreditCard,
  Calendar
} from "lucide-react";
import { DriveSenseCar } from "@/lib/drivesense-types";

interface ExpensesBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: DriveSenseCar | null;
}

export default function ExpensesBreakdownModal({
  isOpen,
  onClose,
  car,
}: ExpensesBreakdownModalProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const expenses = car?.expenses ?? {
    totalYearlySpent: 48320,
    yearlyPercentageChange: -8,
    breakdown: {
      fuel: 42,
      service: 28,
      tyres: 12,
      insurance: 10,
      others: 8,
    },
    transactions: [
      {
        id: "tx-1",
        title: "Fuel Refill",
        vendor: "IOCL, Shyamnagar",
        amount: 2500,
        date: "12 Sep 2026",
        category: "fuel" as const,
      },
      {
        id: "tx-2",
        title: "Engine Oil Change",
        vendor: "BMW Service Center",
        amount: 8400,
        date: "5 Aug 2026",
        category: "service" as const,
      },
      {
        id: "tx-3",
        title: "Tyre Replacement",
        vendor: "MRF Tyres Kolkata",
        amount: 18000,
        date: "12 Jun 2026",
        category: "tyres" as const,
      },
    ],
  };

  const categories = [
    { label: "Fuel", percent: expenses.breakdown.fuel, color: "#06b6d4" }, // Cyan
    { label: "Service", percent: expenses.breakdown.service, color: "#6366f1" }, // Indigo
    { label: "Tyres", percent: expenses.breakdown.tyres, color: "#f59e0b" }, // Amber
    { label: "Insurance", percent: expenses.breakdown.insurance, color: "#a855f7" }, // Purple
    { label: "Others", percent: expenses.breakdown.others, color: "#64748b" }, // Slate
  ];

  // SVG Donut Chart calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Expenses</h3>
            <p className="text-xs text-slate-400">Annual cost breakdown</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              This Year
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Total Spent Summary */}
        <div className="pt-3 pb-2 text-center">
          <p className="text-xs text-slate-400 font-medium">Total Spent</p>
          <p className="text-3xl font-black font-mono text-white tracking-tight mt-0.5">
            ₹ {expenses.totalYearlySpent.toLocaleString("en-IN")}
          </p>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{Math.abs(expenses.yearlyPercentageChange)}% from last year</span>
          </div>
        </div>

        {/* Donut Chart & Category Legend (Matching Screen 5) */}
        <div className="my-4 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60">
          {/* SVG Donut */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
              {categories.map((cat) => {
                const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += cat.percent;

                return (
                  <circle
                    key={cat.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={cat.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="none"
                    className="transition-all hover:opacity-80 cursor-pointer"
                    onMouseEnter={() => setActiveCategory(`${cat.label}: ${cat.percent}%`)}
                    onMouseLeave={() => setActiveCategory(null)}
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-mono font-bold text-white">
                {activeCategory || `₹ ${expenses.totalYearlySpent.toLocaleString("en-IN")}`}
              </span>
              <span className="text-[10px] text-slate-400">
                {activeCategory ? "Category" : "Total"}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs w-full sm:w-auto">
            {categories.map((cat) => (
              <div key={cat.label} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-slate-300 font-medium">{cat.label}</span>
                </div>
                <span className="font-mono font-bold text-white">{cat.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions (Matching Screen 5) */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recent Transactions
            </h4>
            <span className="text-[11px] font-semibold text-cyan-400 cursor-pointer hover:underline">
              See All
            </span>
          </div>

          <div className="space-y-2">
            {expenses.transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    {tx.category === "fuel" ? (
                      <Fuel className="w-4 h-4 text-blue-400" />
                    ) : tx.category === "service" ? (
                      <Wrench className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <RotateCw className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{tx.title}</h5>
                    <p className="text-[10px] text-slate-400">{tx.vendor}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-white">
                    ₹ {tx.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-500">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
