"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useWatershed } from "../context/WatershedContext";

export default function VegetationPage() {
  const { observations, selectedWatershed } = useWatershed();
  const vegGroups = observations.reduce<Record<string, { count: number; confidence: number }>>((acc, obs) => {
    const key = obs.vegetation || "Unclassified";
    if (!acc[key]) acc[key] = { count: 0, confidence: 0 };
    acc[key].count += 1;
    acc[key].confidence += obs.confidence || 0;
    return acc;
  }, {});
  const vegZones = Object.entries(vegGroups).map(([zone, stats]) => ({
    zone,
    meanConfidence: stats.count ? Math.round(stats.confidence / stats.count) : 0,
    count: stats.count,
  }));
  const meanConfidence = observations.length
    ? Math.round(observations.reduce((sum, o) => sum + (o.confidence || 0), 0) / observations.length)
    : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto space-y-6 max-w-6xl">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#1e6641] uppercase">
              SPECTRAL BIOMASS INDEXING
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight">
              Vegetation &amp; Canopy Health (NDVI)
            </h1>
            <p className="text-xs text-[#5c6b62] mt-0.5">
              Vegetation classes from logged observations{selectedWatershed ? ` for ${selectedWatershed}` : ""}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e2e5e1] rounded-xl p-5 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#7c8b82] uppercase">Sites logged</span>
              <p className="text-2xl font-bold text-[#1e6641] mt-2">{observations.length}</p>
            </div>
            <div className="bg-white border border-[#e2e5e1] rounded-xl p-5 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#7c8b82] uppercase">Mean confidence</span>
              <p className="text-2xl font-bold text-[#1a1f1c] mt-2">{meanConfidence != null ? `${meanConfidence}%` : "—"}</p>
            </div>
            <div className="bg-white border border-[#e2e5e1] rounded-xl p-5 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#7c8b82] uppercase">Vegetation classes</span>
              <p className="text-2xl font-bold text-[#1a1f1c] mt-2">{vegZones.length}</p>
            </div>
          </div>

          <div className="bg-white border border-[#e2e5e1] rounded-xl p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-[#1a1f1c] mb-4">Zonal vegetation from field notes</h2>
            {vegZones.length === 0 ? (
              <p className="text-sm text-[#5c6b62]">No vegetation observations yet.</p>
            ) : (
              <div className="divide-y divide-[#f0f3ef]">
                {vegZones.map((z) => (
                  <div key={z.zone} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1a1f1c]">{z.zone}</p>
                      <p className="text-[11px] text-[#7c8b82]">{z.count} site{z.count === 1 ? "" : "s"}</p>
                    </div>
                    <span className="font-mono font-bold text-[#1e6641] text-xs">Avg confidence {z.meanConfidence}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
