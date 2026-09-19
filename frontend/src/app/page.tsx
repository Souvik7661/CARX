"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  Bot,
  Activity,
  Wrench,
  CreditCard,
  FileText,
  MapPin,
  Users,
  Settings,
  Search,
  Bell,
  Sparkles,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Compass,
  Smartphone,
  Download
} from "lucide-react";

import {
  DriveSenseCar,
} from "@/lib/drivesense-types";

// DriveSense Cockpit Components (Neumorphic)
import ChassisWireframe from "@/components/drivesense/ChassisWireframe";
import HealthGauge from "@/components/drivesense/HealthGauge";
import UpcomingReminders from "@/components/drivesense/UpcomingReminders";
import MonthlyExpensesChart from "@/components/drivesense/MonthlyExpensesChart";
import QuickActions from "@/components/drivesense/QuickActions";
import MobileAppSuite from "@/components/drivesense/MobileAppSuite";

// DriveSense Modals
import AddCarModal from "@/components/drivesense/AddCarModal";
import AIAssistantModal from "@/components/drivesense/AIAssistantModal";
import DiagnosticsModal from "@/components/drivesense/DiagnosticsModal";
import ExpensesBreakdownModal from "@/components/drivesense/ExpensesBreakdownModal";
import BookServiceModal from "@/components/drivesense/BookServiceModal";

