"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useWatershed } from "../context/WatershedContext";

export default function DrainagePage() {
  const { observations, selectedWatershed } = useWatershed();
  const erosionGroups = observations.reduce<Record<string, number>>((acc, obs) => {
    const key = obs.erosion || "Unassessed";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(erosionGroups).map(([order, count]) => ({
    order,
    count: `${count} site${count === 1 ? "" : "s"}`,
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto space-y-6 max-w-6xl">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#1e6641] uppercase">
              HYDROLOGICAL FLOW ACCUMULATION
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight">
              Drainage Network &amp; Stream Orders
            </h1>
            <p className="text-xs text-[#5c6b62] mt-0.5">
              Drainage-related field sites{selectedWatershed ? ` in ${selectedWatershed}` : ""}. Upload DEM rasters and process them to replace this with extracted stream orders.
            </p>
          </div>

          <div className="bg-white border border-[#e2e5e1] rounded-xl p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-[#1a1f1c] mb-4">Erosion sites from logged observations</h2>
            {rows.length === 0 ? (
              <p className="text-sm text-[#5c6b62]">No drainage observations yet. Add field sites from the map or dashboard.</p>
            ) : (
              <div className="divide-y divide-[#f0f3ef]">
                {rows.map((s) => (
                  <div key={s.order} className="py-4 flex items-center justify-between">
                    <p className="text-xs font-bold text-[#1a1f1c]">{s.order}</p>
                    <span className="font-mono font-bold text-[#1e6641] bg-[#f0f4f1] px-2.5 py-1 rounded-full text-xs">
                      {s.count}
                    </span>
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
