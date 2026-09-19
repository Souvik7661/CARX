"use client";

import React, { useState } from "react";
import {
  X,
  Wrench,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Car
} from "lucide-react";
import { DriveSenseCar } from "@/lib/drivesense-types";

interface BookServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: DriveSenseCar | null;
}

export default function BookServiceModal({
  isOpen,
  onClose,
  car,
}: BookServiceModalProps) {
  const [selectedDate, setSelectedDate] = useState("Fri 22 Sep");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [selectedService, setSelectedService] = useState("Periodic Maintenance");
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const dates = ["Thu 21 Sep", "Fri 22 Sep", "Sat 23 Sep", "Sun 24 Sep"];
  const times = ["10:00 AM", "11:00 AM", "12:00 PM", "2:30 PM"];

  const serviceOptions = [
    { id: "periodic", label: "Periodic Maintenance & Oil", desc: "Engine oil, filters, 45-point check" },
    { id: "brakes", label: "Brake Pads & Rotor Inspection", desc: "Front/rear calipers & pad wear test" },
    { id: "diagnostics", label: "Full OBD-II Diagnostics", desc: "Sensor telemetry & ECU error clearing" },
  ];

  const brandName = car?.brand || "BMW";
  const centerName = `${brandName} Authorized Service Center`;

  const handleConfirm = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white tracking-tight">
            Book a Service
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="py-12 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Booking Confirmed!</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
              Appointment scheduled for <span className="text-cyan-400 font-semibold">{selectedDate}</span> at <span className="text-cyan-400 font-semibold">{selectedTime}</span> at {centerName}.
            </p>
            <p className="text-[11px] text-slate-500 mt-3 font-mono">
              Confirmation SMS & Calendar Invite dispatched.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-3">
            {/* Service Center Card (Matching Screen 6) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{centerName}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>Kolkata • 2.1 km away</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/60">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-medium">
                  Authorized Service
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium">
                  Genuine Parts
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60 font-medium">
                  Instant Bay
                </span>
              </div>
            </div>

            {/* Select Date (Matching Screen 6) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Date</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all border ${
                      selectedDate === d
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                        : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Time (Matching Screen 6) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Time</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all border ${
                      selectedTime === t
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                        : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Service Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Package</span>
              </label>
              <div className="space-y-2">
                {serviceOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedService(opt.label)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedService === opt.label
                        ? "bg-cyan-950/30 border-cyan-500/60 text-white"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{opt.label}</p>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                    {selectedService === opt.label && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Button (Matching Screen 6) */}
            <div className="pt-2">
              <button
                onClick={handleConfirm}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
