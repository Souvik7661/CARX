import React from "react";
import MobileAppSuite from "@/components/drivesense/MobileAppSuite";

export default async function MobilePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string; carTab?: string; quickAdd?: string }>;
}) {
  const resolvedParams = await searchParams;
  const screen = (resolvedParams?.screen as any) || "home";
  const carTab = resolvedParams?.carTab as any;
  const quickAdd = resolvedParams?.quickAdd === "true";

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center p-2 sm:p-4 text-slate-100">
      <MobileAppSuite
        activeCar={null}
        initialScreen={screen}
        initialCarTab={carTab}
        initialQuickAdd={quickAdd}
      />
    </div>
  );
}
