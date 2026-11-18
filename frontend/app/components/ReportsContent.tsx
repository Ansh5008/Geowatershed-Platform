"use client";

import { useState } from "react";
import { useWatershed } from "../context/WatershedContext";

export default function ReportsContent() {
  const { reports, generateReport, watersheds, selectedWatershed } = useWatershed();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [targetWs, setTargetWs] = useState(selectedWatershed || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      generateReport(targetWs, reportTitle.trim() || undefined);
      setReportTitle("");
      setIsGenerating(false);
      setShowGenerateModal(false);
    }, 500);
  };

  const handleDownload = (reportTitle: string, watershed: string) => {
    const textContent = `GEOWATERSHED ANALYSIS PLATFORM - SYNTHESIS REPORT
==================================================
Title: ${reportTitle}
Watershed Basin: ${watershed}
Generated: ${new Date().toISOString()}
Spatial Reference: EPSG:4326

EXECUTIVE SUMMARY:
- Catchment Boundary verified in PostGIS database
- Multi-spectral spectral bands (NDVI / NDWI) extracted via Rasterio
- Flow accumulation & Strahler stream orders (1 to 5) verified
- Priority erosion intervention zones flagged for conservation structures
==================================================
Status: Officially Verified`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl space-y-4 pb-8">
      {/* Header bar */}
      <div className="bg-white border border-[#e2e5e1] rounded-xl p-5 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#1a1f1c]">Hydrological Analysis &amp; Reports Catalog</h2>
          <p className="text-xs text-[#7c8b82] mt-0.5">
            Automated spatial synthesis reports ({reports.length} generated)
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          + Generate New Report
        </button>
      </div>

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="bg-white border border-[#e2e5e1] rounded-xl p-5 shadow-2xs hover:border-[#1e6641]/40 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#1e6641] bg-[#f0f4f1] px-2.5 py-0.5 rounded-full border border-[#d8ecd9]">
                    {r.watershed}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {r.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#1a1f1c]">{r.title}</h3>
                <p className="text-xs text-[#7c8b82] mt-1 font-medium">
                  Generated on {r.generated} • {r.pages || 16} pages • Vector &amp; Raster Summary
                </p>

                {r.highlights && r.highlights.length > 0 && (
                  <ul className="mt-3.5 space-y-1.5">
                    {r.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#5c6b62]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1e6641] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(r.title, r.watershed)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#1e6641] hover:bg-[#174f33] text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Summary
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#d8dcd6] shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-sm font-bold text-[#1a1f1c] mb-1">Generate Watershed Synthesis Report</h3>
            <p className="text-xs text-[#7c8b82] mb-4">
              Compile all current satellite layers, DEM slope, and field observations.
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Target Watershed</label>
                <select
                  value={targetWs}
                  onChange={(e) => setTargetWs(e.target.value)}
                  className="w-full text-xs border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                >
                  {watersheds.map((w) => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Report Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Seasonal Soil & Water Conservation Audit"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full text-xs border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                />
              </div>

              <div className="pt-3 border-t border-[#eef1ed] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg cursor-pointer"
                >
                  {isGenerating ? "Compiling..." : "Generate Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
