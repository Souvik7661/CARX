import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CARX — AI-Powered Vehicle Intelligence & Decision Platform",
  description:
    "Know the car before you buy it. Independent vehicle intelligence synthesizing document OCR, computer vision damage analysis, chronological odometer verification, and actuarial market valuation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-slate-950 text-slate-100">
      <body className="min-h-screen flex flex-col bg-slate-950 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
