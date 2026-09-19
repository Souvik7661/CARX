"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // On root "/", render the dedicated DriveSense cockpit full-bleed
  const isDriveSenseDashboard = pathname === "/";

  if (isDriveSenseDashboard) {
    return (
      <SmoothScrollProvider>
        <main className="flex-1 min-h-screen bg-[#0d121f] text-slate-100 antialiased">
          {children}
        </main>
      </SmoothScrollProvider>
    );
  }

  return (
    <SmoothScrollProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
