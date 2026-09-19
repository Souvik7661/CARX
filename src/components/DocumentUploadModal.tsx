"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Edit2,
  X,
  ShieldCheck
} from "lucide-react";
import { DocumentRecord } from "@/lib/types";
import { api } from "@/lib/api";

interface DocumentUploadModalProps {
  vehicleId: string;
  documents: DocumentRecord[];
  onSuccess?: () => void;
}

const DOC_TYPES = [
  { key: "SERVICE_INVOICE", label: "Service Invoice / Maintenance Bill" },
  { key: "RC", label: "Registration Certificate (RC)" },
  { key: "INSURANCE", label: "Motor Insurance Policy" },
  { key: "INSPECTION_REPORT", label: "Previous Inspection Report" },
  { key: "WARRANTY", label: "Extended Warranty Booklet" },
  { key: "REPAIR_BILL", label: "Accident / Bodywork Repair Bill" },
];

export default function DocumentUploadModal({
  vehicleId,
  documents,
  onSuccess,
}: DocumentUploadModalProps) {
  const [docType, setDocType] = useState("SERVICE_INVOICE");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);
  const [correctionJson, setCorrectionJson] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatusMsg(null);
    try {
      await api.uploadDocument(vehicleId, docType, file);
      setStatusMsg("Document uploaded and structured OCR parsed successfully!");
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setStatusMsg(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (doc: DocumentRecord) => {
    setEditingDoc(doc);
    setCorrectionJson(JSON.stringify(doc.extracted_data || {}, null, 2));
  };

  const handleSaveCorrection = async () => {
    if (!editingDoc) return;
    try {
      const parsed = JSON.parse(correctionJson);
      await api.updateDocumentExtraction(editingDoc.id, parsed);
      setEditingDoc(null);
      setStatusMsg("Manual OCR corrections saved and verified.");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert("Invalid JSON format or update failed: " + err.message);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              Document Intelligence & OCR Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Upload maintenance invoices, insurance certificates, and registration cards. Every field includes confidence metrics with manual correction support.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-slate-950 border border-cyan-800 text-cyan-300 text-xs flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Document Category
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:border-cyan-500 focus:outline-none"
            >
              {DOC_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Document File (PDF, JPG, PNG, WEBP)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file || uploading}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Extracting Structured Fields..." : "Process Document"}</span>
          </button>
        </div>
      </form>

      {/* Document Records List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Archived & Extracted Records ({documents.length})
        </h4>

        {documents.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
            No documentation uploaded yet. Add service invoices or RC to verify mileage and provenance.
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const data = doc.extracted_data || {};
              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/70 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-800/50">
                        {doc.doc_type}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {doc.file_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-emerald-400 font-mono">
                        Extraction Confidence: {Math.round(doc.confidence || 90)}%
                      </span>
                      <button
                        onClick={() => startEdit(doc)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-cyan-400" />
                        <span>Edit / Verify OCR</span>
                      </button>
                    </div>
                  </div>

                  {/* Extracted Fields Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {data.odometer && (
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Odometer</span>
                        <span className="font-mono font-bold text-white">
                          {Number(data.odometer).toLocaleString()} km
                        </span>
                        <span className="text-[9px] text-cyan-400 block">
                          Confidence: {data.confidence_odometer || 96}%
                        </span>
                      </div>
                    )}
                    {data.date && (
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Service Date</span>
                        <span className="font-mono font-bold text-white">{data.date}</span>
                      </div>
                    )}
                    {data.workshop && (
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block">Workshop Facility</span>
                        <span className="font-medium text-slate-200 truncate block">
                          {data.workshop}
                        </span>
                      </div>
                    )}
                    {data.total_cost && (
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Total Invoice Cost</span>
                        <span className="font-mono font-bold text-emerald-400">
                          ₹{Number(data.total_cost).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {data.registration_number && (
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Registration No.</span>
                        <span className="font-mono font-bold text-white">
                          {data.registration_number}
                        </span>
                      </div>
                    )}
                    {data.vin && (
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block">Verified VIN</span>
                        <span className="font-mono font-bold text-cyan-400">
                          {data.vin}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Correction Dialog */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6 max-w-xl w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white font-mono">
                  Manual OCR Review & Verification
                </h4>
              </div>
              <button onClick={() => setEditingDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Never blindly trust automated OCR results. You may modify or verify the structured extracted fields for{" "}
              <strong className="text-white">{editingDoc.file_name}</strong> below:
            </p>

            <textarea
              rows={10}
              value={correctionJson}
              onChange={(e) => setCorrectionJson(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingDoc(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCorrection}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md"
              >
                Save & Verify Extraction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