export default function DriveSenseDashboardPage() {
  // REQUIREMENT: "keep it like no cars have been added when the car will be uploaded the chrt will show accordingly"
  const [activeCar, setActiveCar] = useState<DriveSenseCar | null>(null);
  const [carsList, setCarsList] = useState<DriveSenseCar[]>([]);

  // Navigation and active view state: "cockpit" (desktop dashboard) vs "mobile" (8 screens mobile suite)
  const [viewMode, setViewMode] = useState<"cockpit" | "mobile">("cockpit");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLandingHero, setShowLandingHero] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Notifications popup
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState(false);
  const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
  const [isBookServiceModalOpen, setIsBookServiceModalOpen] = useState(false);

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add or update car
  const handleSaveCar = (newCar: DriveSenseCar) => {
    const existingIndex = carsList.findIndex((c) => c.id === newCar.id);
    if (existingIndex >= 0) {
      const updated = [...carsList];
      updated[existingIndex] = newCar;
      setCarsList(updated);
    } else {
      setCarsList((prev) => [newCar, ...prev]);
    }
    setActiveCar(newCar);
    triggerToast(`Vehicle ${newCar.brand} ${newCar.model} linked!`);
  };

  // Reset to empty state (for user testing)
  const handleResetToNoCars = () => {
    setActiveCar(null);
    setCarsList([]);
    triggerToast("Reset to empty state (no vehicles linked).");
  };

  // Dynamic greeting based on time of day
  const [greeting, setGreeting] = useState("Good Evening");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const navMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "mobile-suite", label: "Mobile App (8 Screens)", icon: Smartphone, badge: "NEW" },
    { id: "my-car", label: "My Vehicle", icon: Car },
    { id: "assistant", label: "AI Assistant", icon: Bot },
    { id: "diagnostics", label: "Health & Diagnostics", icon: Activity },
    { id: "service", label: "Service Booking", icon: Wrench },
    { id: "expenses", label: "Expenses & Fuel", icon: CreditCard },
    { id: "documents", label: "Car Documents", icon: FileText },
    { id: "nearby", label: "Workshops Nearby", icon: MapPin },
    { id: "community", label: "Owner Community", icon: Users },
    { id: "settings", label: "Preferences", icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);
    if (id === "mobile-suite") {
      setViewMode("mobile");
      return;
    }
    if (id === "dashboard") {
      setViewMode("cockpit");
      return;
    }
    if (id === "assistant") setIsAssistantModalOpen(true);
    else if (id === "diagnostics") setIsDiagnosticsModalOpen(true);
    else if (id === "service") setIsBookServiceModalOpen(true);
    else if (id === "expenses") setIsExpensesModalOpen(true);
    else if (id === "my-car") {
      setIsAddCarModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl neu-card border-cyan-500/50 text-cyan-200 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation Bar (Tactile Neumorphic) */}
      <header className="sticky top-0 z-40 w-full bg-[#0d121f]/95 border-b border-slate-800/40 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl neu-btn text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 neu-circle flex items-center justify-center text-cyan-400 shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 6a6 6 0 1 0 6 6" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                Drive<span className="text-cyan-400">Sense</span>
              </span>
            </Link>
          </div>

          {/* Center: Neumorphic Sunken Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search something... (e.g. service, mileage, expenses)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-inset text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Quick Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-13 left-0 w-full rounded-2xl neu-card p-2 z-50 text-xs space-y-1">
                <p className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Quick Consumer Shortcuts
                </p>
                <button
                  onMouseDown={() => setIsAssistantModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-xl neu-btn text-slate-200 flex items-center justify-between"
                >
                  <span>🤖 Ask AI Assistant about my car</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Assistant</span>
                </button>
                <button
                  onMouseDown={() => setIsDiagnosticsModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-xl neu-btn text-slate-200 flex items-center justify-between"
                >
                  <span>⚡ View Live OBD-II Diagnostic Telemetry</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Diagnostics</span>
                </button>
                <button
                  onMouseDown={() => setIsBookServiceModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-xl neu-btn text-slate-200 flex items-center justify-between"
                >
                  <span>🛠️ Book Periodic Maintenance Service</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Service</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Actions, Notifications & Profile Avatar */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Desktop Cockpit vs Mobile App (8 Screens) */}
            <div className="flex items-center gap-1 p-1 rounded-2xl neu-inset">
              <button
                onClick={() => {
                  setViewMode("cockpit");
                  setActiveTab("dashboard");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "cockpit"
                    ? "neu-btn-primary text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Switch to Desktop Cockpit Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cockpit</span>
              </button>

              <button
                onClick={() => {
                  setViewMode("mobile");
                  setActiveTab("mobile-suite");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "mobile"
                    ? "neu-btn-primary text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Switch to Mobile App View (8 Production Screens)"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mobile App</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[9px] font-mono font-black">8 UI</span>
              </button>
            </div>

            {/* Direct Download Mobile App ZIP Link */}
            <a
              href="/api/download-app"
              download="drivesense-mobile-app.zip"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl neu-btn text-cyan-300 text-xs font-bold hover:border-cyan-500/50 group"
              title="Download full React Native / Expo app source code as ZIP"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden lg:inline">Download App (ZIP)</span>
            </a>

            {/* View Mode Toggle: Landing Banner vs Cockpit */}
            <button
              onClick={() => setShowLandingHero(!showLandingHero)}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl neu-btn text-slate-300 text-xs font-semibold"
              title="Toggle Landing Overview mode"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showLandingHero ? "Hide Banner" : "Overview Banner"}</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-2xl neu-btn flex items-center justify-center text-slate-300 hover:text-white relative"
              >
                <Bell className="w-4 h-4" />
                {activeCar && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-[#0d121f]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 rounded-2xl neu-card p-4 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                    <h4 className="text-xs font-bold text-white">Notifications</h4>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {activeCar ? "3 Unread" : "0 Notifications"}
                    </span>
                  </div>
                  <div className="py-2 space-y-2 text-xs">
                    {activeCar ? (
                      <>
                        <div className="p-2.5 rounded-xl neu-inset-subtle">
                          <p className="font-semibold text-slate-200">Engine Oil Service Due</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Due in {activeCar.reminders[0]?.subtitle || "800 km"} for {activeCar.brand} {activeCar.model}.
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl neu-inset-subtle">
                          <p className="font-semibold text-slate-200">Monthly Expense Update</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            September total: ₹ {activeCar.expenses.currentMonthTotal.toLocaleString("en-IN")}.
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-400 text-center py-4">No notifications yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Badge (Souvik Kundu) */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-10 h-10 neu-circle flex items-center justify-center text-cyan-300 font-bold text-sm shadow-md">
                S
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Souvik Kundu</p>
                <p className="text-[10px] text-cyan-400 font-medium">Premium Member</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* OPTIONAL LANDING BANNER (Top-Left of reference design) */}
      {showLandingHero && (
        <section className="bg-[#0b0f1a] border-b border-slate-800/40 py-8 px-4 sm:px-8">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-pill text-cyan-400 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DriveSense Consumer Care</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                A Smarter, Simpler Way to Care for Your Car.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Track fuel costs, diagnose warning lights, and keep all your car service records in one tactile dashboard.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setIsAddCarModalOpen(true)}
                  className="px-6 py-3 rounded-2xl neu-btn-primary text-slate-950 font-bold text-xs tracking-wide flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsDiagnosticsModalOpen(true)}
                  className="px-5 py-3 rounded-2xl neu-btn text-slate-200 font-bold text-xs flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explore Telemetry</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { title: "Smart Upkeep", icon: Wrench, color: "text-cyan-400" },
                { title: "AI Assistant", icon: Bot, color: "text-blue-400" },
                { title: "Expense Log", icon: CreditCard, color: "text-purple-400" },
                { title: "Reminders", icon: Clock, color: "text-amber-400" },
                { title: "Live Sensors", icon: Activity, color: "text-emerald-400" },
                { title: "Documents", icon: FileText, color: "text-rose-400" },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="p-3.5 rounded-2xl neu-card-sm flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${f.color} shrink-0`} />
                    <p className="text-xs font-bold text-white">{f.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Workspace Body: Desktop Cockpit vs Mobile App Simulator (8 Screens) */}
      {viewMode === "mobile" ? (
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          <MobileAppSuite
            activeCar={activeCar}
            onAddCar={() => {
              setIsEditingCar(false);
              setIsAddCarModalOpen(true);
            }}
            onCloseMobileView={() => {
              setViewMode("cockpit");
              setActiveTab("dashboard");
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar Navigation (Tactile Neumorphic) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d121f] border-r border-slate-800/40 p-5 flex flex-col justify-between transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-6">
            <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white text-sm">Navigation</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-2">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "neu-btn-primary text-slate-950 font-bold"
                        : "neu-btn text-slate-300 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                        isActive ? "bg-slate-950 text-cyan-300" : "bg-cyan-400/20 text-cyan-300"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Mountain Card (Drive Safe. Go Further.) */}
          <div className="rounded-3xl neu-card p-4 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Drive Safe.
              </h4>
              <h5 className="text-xs font-black text-cyan-400 uppercase tracking-wider font-mono mb-2">
                Go Further.
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Live vehicle health monitoring keeps your family safe on every drive.
              </p>
              <button
                onClick={() => setIsDiagnosticsModalOpen(true)}
                className="w-full py-2 rounded-xl neu-btn text-cyan-300 text-xs font-bold"
              >
                Inspect Health &rarr;
              </button>
            </div>
          </div>
        </aside>

        {/* Main Cockpit Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Greeting & Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {greeting}, Souvik 👋
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeCar ? (
                  <>
                    Your <span className="text-cyan-400">{activeCar.brand} {activeCar.model}</span> is in {activeCar.healthStatus.toLowerCase()}!
                  </>
                ) : (
                  <>
                    Welcome to <span className="text-cyan-400">DriveSense</span>
                  </>
                )}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeCar
                  ? `Last updated: 19 Sep 2026, 6:24 PM • OBD-II Synced`
                  : "No vehicle connected yet. Add your car to unlock instant health insights."}
              </p>
            </div>

            {/* Motivational Quote & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 text-right">
              <div className="hidden sm:block">
                <p className="text-xs text-slate-400 italic">
                  &ldquo;A well-maintained car is a happier journey.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditingCar(false);
                    setIsAddCarModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl neu-btn-primary text-slate-950 font-bold text-xs tracking-wide"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Car</span>
                </button>

                {/* Car Switcher */}
                {carsList.length > 0 && (
                  <div className="relative group">
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl neu-btn text-slate-200 text-xs font-semibold">
                      <span>Switch ({carsList.length})</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <div className="absolute right-0 top-12 w-56 rounded-2xl neu-card p-2 hidden group-hover:block z-30 space-y-1">
                      {carsList.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveCar(c);
                            triggerToast(`Switched to ${c.brand} ${c.model}`);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                            activeCar?.id === c.id
                              ? "neu-btn-primary text-slate-950"
                              : "neu-btn text-slate-300"
                          }`}
                        >
                          <div>
                            <p>{c.brand} {c.model}</p>
                            <span className="text-[10px] font-mono opacity-80">{c.healthScore}% Health</span>
                          </div>
                          <span className="text-[10px] uppercase font-mono">{c.fuelType}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset to Empty State Button */}
                {activeCar && (
                  <button
                    onClick={handleResetToNoCars}
                    className="p-2.5 rounded-2xl neu-btn text-slate-400 hover:text-rose-400"
                    title="Reset dashboard to empty state"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main 2-Column Row: Vehicle Overview & Car Health */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Vehicle Overview (Chassis Wireframe - NO CAR PHOTOS) */}
            <div className="lg:col-span-7">
              <ChassisWireframe
                car={activeCar}
                onAddCarClick={() => {
                  setIsEditingCar(false);
                  setIsAddCarModalOpen(true);
                }}
                onEditClick={() => {
                  setIsEditingCar(true);
                  setIsAddCarModalOpen(true);
                }}
                onSwitchCar={() => setIsAddCarModalOpen(true)}
              />
            </div>

            {/* Right: Car Health Ring Gauge (Neumorphic Inset Well) */}
            <div className="lg:col-span-5">
              <HealthGauge
                car={activeCar}
                onViewDetails={() => setIsDiagnosticsModalOpen(true)}
              />
            </div>
          </div>

          {/* Bottom 3-Column Row: Reminders, Expenses, Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <UpcomingReminders
                car={activeCar}
                onViewAll={() => setIsBookServiceModalOpen(true)}
                onBookService={() => setIsBookServiceModalOpen(true)}
              />
            </div>

            <div className="lg:col-span-4">
              <MonthlyExpensesChart
                car={activeCar}
                onViewBreakdown={() => setIsExpensesModalOpen(true)}
              />
            </div>

            <div className="lg:col-span-4 md:col-span-2">
              <QuickActions
                isCarConnected={!!activeCar}
                onLogFuel={() => {
                  if (!activeCar) setIsAddCarModalOpen(true);
                  else triggerToast("Fuel logged: 38.5 Liters (Mileage updated)");
                }}
                onAddExpense={() => {
                  if (!activeCar) setIsAddCarModalOpen(true);
                  else setIsExpensesModalOpen(true);
                }}
                onBookService={() => setIsBookServiceModalOpen(true)}
                onUploadDocument={() => {
                  triggerToast("Document manager opened (RC, Insurance, PUC)");
                }}
                onFindServiceCenter={() => setIsBookServiceModalOpen(true)}
                onRunDiagnostics={() => setIsDiagnosticsModalOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>
      )}

      {/* MODALS */}
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onSaveCar={handleSaveCar}
        initialCar={isEditingCar ? activeCar : null}
      />

      <AIAssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        car={activeCar}
      />

      <DiagnosticsModal
        isOpen={isDiagnosticsModalOpen}
        onClose={() => setIsDiagnosticsModalOpen(false)}
        car={activeCar}
      />

      <ExpensesBreakdownModal
        isOpen={isExpensesModalOpen}
        onClose={() => setIsExpensesModalOpen(false)}
        car={activeCar}
      />

      <BookServiceModal
        isOpen={isBookServiceModalOpen}
        onClose={() => setIsBookServiceModalOpen(false)}
        car={activeCar}
      />
    </div>
  );
}
