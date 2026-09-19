"use client";

import React from "react";
import {
  Fuel,
  PlusCircle,
  Wrench,
  FileUp,
  MapPin,
  Activity,
  Car
} from "lucide-react";

interface QuickActionsProps {
  onLogFuel: () => void;
  onAddExpense: () => void;
  onBookService: () => void;
  onUploadDocument: () => void;
  onFindServiceCenter: () => void;
  onRunDiagnostics: () => void;
  isCarConnected: boolean;
}

export default function QuickActions({
  onLogFuel,
  onAddExpense,
  onBookService,
  onUploadDocument,
  onFindServiceCenter,
  onRunDiagnostics,
  isCarConnected,
}: QuickActionsProps) {
  const actions = [
    {
      id: "log-fuel",
      label: "Log Fuel",
      icon: Fuel,
      color: "text-blue-400",
      onClick: onLogFuel,
    },
    {
      id: "add-expense",
      label: "Add Expense",
      icon: PlusCircle,
      color: "text-purple-400",
      onClick: onAddExpense,
    },
    {
      id: "book-service",
      label: "Book Service",
      icon: Wrench,
      color: "text-cyan-400",
      onClick: onBookService,
    },
    {
      id: "upload-doc",
      label: "Documents",
      icon: FileUp,
      color: "text-emerald-400",
      onClick: onUploadDocument,
    },
    {
      id: "find-center",
      label: "Find Center",
      icon: MapPin,
      color: "text-rose-400",
      onClick: onFindServiceCenter,
    },
    {
      id: "run-diagnostics",
      label: "Diagnostics",
      icon: Activity,
      color: "text-indigo-400",
      onClick: onRunDiagnostics,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl neu-card p-6 backdrop-blur-xl flex flex-col justify-between transition-all">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800/40 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Quick Actions
          </h3>
          <p className="text-xs text-slate-400">One-tap consumer shortcuts</p>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 neu-pill px-2.5 py-0.5">
          SHORTCUTS
        </span>
      </div>

      {/* Grid of 6 Neumorphic Push-Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 py-3 my-auto">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="neu-btn group flex flex-col items-center justify-center p-3 rounded-2xl text-center active:scale-95"
            >
              <div className="w-10 h-10 neu-circle flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-400 text-center">
        {isCarConnected ? "Vehicle synced • Tap any shortcut above" : "Tap shortcuts to explore features"}
      </div>
    </div>
  );
}
