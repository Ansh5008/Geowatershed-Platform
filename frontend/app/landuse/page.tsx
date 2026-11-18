"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useWatershed } from "../context/WatershedContext";

const COLORS = ["#65a30d", "#16a34a", "#eab308", "#15803d", "#0284c7", "#64748b"];

export default function LandUsePage() {
  const { observations, selectedWatershed, watersheds } = useWatershed();
  const active = watersheds.find((w) => w.name === selectedWatershed);
  const totals = observations.reduce<Record<string, number>>((acc, obs) => {
    const key = obs.landUse || "Unclassified";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const totalCount = observations.length;
  const landUseData = Object.entries(totals).map(([category, count], i) => ({
    category,
    area: count,
    pct: totalCount ? `${((count / totalCount) * 100).toFixed(1)}%` : "0%",
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto space-y-6 max-w-6xl">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#1e6641] uppercase">
              CATCHMENT SPATIAL COMPOSITION
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight">
              Land Use &amp; Land Cover Analysis
            </h1>
            <p className="text-xs text-[#5c6b62] mt-0.5">
              Classification from logged field observations
              {selectedWatershed ? ` for ${selectedWatershed}` : ""}.
              {active?.area && active.area !== "—" ? ` Catchment area ${active.area}.` : ""}
            </p>
          </div>

          {landUseData.length === 0 ? (
            <div className="bg-white border border-[#e2e5e1] rounded-xl p-8 text-sm text-[#5c6b62]">
              No land-use observations yet. Log field observations from the dashboard or map to populate this analysis.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-[#e2e5e1] rounded-xl p-6 shadow-2xs">
                <h2 className="text-sm font-bold text-[#1a1f1c] mb-1">Observation counts by land use</h2>
                <p className="text-xs text-[#7c8b82] mb-5">Derived from user-logged surveys, not a static file catalog</p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={landUseData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f3ef" />
                      <XAxis type="number" tick={{ fill: "#7c8b82", fontSize: 11 }} allowDecimals={false} />
                      <YAxis dataKey="category" type="category" tick={{ fill: "#2d3831", fontSize: 11 }} width={140} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #e2e5e1" }}
                        formatter={(val) => [`${Number(val).toLocaleString()} observations`, "Count"]}
                      />
                      <Bar dataKey="area" fill="#1e6641" radius={[0, 6, 6, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-[#e2e5e1] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#1a1f1c] uppercase tracking-wider mb-4 pb-2 border-b border-[#f0f3ef]">
                    Class share
                  </h3>
                  <div className="space-y-3">
                    {landUseData.map((item) => (
                      <div key={item.category} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: item.color }} />
                          <span className="font-medium text-[#2d3831]">{item.category}</span>
                        </div>
                        <span className="font-bold text-[#1a1f1c]">{item.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-[#f0f3ef] text-[11px] text-[#7c8b82]">
                  {totalCount} classified observations
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
