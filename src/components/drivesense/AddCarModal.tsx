"use client";

import React, { useState } from "react";
import { X, Check, Sparkles, Car, Shield, AlertCircle, ArrowRight } from "lucide-react";
import { DriveSenseCar, FuelType, VehicleCondition, generateCarData } from "@/lib/drivesense-types";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCar: (car: DriveSenseCar) => void;
  initialCar?: DriveSenseCar | null;
}

export default function AddCarModal({
  isOpen,
  onClose,
  onSaveCar,
  initialCar,
}: AddCarModalProps) {
  const [brand, setBrand] = useState(initialCar?.brand || "BMW");
  const [model, setModel] = useState(initialCar?.model || "320d");
  const [year, setYear] = useState<number>(initialCar?.year || 2021);
  const [fuelType, setFuelType] = useState<FuelType>(initialCar?.fuelType || "Diesel");
  const [regNumber, setRegNumber] = useState(initialCar?.regNumber || "WB02AB1234");
  const [distanceKm, setDistanceKm] = useState<number>(initialCar?.totalDistanceKm || 28450);
  const [condition, setCondition] = useState<VehicleCondition>(initialCar?.condition || "excellent");

  if (!isOpen) return null;

  const brandsList = [
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Hyundai",
    "Honda",
    "Tata",
    "Toyota",
    "Mahindra",
    "Tesla",
    "Porsche",
    "Volkswagen",
    "Kia",
  ];

  const fuelTypes: FuelType[] = ["Petrol", "Diesel", "Electric", "Hybrid"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar = generateCarData({
      id: initialCar?.id || `car_${Date.now()}`,
      brand: brand.trim() || "BMW",
      model: model.trim() || "320d",
      year: Number(year) || 2021,
      fuelType,
      regNumber: regNumber.trim().toUpperCase() || "WB02AB1234",
      totalDistanceKm: Number(distanceKm) || 28450,
      condition,
    });
    onSaveCar(newCar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl neu-card p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl neu-btn text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (Matching Screen 2) */}
        <div className="text-center mb-6">
          <div className="w-13 h-13 neu-circle flex items-center justify-center text-cyan-400 mx-auto mb-2.5 shadow-lg">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {initialCar ? "Edit Your Vehicle" : "Add Your Vehicle"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Keep all your car details in one place.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl neu-inset text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              >
                {brandsList.map((b) => (
                  <option key={b} value={b} className="bg-slate-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Model
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. 320d"
                className="w-full px-3 py-2.5 rounded-2xl neu-inset text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Year & Registration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Year
              </label>
              <input
                type="number"
                min="2000"
                max="2027"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-2xl neu-inset text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Registration Number
              </label>
              <input
                type="text"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. WB02AB1234"
                className="w-full px-3 py-2.5 rounded-2xl neu-inset text-white text-sm uppercase font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Fuel Type Pills (Matching Screen 2) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Fuel Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {fuelTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFuelType(type)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                    fuelType === type
                      ? "neu-btn-primary text-slate-950 font-bold"
                      : "neu-btn text-slate-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Total Distance Odometer */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Current Odometer (km)
            </label>
            <input
              type="number"
              min="0"
              required
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              placeholder="e.g. 28450"
              className="w-full px-3 py-2.5 rounded-2xl neu-inset text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          {/* Vehicle Condition Preset (Determines charts & telemetry!) */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Telemetry & Condition Profile</span>
              <span className="text-[10px] text-cyan-400 font-mono">Drives charts & health</span>
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  condition === "excellent"
                    ? "neu-inset border border-emerald-500/50 text-white"
                    : "neu-btn text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="condition"
                    value="excellent"
                    checked={condition === "excellent"}
                    onChange={() => setCondition("excellent")}
                    className="accent-emerald-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-emerald-400">
                      Pristine / Excellent (92% Health)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      All systems green, 0 DTC codes, smooth 870 RPM
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  condition === "good"
                    ? "neu-inset border border-amber-500/50 text-white"
                    : "neu-btn text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="condition"
                    value="good"
                    checked={condition === "good"}
                    onChange={() => setCondition("good")}
                    className="accent-amber-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-400">
                      Good / Service Due (78% Health)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Brake inspection advised, oil service in 250 km
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  condition === "fair" || condition === "attention"
                    ? "neu-inset border border-rose-500/50 text-white"
                    : "neu-btn text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="condition"
                    value="attention"
                    checked={condition === "attention" || condition === "fair"}
                    onChange={() => setCondition("attention")}
                    className="accent-rose-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-rose-400">
                      Needs Attention (54% Health)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Check engine warning, 2 DTC codes (P0300, P0420)
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button (Matching "Next ->") */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl neu-btn-primary text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <span>{initialCar ? "Save Changes" : "Confirm Vehicle & Connect Telemetry ->"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
