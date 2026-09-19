import type { Metadata } from "next";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";

export const metadata: Metadata = {
  title: "DriveSense — A Smarter Way to Care for Your Car",
  description:
    "Track, Maintain, Diagnose, Save. Your car, always one step ahead. Live OBD-II diagnostics, vehicle health monitoring, service reminders, and expense telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-slate-950 text-slate-100">
      <body className="min-h-screen flex flex-col bg-slate-950 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}
