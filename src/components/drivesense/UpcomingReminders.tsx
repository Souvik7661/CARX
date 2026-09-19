"use client";

import React from "react";
import {
  ChevronRight,
  Shield,
  Droplet,
  FileCheck2,
  RotateCw,
  AlertTriangle,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { DriveSenseCar, ReminderItem } from "@/lib/drivesense-types";

interface UpcomingRemindersProps {
  car: DriveSenseCar | null;
  onViewAll?: () => void;
  onBookService?: () => void;
}

export default function UpcomingReminders({
  car,
  onViewAll,
  onBookService,
}: UpcomingRemindersProps) {
  const isAvailable = !!car;
  const reminders = car?.reminders ?? [];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "oil":
        return {
          icon: Droplet,
          color: "text-amber-400",
        };
      case "shield":
        return {
          icon: Shield,
          color: "text-blue-400",
        };
      case "leaf":
        return {
          icon: FileCheck2,
          color: "text-emerald-400",
        };
      case "tyre":
        return {
          icon: RotateCw,
          color: "text-purple-400",
        };
      case "wrench":
      default:
        return {
          icon: AlertTriangle,
          color: "text-rose-400",
        };
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl neu-card p-6 backdrop-blur-xl flex flex-col justify-between transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Service Reminders
            {isAvailable && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full neu-pill text-cyan-400 font-mono">
                {reminders.length} Due
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">Scheduled maintenance & renewals</p>
        </div>

        <button
          onClick={onViewAll}
          disabled={!isAvailable}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl neu-btn text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reminders List */}
      <div className="py-2 space-y-2.5 my-auto">
        {!isAvailable || reminders.length === 0 ? (
          <div className="py-7 text-center rounded-2xl neu-inset p-4">
            <div className="w-10 h-10 neu-circle flex items-center justify-center text-slate-500 mx-auto mb-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-xs font-bold text-slate-300">No active reminders</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Add a vehicle to compute oil change intervals, PUC expiry, and insurance renewals automatically.
            </p>
          </div>
        ) : (
          reminders.slice(0, 4).map((rem) => {
            const { icon: IconComponent, color } = getIcon(rem.icon);
            const isUrgent = rem.status === "urgent";

            return (
              <div
                key={rem.id}
                className="flex items-center justify-between p-2.5 rounded-xl neu-inset-subtle hover:bg-slate-900/60 transition-all group cursor-pointer"
                onClick={onBookService}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 neu-circle flex items-center justify-center shrink-0">
                    <IconComponent className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                      {rem.title}
                    </h4>
                    <p
                      className={`text-[11px] font-mono mt-0.5 ${
                        isUrgent ? "text-rose-400 font-bold" : "text-slate-400"
                      }`}
                    >
                      {rem.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBookService) onBookService();
                  }}
                  className="px-2.5 py-1 rounded-lg neu-btn text-[10px] font-bold text-cyan-400 group-hover:text-cyan-300"
                >
                  Schedule
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {isAvailable && onBookService && (
        <div className="pt-2 border-t border-slate-800/40 flex justify-between items-center text-[11px]">
          <span className="text-slate-400">Authorized workshops available</span>
          <button
            onClick={onBookService}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Book Appointment &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
