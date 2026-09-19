"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Car,
  Plus,
  Compass,
  User,
  Shield,
  Phone,
  Wrench,
  MapPin,
  Camera,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Bot,
  Send,
  Mic,
  Activity,
  FileText,
  Fuel,
  PlusCircle,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Info,
  Bell,
  Play,
  Square,
  ArrowRight,
  RotateCcw,
  Download,
  Flame,
  Zap,
  Radio
} from "lucide-react";

import { DriveSenseCar, FuelType } from "@/lib/drivesense-types";

interface MobileAppSuiteProps {
  activeCar: DriveSenseCar | null;
  onAddCar?: () => void;
  onCloseMobileView?: () => void;
  initialScreen?: MobileScreen;
  initialCarTab?: "overview" | "health" | "gallery" | "specs";
  initialQuickAdd?: boolean;
}

type MobileScreen =
  | "onboarding"
  | "home"
  | "my-car"
  | "inspection"
  | "assistant"
  | "expenses"
  | "drive"
  | "emergency"
  | "profile";

export default function MobileAppSuite({
  activeCar,
  onAddCar,
  onCloseMobileView,
  initialScreen = "home",
  initialCarTab = "overview",
  initialQuickAdd = false,
}: MobileAppSuiteProps) {
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>(initialScreen);
  const [activeCarTab, setActiveCarTab] = useState<"overview" | "health" | "gallery" | "specs">(initialCarTab);
  const [activeInspectionTab, setActiveInspectionTab] = useState<"exterior" | "interior" | "engine" | "underbody">("exterior");
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [capturedAngles, setCapturedAngles] = useState<{ [index: number]: string }>({});
  const [isCapturing, setIsCapturing] = useState(false);

  // Drive mode state
  const [isDriving, setIsDriving] = useState(true);
  const [driveSeconds, setDriveSeconds] = useState(2538); // 00:42:18
  const [driveDistance, setDriveDistance] = useState(18.4);

  // Quick Add Action Sheet modal
  const [showQuickAdd, setShowQuickAdd] = useState(initialQuickAdd);

  // Assistant messages state
  const [chatMessages, setChatMessages] = useState([
    {
      id: "msg-1",
      sender: "assistant",
      text: "Hi Souvik, 👋 I'm your AI Car Assistant. Ask anything about your car or get personalized recommendations.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Sync screen from URL query param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const s = p.get("screen") as MobileScreen;
      if (s) {
        setCurrentScreen(s);
      }
    }
  }, []);

  // Drive mode timer tick
  useEffect(() => {
    let interval: any;
    if (isDriving) {
      interval = setInterval(() => {
        setDriveSeconds((prev) => prev + 1);
        setDriveDistance((prev) => +(prev + 0.01).toFixed(2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDriving]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const exteriorAngles = [
    { title: "Front View", subtitle: "Capture or upload a clear photo of the front side of your car.", tag: "EXT_FRONT" },
    { title: "Front-Left 45°", subtitle: "Capture the front-left corner, wheel arch and bumper.", tag: "EXT_FRONT_LEFT" },
    { title: "Left Side Profile", subtitle: "Capture full left doors, sill and windows straight-on.", tag: "EXT_LEFT_SIDE" },
    { title: "Rear-Left 45°", subtitle: "Capture the rear-left quarter panel, taillight and exhaust.", tag: "EXT_REAR_LEFT" },
    { title: "Rear View", subtitle: "Capture the license plate, trunk lid and rear bumper.", tag: "EXT_REAR" },
    { title: "Rear-Right 45°", subtitle: "Capture the rear-right quarter panel, taillight and wheel.", tag: "EXT_REAR_RIGHT" },
    { title: "Right Side Profile", subtitle: "Capture full right doors, sill and fuel filler flap.", tag: "EXT_RIGHT_SIDE" },
    { title: "Front-Right 45°", subtitle: "Capture the front-right corner, headlamp and wheel.", tag: "EXT_FRONT_RIGHT" },
    { title: "Roof & Sunroof", subtitle: "Capture the roof panel, rails and glass surface.", tag: "EXT_ROOF" },
    { title: "Front Windshield", subtitle: "Inspect for glass chips, stone stars or wiper scratches.", tag: "EXT_WINDSHIELD" },
    { title: "Wheels & Calipers", subtitle: "Close-up of front-left alloy wheel and brake disc.", tag: "EXT_WHEELS" },
    { title: "Tyres & Tread Depth", subtitle: "Verify tread depth grooves and sidewall condition.", tag: "EXT_TYRES" },
  ];

  const handleSimulateCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCapturedAngles((prev) => ({
        ...prev,
        [currentAngleIndex]: `captured_${currentAngleIndex + 1}`,
      }));
      setIsCapturing(false);
      if (currentAngleIndex < exteriorAngles.length - 1) {
        setCurrentAngleIndex((prev) => prev + 1);
      }
    }, 600);
  };

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: `user-${Date.now()}`, sender: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      let reply = "All vehicle telemetries and diagnostics report healthy operation.";
      const lower = text.toLowerCase();
      if (lower.includes("mileage")) {
        reply = `Your BMW 320d diesel averages 18.6 km/l. Keeping tyre pressure at 33 PSI and cruising in 8th gear will preserve peak efficiency.`;
      } else if (lower.includes("oil")) {
        reply = `Next engine oil service is scheduled in 800 km (synthetic 5W-30). You can tap 'Book Service' to schedule an authorized bay.`;
      } else if (lower.includes("expense")) {
        reply = `Total spent this month is ₹ 4,850 (12% lower than last month). Fuel accounted for 42% and periodic service was 28%.`;
      } else if (lower.includes("noise")) {
        reply = `If ticking occurs on cold start, verify oil level. If squeaking happens during brake depression, check the front brake pads.`;
      }
      setChatMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, sender: "assistant", text: reply },
      ]);
    }, 600);
  };

  // Active car info fallback
  const carTitle = activeCar ? `${activeCar.brand} ${activeCar.model}` : "BMW 320d";
  const carSpecs = activeCar ? `${activeCar.year} • ${activeCar.fuelType}` : "2021 • Diesel";
  const healthScore = activeCar?.healthScore ?? 92;

  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 sm:px-4">
      {/* Top Banner with Download Button & Screen Navigator */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 neu-circle flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-tight">
              DriveSense Mobile App
            </h3>
            <p className="text-[10px] text-cyan-400 font-mono">
              Live iOS / Android Simulation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Mobile App Link */}
          <a
            href="/api/download-app"
            download="drivesense-mobile-app.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn-primary text-slate-950 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Download full React Native / Expo codebase as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download App (ZIP)</span>
          </a>

          {onCloseMobileView && (
            <button
              onClick={onCloseMobileView}
              className="p-1.5 rounded-xl neu-btn text-slate-400 hover:text-white text-xs"
              title="Return to Desktop Cockpit"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Screen Selector Chips (Allowing 1-tap jump to any of the 8 screens from reference image) */}
      <div className="w-full max-w-md mb-4 overflow-x-auto pb-1.5 flex items-center gap-1.5 no-scrollbar px-2">
        {[
          { id: "home" as MobileScreen, label: "Home Cockpit" },
          { id: "my-car" as MobileScreen, label: "My Car HUD" },
          { id: "inspection" as MobileScreen, label: "Visual Inspection" },
          { id: "assistant" as MobileScreen, label: "AI Assistant" },
          { id: "expenses" as MobileScreen, label: "Expenses" },
          { id: "drive" as MobileScreen, label: "Track Drive" },
          { id: "emergency" as MobileScreen, label: "SOS Mode" },
          { id: "onboarding" as MobileScreen, label: "Onboarding" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setCurrentScreen(s.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              currentScreen === s.id
                ? "neu-btn-primary text-slate-950 font-bold"
                : "neu-btn text-slate-400 hover:text-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Realistic Mobile Device Container (iPhone 16 Pro Dimensions) */}
      <div className="relative w-full max-w-[395px] h-[835px] rounded-[52px] bg-[#070a12] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_0_12px_#141b2d,0_0_0_14px_#070a12] border border-slate-700/50 flex flex-col overflow-hidden">
        {/* Hardware Frame Elements: Dynamic Island & Status Bar */}
        <div className="relative w-full pt-2 px-6 pb-1 flex items-center justify-between text-xs text-slate-300 select-none shrink-0 z-30">
          <span className="font-semibold text-[13px] tracking-tight text-white font-mono">9:41</span>

          {/* Dynamic Island pill */}
          <div className="w-26 h-7 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner border border-slate-800/80">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0d1424] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/80 animate-pulse" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-tighter">DriveSense</span>
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <span className="text-[11px] font-mono">5G</span>
            <div className="w-5 h-2.5 rounded-sm border border-slate-400 p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Screen Viewport (Scrollable with Lenis feel) */}
        <div className="relative flex-1 w-full overflow-y-auto rounded-[40px] bg-[#0c111e] flex flex-col justify-between text-slate-100">
          {/* ==================================================== */}
          {/* SCREEN 1: ONBOARDING / WELCOME */}
          {/* ==================================================== */}
          {currentScreen === "onboarding" && (
            <div className="flex-1 flex flex-col justify-between p-6 text-center animate-in fade-in duration-300">
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 neu-circle flex items-center justify-center text-cyan-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="font-mono font-extrabold text-white text-sm">DriveSense</span>
                </div>
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Skip
                </button>
              </div>

              {/* Vector Highway Schematic */}
              <div className="my-auto py-6">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="90" stroke="#162035" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M40 160 L90 70 L110 70 L160 160 Z" fill="#09101d" stroke="#0284c7" strokeWidth="1.5" />
                    <line x1="100" y1="75" x2="100" y2="155" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" />
                    {/* Glowing Vehicle Tail */}
                    <rect x="85" y="65" width="30" height="12" rx="4" fill="#0f172a" stroke="#0ea5e9" />
                    <circle cx="90" cy="71" r="2.5" fill="#f43f5e" className="animate-ping" />
                    <circle cx="110" cy="71" r="2.5" fill="#f43f5e" className="animate-ping" />
                  </svg>
                </div>

                <h1 className="text-2xl font-black text-white tracking-tight mt-4">
                  Every Journey Tells a Story.
                </h1>
                <h2 className="text-xl font-black text-cyan-400 tracking-tight">
                  Let&apos;s Keep It Alive.
                </h2>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Your car&apos;s digital companion for a smarter, safer, and happier drive.
                </p>
              </div>

              <div className="space-y-2.5 pb-2">
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="w-full py-3.5 rounded-2xl neu-btn-primary text-slate-950 font-black text-sm tracking-wide"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="w-full py-3 rounded-2xl neu-btn text-slate-400 hover:text-white text-xs font-semibold"
                >
                  I already have an account
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 2: MOBILE HOME (COCKPIT) */}
          {/* ==================================================== */}
          {currentScreen === "home" && (
            <div className="flex-1 p-5 space-y-4 overflow-y-auto animate-in fade-in duration-300">
              {/* Header Greeting */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Good Evening</p>
                  <h2 className="text-lg font-black text-white tracking-tight">Souvik 👋</h2>
                </div>
                <div className="w-9 h-9 neu-circle flex items-center justify-center text-cyan-300 font-bold text-xs">
                  S
                </div>
              </div>

              {/* Vehicle Switcher Pill */}
              <div
                onClick={() => setCurrentScreen("my-car")}
                className="p-3 rounded-2xl neu-card-sm flex items-center justify-between cursor-pointer hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 neu-circle flex items-center justify-center text-cyan-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">{carTitle}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{carSpecs}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* Health Circular Meter */}
              <div
                onClick={() => setCurrentScreen("my-car")}
                className="p-5 rounded-3xl neu-card text-center cursor-pointer flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="relative w-32 h-32 neu-circle-inset flex items-center justify-center my-1">
                  <svg className="w-full h-full transform -rotate-90 p-2" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" stroke="#101726" strokeWidth="9" fill="none" />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke="#10b981"
                      strokeWidth="9"
                      strokeDasharray={301.6}
                      strokeDashoffset={301.6 - (healthScore / 100) * 301.6}
                      strokeLinecap="round"
                      fill="none"
                      style={{ filter: "drop-shadow(0 0 12px rgba(16,185,129,0.5))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-mono text-white">{healthScore}%</span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Excellent</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-2">
                  Your car is in great shape!
                </p>
              </div>

              {/* 3 Metric Pills (28,450 km | 18.6 km/l | Jan 2026) */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl neu-inset-subtle">
                  <p className="text-xs font-mono font-bold text-white">28,450 km</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Distance</p>
                </div>
                <div className="p-2.5 rounded-2xl neu-inset-subtle">
                  <p className="text-xs font-mono font-bold text-white">18.6 km/l</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Avg. Mileage</p>
                </div>
                <div className="p-2.5 rounded-2xl neu-inset-subtle">
                  <p className="text-xs font-mono font-bold text-cyan-400">Jan 2026</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Next Service</p>
                </div>
              </div>

              {/* 6 Quick Actions in 2x3 Grid (Matching Screen 2) */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Actions
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Log Fuel", icon: Fuel, color: "text-blue-400", onClick: () => setCurrentScreen("expenses") },
                    { label: "Add Expense", icon: PlusCircle, color: "text-purple-400", onClick: () => setCurrentScreen("expenses") },
                    { label: "Book Service", icon: Wrench, color: "text-cyan-400", onClick: () => setCurrentScreen("my-car") },
                    { label: "Diagnostics", icon: Activity, color: "text-emerald-400", onClick: () => setCurrentScreen("my-car") },
                    { label: "Documents", icon: FileText, color: "text-amber-400", onClick: () => setCurrentScreen("my-car") },
                    { label: "Find Center", icon: MapPin, color: "text-rose-400", onClick: () => setCurrentScreen("my-car") },
                  ].map((a) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.label}
                        onClick={a.onClick}
                        className="p-3 rounded-2xl neu-btn flex flex-col items-center justify-center text-center active:scale-95 transition-all"
                      >
                        <div className="w-8 h-8 neu-circle flex items-center justify-center mb-1.5">
                          <Icon className={`w-4 h-4 ${a.color}`} />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-200">{a.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 3: MY CAR (3D/VECTOR HUD & SUBSYSTEMS) */}
          {/* ==================================================== */}
          {currentScreen === "my-car" && (
            <div className="flex-1 p-5 space-y-4 overflow-y-auto animate-in fade-in duration-300">
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="p-1.5 rounded-xl neu-btn text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black text-white">{carTitle}</h2>
                <div className="w-7 h-7 neu-circle flex items-center justify-center text-slate-400">
                  <Bell className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sub-tabs: Overview | Health | Gallery | Specs */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl neu-inset text-[11px] font-bold">
                {(["overview", "health", "gallery", "specs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveCarTab(tab)}
                    className={`py-1.5 rounded-xl capitalize transition-all ${
                      activeCarTab === tab
                        ? "neu-btn-primary text-slate-950 font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Vector Isometric Chassis Wireframe */}
              <div className="p-4 rounded-3xl neu-card flex flex-col items-center justify-center relative">
                <div className="relative w-56 h-36 flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" viewBox="0 0 280 140" fill="none">
                    <path
                      d="M40 70 C40 45 70 30 120 28 C180 26 230 40 250 65 C255 70 255 78 250 82 C230 108 180 122 120 120 C70 118 40 102 40 70 Z"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      fill="#0e172a"
                    />
                    <path d="M95 40 C135 38 175 44 195 70 C175 96 135 102 95 100 Z" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
                    {/* Glowing Diagnostic Sensor Hotspots */}
                    <circle cx="215" cy="70" r="6" className="fill-emerald-400 animate-pulse" />
                    <circle cx="140" cy="70" r="6" className="fill-cyan-400" />
                    <circle cx="205" cy="24" r="4" className="fill-emerald-400" />
                    <circle cx="205" cy="116" r="4" className="fill-emerald-400" />
                    <circle cx="75" cy="24" r="4" className="fill-emerald-400" />
                    <circle cx="75" cy="116" r="4" className="fill-emerald-400" />
                  </svg>
                </div>
                <p className="text-[10px] font-mono text-cyan-300 neu-pill px-3 py-0.5 mt-1">
                  📍 Tap on a component to view details
                </p>
              </div>

              {/* 6 Subsystems Grid (2x3) */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Engine", status: "Good", color: "text-emerald-400" },
                  { label: "Battery", status: "Good", color: "text-emerald-400" },
                  { label: "Brakes", status: "Good", color: "text-emerald-400" },
                  { label: "Tyres", status: "Good", color: "text-emerald-400" },
                  { label: "Fluids", status: "Good", color: "text-emerald-400" },
                  { label: "Electronics", status: "Good", color: "text-emerald-400" },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 rounded-2xl neu-inset-subtle text-center">
                    <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                    <p className={`text-xs font-bold font-mono mt-0.5 ${item.color}`}>{item.status}</p>
                  </div>
                ))}
              </div>

              {/* Overall Health Progress Bar */}
              <div className="p-3.5 rounded-2xl neu-card-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Health</p>
                  <p className="text-sm font-black font-mono text-white">92% <span className="text-emerald-400 text-xs font-normal">Excellent</span></p>
                </div>
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[92%]" />
                </div>
              </div>

              {/* Action: Visual Inspection Navigation */}
              <button
                onClick={() => setCurrentScreen("inspection")}
                className="w-full py-3 rounded-2xl neu-btn text-cyan-300 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Start Visual Vehicle Inspection &rarr;</span>
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 4: VISUAL INSPECTION (360 GUIDED WALK-AROUND) */}
          {/* ==================================================== */}
          {currentScreen === "inspection" && (
            <div className="flex-1 p-5 space-y-3.5 overflow-y-auto animate-in fade-in duration-300">
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="p-1.5 rounded-xl neu-btn text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black text-white">Visual Inspection</h2>
                <button className="p-1.5 rounded-xl neu-btn text-slate-400">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Category Tabs: Exterior | Interior | Engine | Underbody */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl neu-inset text-[10px] font-bold">
                {(["exterior", "interior", "engine", "underbody"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveInspectionTab(tab)}
                    className={`py-1.5 rounded-xl capitalize transition-all ${
                      activeInspectionTab === tab
                        ? "neu-btn-primary text-slate-950 font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Guided 360 Walkaround Top-Down Schematic with Slots */}
              <div className="p-3 rounded-3xl neu-card flex flex-col items-center justify-center relative">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-600" viewBox="0 0 160 200" fill="none">
                    <path
                      d="M45 45 C45 25 65 15 80 15 C95 15 115 25 115 45 L120 135 C120 165 110 190 80 190 C50 190 40 165 40 135 Z"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      fill="#091222"
                    />
                    <circle cx="80" cy="35" r="4" fill="#06b6d4" />
                    <circle cx="80" cy="170" r="4" fill="#06b6d4" />
                  </svg>

                  {/* 8 Peripheral Capture Indicators */}
                  {[
                    { pos: "top-1 left-1/2 -translate-x-1/2", idx: 0 },
                    { pos: "top-8 right-3", idx: 1 },
                    { pos: "top-1/2 right-1 -translate-y-1/2", idx: 2 },
                    { pos: "bottom-8 right-3", idx: 3 },
                    { pos: "bottom-1 left-1/2 -translate-x-1/2", idx: 4 },
                    { pos: "bottom-8 left-3", idx: 5 },
                    { pos: "top-1/2 left-1 -translate-y-1/2", idx: 6 },
                    { pos: "top-8 left-3", idx: 7 },
                  ].map((pt) => {
                    const isDone = !!capturedAngles[pt.idx];
                    const isCur = currentAngleIndex === pt.idx;
                    return (
                      <div
                        key={pt.idx}
                        onClick={() => setCurrentAngleIndex(pt.idx)}
                        className={`absolute ${pt.pos} w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold cursor-pointer transition-all ${
                          isDone
                            ? "bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10b981]"
                            : isCur
                            ? "bg-cyan-500 text-slate-950 ring-2 ring-white animate-bounce"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {isDone ? "✓" : pt.idx + 1}
                      </div>
                    );
                  })}
                </div>

                <div className="w-full text-center mt-2 pt-2 border-t border-slate-800/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {exteriorAngles[currentAngleIndex]?.title}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {currentAngleIndex + 1}/{exteriorAngles.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    {exteriorAngles[currentAngleIndex]?.subtitle}
                  </p>
                </div>
              </div>

              {/* Safety Warning when Engine Bay or Underbody tab is active */}
              {(activeInspectionTab === "engine" || activeInspectionTab === "underbody") && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2 text-left text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px]">
                    <strong>Safety Notice:</strong> Never place yourself under a vehicle supported only by a jack. Use a certified lift or garage equipment.
                  </p>
                </div>
              )}

              {/* Capture / Upload Action Controls */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={handleSimulateCapture}
                  className="px-3.5 py-2.5 rounded-2xl neu-btn text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload</span>
                </button>

                {/* Shutter Button */}
                <button
                  onClick={handleSimulateCapture}
                  disabled={isCapturing}
                  className="w-14 h-14 neu-circle flex items-center justify-center text-cyan-400 active:scale-90 transition-transform shadow-xl"
                  title="Capture Angle"
                >
                  <div className="w-10 h-10 rounded-full neu-btn-primary flex items-center justify-center text-slate-950">
                    <Camera className="w-5 h-5" />
                  </div>
                </button>

                {/* Previous / Next Angle Switcher */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentAngleIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentAngleIndex === 0}
                    className="p-2.5 rounded-xl neu-btn text-slate-400 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentAngleIndex((prev) => Math.min(exteriorAngles.length - 1, prev + 1))}
                    disabled={currentAngleIndex === exteriorAngles.length - 1}
                    className="p-2.5 rounded-xl neu-btn text-slate-400 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 5: DRIVESENSE AI ASSISTANT */}
          {/* ==================================================== */}
          {currentScreen === "assistant" && (
            <div className="flex-1 flex flex-col justify-between p-4 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="p-1.5 rounded-xl neu-btn text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    A
                  </div>
                  <h3 className="text-xs font-bold text-white">DriveSense AI</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="w-6" />
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "neu-btn-primary text-slate-950 font-semibold"
                          : "neu-inset-subtle text-slate-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Suggestions Chips (Matching Screen 5) */}
              <div className="py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
                {[
                  "Why is my mileage low?",
                  "When should I change engine oil?",
                  "Show my expenses this month",
                  "What could cause engine noise?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendChat(prompt)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full neu-btn text-[10px] font-medium text-slate-300 hover:text-cyan-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat(chatInput);
                }}
                className="pt-2 flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-3.5 py-2.5 rounded-2xl neu-inset text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendChat("Perform diagnostic health check")}
                  className="p-2.5 rounded-2xl neu-btn text-slate-400 hover:text-cyan-400"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="p-2.5 rounded-2xl neu-btn-primary text-slate-950 font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 6: EXPENSES & FUEL INTELLIGENCE */}
          {/* ==================================================== */}
          {currentScreen === "expenses" && (
            <div className="flex-1 p-5 space-y-4 overflow-y-auto animate-in fade-in duration-300">
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="p-1.5 rounded-xl neu-btn text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black text-white">Expenses</h2>
                <span className="text-[11px] neu-pill px-2.5 py-1 text-slate-300 font-semibold">
                  This Month ▾
                </span>
              </div>

              {/* Total Spent Card */}
              <div className="p-4 rounded-3xl neu-card text-center">
                <p className="text-[11px] text-slate-400">Total Spent</p>
                <p className="text-2xl font-black font-mono text-white mt-0.5">₹ 4,850</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
                  ↓ 12% lower than last month
                </span>
              </div>

              {/* 6-Month Bar Chart */}
              <div className="p-3.5 rounded-2xl neu-inset">
                <div className="flex items-end justify-between gap-2 h-24 px-2 pt-2">
                  {[
                    { month: "Apr", val: 3200 },
                    { month: "May", val: 4100 },
                    { month: "Jun", val: 2900 },
                    { month: "Jul", val: 5400 },
                    { month: "Aug", val: 6320, peak: true },
                    { month: "Sep", val: 4850, cur: true },
                  ].map((b) => (
                    <div key={b.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full max-w-[20px] bg-[#090d18] rounded-t-md relative flex items-end h-full p-0.5">
                        <div
                          className={`w-full rounded-t-sm ${
                            b.cur ? "neu-btn-primary" : b.peak ? "bg-cyan-600" : "bg-slate-700"
                          }`}
                          style={{ height: `${(b.val / 6500) * 100}%` }}
                        />
                      </div>
                      <span className={`text-[9px] font-mono ${b.cur ? "text-cyan-400 font-bold" : "text-slate-500"}`}>
                        {b.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown (Matching Screen 6) */}
              <div className="space-y-2 text-xs">
                {[
                  { label: "Fuel", pct: "42%", color: "bg-cyan-400" },
                  { label: "Service", pct: "28%", color: "bg-indigo-400" },
                  { label: "Tyres", pct: "12%", color: "bg-amber-400" },
                  { label: "Insurance", pct: "10%", color: "bg-purple-400" },
                  { label: "Others", pct: "8%", color: "bg-slate-500" },
                ].map((c) => (
                  <div key={c.label} className="p-2.5 rounded-xl neu-inset-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      <span className="font-medium text-slate-300">{c.label}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 7: TRACK DRIVE (LIVE DRIVING TELEMETRY) */}
          {/* ==================================================== */}
          {currentScreen === "drive" && (
            <div className="flex-1 p-5 space-y-4 overflow-y-auto animate-in fade-in duration-300">
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="p-1.5 rounded-xl neu-btn text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black text-white">Track Drive</h2>
                <span className="text-[10px] font-mono text-emerald-400 neu-pill px-2.5 py-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  GPS Active
                </span>
              </div>

              {/* Circular Timer & Speedometer Ring */}
              <div className="p-5 rounded-3xl neu-card text-center flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 neu-circle-inset flex items-center justify-center my-1">
                  <svg className="w-full h-full transform -rotate-90 p-2" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" stroke="#101726" strokeWidth="8" fill="none" />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke="#06b6d4"
                      strokeWidth="8"
                      strokeDasharray={301.6}
                      strokeDashoffset={120}
                      strokeLinecap="round"
                      fill="none"
                      style={{ filter: "drop-shadow(0 0 10px rgba(6,182,212,0.5))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Car className="w-5 h-5 text-cyan-400 mb-1" />
                    <span className="text-lg font-black font-mono text-white">{formatTimer(driveSeconds)}</span>
                    <span className="text-[9px] text-slate-400 font-medium">Trip in progress</span>
                  </div>
                </div>
              </div>

              {/* Real-time Trip Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl neu-inset-subtle">
                  <p className="text-sm font-mono font-bold text-white">{driveDistance} km</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Distance</p>
                </div>
                <div className="p-2.5 rounded-2xl neu-inset-subtle">
                  <p className="text-sm font-mono font-bold text-white">15.3 km/L</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Avg. Mileage</p>
                </div>
                <div className="p-2.5 rounded-2xl neu-inset-subtle">
                  <p className="text-sm font-mono font-bold text-white">1.2 L</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Est. Fuel</p>
                </div>
              </div>

              {/* Route Map GPS Polyline Graphic */}
              <div className="p-3 rounded-2xl neu-inset h-32 relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 240 100" fill="none">
                  <line x1="0" y1="25" x2="240" y2="25" stroke="#162035" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="240" y2="50" stroke="#162035" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="240" y2="75" stroke="#162035" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Route Polyline */}
                  <polyline
                    points="30,75 70,30 140,80 200,35"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Start Pin */}
                  <circle cx="30" cy="75" r="5" fill="#f43f5e" />
                  {/* Live Car Pin */}
                  <circle cx="200" cy="35" r="7" fill="#10b981" className="animate-ping" />
                  <circle cx="200" cy="35" r="5" fill="#10b981" />
                </svg>
              </div>

              {/* Stop / Pause Drive Button */}
              <button
                onClick={() => setIsDriving(!isDriving)}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all ${
                  isDriving
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                    : "neu-btn-primary text-slate-950"
                }`}
              >
                {isDriving ? "Stop Trip" : "Resume Drive"}
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* SCREEN 8: EMERGENCY MODE (SOS) */}
          {/* ==================================================== */}
          {currentScreen === "emergency" && (
            <div className="flex-1 p-5 space-y-4 overflow-y-auto animate-in fade-in duration-300">
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCurrentScreen("home")}
                  className="p-1.5 rounded-xl neu-btn text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <h2 className="text-sm font-black text-white">Emergency Mode</h2>
                </div>
                <div className="w-6" />
              </div>

              <p className="text-xs text-center text-slate-400">
                Stay calm. Immediate roadside help is one tap away.
              </p>

              {/* Massive Glowing Pulsing Red SOS Button */}
              <div className="py-2 flex justify-center">
                <button
                  onClick={() => alert("SOS Emergency Broadcast Dispatched: Coordinates 22.5726° N, 88.3639° E sent to roadside assistance.")}
                  className="w-36 h-36 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 shadow-[0_0_40px_rgba(239,68,68,0.7),inset_0_2px_10px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center text-white active:scale-95 transition-transform animate-pulse"
                >
                  <span className="text-3xl font-black font-mono tracking-wider">SOS</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-90">Press to Alert</span>
                </button>
              </div>

              {/* 4 Emergency Action Tiles (Matching Screen 8) */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Call Emergency 112", icon: Phone, sub: "National Helpline", action: () => alert("Dialing 112 emergency service...") },
                  { label: "Roadside Assistance", icon: Wrench, sub: "Towing & Tyre", action: () => alert("Contacting Roadside Breakdown Fleet...") },
                  { label: "Share My Location", icon: MapPin, sub: "GPS Coordinates", action: () => alert("Location link copied to clipboard.") },
                  { label: "Find Workshop", icon: Car, sub: "Nearest Bay", action: () => alert("Searching authorized centers within 5 km...") },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.label}
                      onClick={t.action}
                      className="p-3 rounded-2xl neu-btn text-left flex flex-col justify-between h-20 active:scale-95"
                    >
                      <Icon className="w-4 h-4 text-rose-400" />
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{t.label}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{t.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Linked Vehicle Info Card */}
              <div className="p-3 rounded-2xl neu-inset-subtle flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Your Vehicle</span>
                  <p className="font-black text-white">{carTitle}</p>
                </div>
                <span className="font-mono text-cyan-400 text-[11px] bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  WB02AB1234
                </span>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* BOTTOM TACTILE NAVIGATION BAR */}
          {/* ==================================================== */}
          <div className="sticky bottom-0 w-full px-4 py-2 bg-[#090d18]/95 border-t border-slate-800/60 backdrop-blur-md flex items-center justify-between z-40">
            <button
              onClick={() => setCurrentScreen("home")}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                currentScreen === "home" ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentScreen("my-car")}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                currentScreen === "my-car" ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Car className="w-4 h-4" />
              <span>My Car</span>
            </button>

            {/* Quick Add Floating Action Center Button */}
            <button
              onClick={() => setShowQuickAdd(true)}
              className="w-12 h-12 -mt-5 rounded-full neu-btn-primary flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-95 transition-transform"
              title="Quick Add Menu"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>

            <button
              onClick={() => setCurrentScreen("drive")}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                currentScreen === "drive" ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Drive</span>
            </button>

            <button
              onClick={() => setCurrentScreen("emergency")}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                currentScreen === "emergency" ? "text-rose-400 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ADD ACTION SHEET MODAL */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl neu-card p-5 space-y-3 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
              <h3 className="text-sm font-bold text-white">Quick Add</h3>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Log Fuel Refill", icon: Fuel, onClick: () => { setShowQuickAdd(false); setCurrentScreen("expenses"); } },
                { label: "Add Expense", icon: CreditCard, onClick: () => { setShowQuickAdd(false); setCurrentScreen("expenses"); } },
                { label: "Visual Inspection", icon: Camera, onClick: () => { setShowQuickAdd(false); setCurrentScreen("inspection"); } },
                { label: "Start Drive Trip", icon: Compass, onClick: () => { setShowQuickAdd(false); setCurrentScreen("drive"); } },
                { label: "Ask AI Assistant", icon: Bot, onClick: () => { setShowQuickAdd(false); setCurrentScreen("assistant"); } },
                { label: "Add New Vehicle", icon: Plus, onClick: () => { setShowQuickAdd(false); onAddCar?.(); } },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.label}
                    onClick={act.onClick}
                    className="p-3 rounded-2xl neu-btn flex items-center gap-2.5 text-left text-slate-200 hover:text-white"
                  >
                    <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-[11px]">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
