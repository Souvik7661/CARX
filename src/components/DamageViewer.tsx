"use client";

import React, { useState } from "react";
import {
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  Maximize2,
  Sparkles,
  ShieldAlert,
  Sliders
} from "lucide-react";
import { VehicleImage, DamageFinding } from "@/lib/types";
import { api } from "@/lib/api";

interface DamageViewerProps {
  vehicleId: string;
  images: VehicleImage[];
  damages: DamageFinding[];
  onUploadSuccess?: () => void;
}

const ANGLES = [
  { key: "front", label: "Front Exterior" },
  { key: "rear", label: "Rear Exterior" },
  { key: "left", label: "Left Profile" },
  { key: "right", label: "Right Profile" },
  { key: "interior", label: "Cabin & Seats" },
  { key: "engine", label: "Engine Bay & Aprons" },
  { key: "tyres", label: "Tyre Tread Profile" },
  { key: "dashboard", label: "Dashboard Cluster" },
  { key: "closeup", label: "Defect Close-up" },
];

export default function DamageViewer({
  vehicleId,
  images,
  damages,
  onUploadSuccess,
}: DamageViewerProps) {
  const [selectedAngle, setSelectedAngle] = useState<string>("front");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Find image for currently selected angle or fallback
  const activeImage = images.find(
    (img) => img.angle.toLowerCase() === selectedAngle.toLowerCase()
  ) || images[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      await api.uploadImage(vehicleId, selectedAngle, file);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload and analyze image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Computer Vision Damage & Panel Inspection
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Automated multi-angle cosmetic and panel alignment scan. Uses non-assertive probabilistic defect tagging.
          </p>
        </div>

        {/* Upload Action */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95">
          <Upload className="w-4 h-4" />
          <span>{uploading ? "Analyzing Image..." : `Add ${ANGLES.find(a => a.key === selectedAngle)?.label || 'Photo'}`}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs">
          {uploadError}
        </div>
      )}

      {/* Angle Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {ANGLES.map((angle) => {
          const hasImage = images.some(
            (img) => img.angle.toLowerCase() === angle.key.toLowerCase()
          );
          const isSelected = selectedAngle === angle.key;

          return (
            <button
              key={angle.key}
              onClick={() => setSelectedAngle(angle.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                  : hasImage
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-750"
                  : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${hasImage ? "bg-emerald-400" : "bg-slate-600"}`} />
              {angle.label}
            </button>
          );
        })}
      </div>

      {/* Image Preview & Damage Annotation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Canvas */}
        <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] flex items-center justify-center group">
          {activeImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.image_url}
                alt="Vehicle perspective"
                className="w-full h-full object-cover"
              />

              {/* Simulated Hotspot Overlays */}
              {activeImage.detected_damages?.map((d: any, idx: number) => {
                const coords = d.bbox_coords ? d.bbox_coords.split(",").map(Number) : [40, 40, 20, 20];
                return (
                  <div
                    key={idx}
                    className="absolute border-2 border-dashed border-amber-400/80 bg-amber-500/15 rounded pointer-events-none"
                    style={{
                      left: `${coords[0]}%`,
                      top: `${coords[1]}%`,
                      width: `${coords[2]}%`,
                      height: `${coords[3]}%`,
                    }}
                  >
                    <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-bold uppercase font-mono">
                      {d.panel} ({Math.round((d.confidence || 0.85) * 100)}%)
                    </span>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-950/80 text-white font-mono text-[10px] backdrop-blur-sm border border-slate-800">
                Angle: {activeImage.angle.toUpperCase()}
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">
                No photo uploaded for {ANGLES.find(a => a.key === selectedAngle)?.label}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Upload a photo to detect clear-coat scratches, panel gaps, dents, or tyre tread wear.
              </p>
            </div>
          )}
        </div>

        {/* Damage Findings Log */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detected Visual Findings ({damages.length})
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Model: CV-ResNet/YOLO
            </span>
          </div>

          {damages.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No Visible Panel Defects Tagged</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Visual inspection shows exterior panels and tyre profiles within standard tolerances.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
              {damages.map((finding) => {
                const isHigh = finding.severity === "HIGH";
                const isMedium = finding.severity === "MEDIUM";

                return (
                  <div
                    key={finding.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">
                        {finding.panel}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isHigh
                            ? "bg-red-950 text-red-400 border border-red-800/60"
                            : isMedium
                            ? "bg-amber-950 text-amber-400 border border-amber-800/60"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {finding.severity} Severity
                      </span>
                    </div>

                    <p className="text-xs text-cyan-300 font-medium">
                      {finding.damage_type}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/50">
                      <span>Confidence: {Math.round(finding.confidence * 100)}%</span>
                      <span className="italic text-slate-400 text-[10px]">
                        Probabilistic Inference
                      </span>
                    </div>

                    {finding.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-1.5 rounded">
                        &ldquo;{finding.notes}&rdquo;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
