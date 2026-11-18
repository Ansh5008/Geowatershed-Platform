"use client";

import { useState, useRef } from "react";
import { useWatershed } from "../context/WatershedContext";

export default function UploadContent() {
  const { watersheds, images, addImages, selectedWatershed } = useWatershed();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [targetWatershed, setTargetWatershed] = useState(selectedWatershed || "");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleUploadSubmit = () => {
    if (files.length === 0 || !targetWatershed) return;
    setUploading(true);

    setTimeout(() => {
      addImages(
        files.map((f) => ({
          name: f.name,
          size: f.size,
          watershed: targetWatershed,
          file: f,
        }))
      );
      setFiles([]);
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-5xl space-y-6 pb-8">
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-[#1e6641] uppercase">
          RASTER &amp; SATELLITE MANAGEMENT
        </span>
        <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight">
          Image Ingestion Workspace
        </h1>
        <p className="text-xs text-[#5c6b62] mt-0.5">
          Upload and georeference satellite tiles, DEM elevation rasters, and field drone surveys.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white border border-[#e2e5e1] rounded-xl p-6 shadow-2xs">
        <div className="mb-4">
          <label className="block text-xs font-bold text-[#1a1f1c] mb-1.5 uppercase tracking-wider">
            Target Watershed Catchment
          </label>
          <select
            value={targetWatershed}
            onChange={(e) => setTargetWatershed(e.target.value)}
            className="w-full text-xs font-medium border border-[#d8dcd6] rounded-lg px-3.5 py-2.5 text-[#1a1f1c] bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641] transition-all"
          >
            <option value="">Select target watershed...</option>
            {watersheds.map((w) => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging
              ? "border-[#1e6641] bg-[#f0f4f1]"
              : "border-[#d8dcd6] bg-[#fafbf9] hover:bg-white hover:border-[#b0baa9]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".tif,.tiff,.jpg,.jpeg,.png,.geojson"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f0f4f1] text-[#1e6641] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1f1c]">
                Drop imagery files here, or <span className="text-[#1e6641] underline">browse computer</span>
              </p>
              <p className="text-xs text-[#7c8b82] mt-1">
                GeoTIFF (.tif), Sentinel L2A, Landsat 8/9, SRTM DEM, Drone Orthos • Max 2 GB
              </p>
            </div>
          </div>
        </div>

        {/* Staged files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="bg-[#f7f8f6] border border-[#e8ece5] rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1e6641]/10 text-[#1e6641] flex items-center justify-center font-bold text-xs">
                    TIF
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1a1f1c]">{file.name}</p>
                    <p className="text-[11px] text-[#7c8b82]">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-[#8fa396] hover:text-[#b91c1c] p-1 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <button
              onClick={handleUploadSubmit}
              disabled={!targetWatershed || uploading}
              className="mt-3 w-full py-2.5 text-xs font-semibold rounded-lg bg-[#1e6641] hover:bg-[#174f33] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {uploading ? (
                <span>Ingesting rasters into PostGIS...</span>
              ) : (
                <span>Upload and Ingest ({files.length} {files.length === 1 ? "raster" : "rasters"})</span>
              )}
            </button>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Rasters successfully ingested and added to catalog!</span>
          </div>
        )}
      </div>

      {/* Uploads history */}
      <div className="bg-white border border-[#e2e5e1] rounded-xl p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-[#1a1f1c] mb-4">
          Ingested Imagery Catalog ({images.length} records)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#eef1ed] text-[#7c8b82]">
                <th className="text-left font-semibold pb-3 pr-4">Raster Name</th>
                <th className="text-left font-semibold pb-3 pr-4">Watershed</th>
                <th className="text-left font-semibold pb-3 pr-4">Capture Date</th>
                <th className="text-left font-semibold pb-3 pr-4">File Size</th>
                <th className="text-left font-semibold pb-3 pr-4">Status</th>
                <th className="text-right font-semibold pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f6f3]">
              {images.map((u) => (
                <tr key={u.id} className="hover:bg-[#fafbf9] transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-[#1a1f1c] truncate max-w-[240px]">
                    {u.name}
                  </td>
                  <td className="py-3.5 pr-4 text-[#5c6b62]">{u.watershed}</td>
                  <td className="py-3.5 pr-4 text-[#7c8b82]">{u.date}</td>
                  <td className="py-3.5 pr-4 font-mono text-[#5c6b62]">{u.size}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.badge}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-xs font-semibold text-[#1e6641] hover:underline cursor-pointer">
                      View Footprint →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
