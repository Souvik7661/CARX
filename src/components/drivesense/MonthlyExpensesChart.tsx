"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown, BarChart3, CreditCard } from "lucide-react";
import { DriveSenseCar } from "@/lib/drivesense-types";

interface MonthlyExpensesChartProps {
  car: DriveSenseCar | null;
  onViewBreakdown?: () => void;
}

export default function MonthlyExpensesChart({
  car,
  onViewBreakdown,
}: MonthlyExpensesChartProps) {
  const [filter, setFilter] = useState("This Month");
  const [hoveredBar, setHoveredBar] = useState<{ month: string; amount: number } | null>(null);

  const isAvailable = !!car;
  const currentTotal = car?.expenses.currentMonthTotal ?? 0;
  const pctChange = car?.expenses.percentageChange ?? 0;

  const defaultMonths = [
    { month: "Apr", amount: 0 },
    { month: "May", amount: 0 },
    { month: "Jun", amount: 0 },
    { month: "Jul", amount: 0 },
    { month: "Aug", amount: 0 },
    { month: "Sep", amount: 0, isCurrent: true },
  ];

  const history = car?.expenses.monthlyHistory ?? defaultMonths;
  const maxAmount = Math.max(...history.map((m) => m.amount), 6000);

  return (
    <div className="relative overflow-hidden rounded-3xl neu-card p-6 backdrop-blur-xl flex flex-col justify-between transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Monthly Expenses
          </h3>
          <p className="text-xs text-slate-400">Fuel & upkeep costs</p>
        </div>

        {/* Tactile Filter Dropdown */}
        <button
          onClick={onViewBreakdown}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn text-[11px] font-semibold text-slate-300 transition-colors"
        >
          <span>{filter}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Metric Values */}
      <div className="mt-3 mb-3 flex items-baseline justify-between">
        <div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            {isAvailable ? `₹ ${currentTotal.toLocaleString("en-IN")}` : "₹ 0"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {isAvailable ? (
              <>
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    pctChange >= 0 ? "text-emerald-400" : "text-cyan-400"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
                  {pctChange > 0 ? `+${pctChange}%` : `${pctChange}%`}
                </span>
                <span className="text-[11px] text-slate-400">vs last month</span>
              </>
            ) : (
              <span className="text-[11px] text-slate-400">
                No expense entries recorded
              </span>
            )}
          </div>
        </div>

        {isAvailable && onViewBreakdown && (
          <button
            onClick={onViewBreakdown}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Cost Breakdown
          </button>
        )}
      </div>

      {/* Recessed Neumorphic Chart Well */}
      <div className="p-3.5 rounded-2xl neu-inset">
        {/* Tooltip */}
        <div className="h-5 mb-1 text-center">
          {hoveredBar && isAvailable ? (
            <span className="text-[11px] font-mono font-bold text-cyan-300 neu-pill px-3 py-0.5 shadow-sm">
              {hoveredBar.month}: ₹ {hoveredBar.amount.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">Tap bars to view details</span>
          )}
        </div>

        {/* 6-Month Sunken Vertical Tracks */}
        <div className="flex items-end justify-between gap-2.5 sm:gap-3 h-28 px-2 pt-2">
          {history.map((item) => {
            const heightPercent = isAvailable
              ? Math.max((item.amount / maxAmount) * 100, 10)
              : 8;

            const isCurrent = item.isCurrent;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={onViewBreakdown}
              >
                {/* Sunken track channel */}
                <div className="w-full max-w-[26px] bg-[#070a13] rounded-t-lg relative flex items-end h-full p-0.5 shadow-inner">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      !isAvailable
                        ? "bg-slate-800/40"
                        : isCurrent
                        ? "neu-btn-primary shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                        : "bg-slate-700 hover:bg-cyan-600"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Month */}
                <span
                  className={`text-[10px] font-mono tracking-wider ${
                    isCurrent && isAvailable ? "text-cyan-400 font-bold" : "text-slate-400"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
