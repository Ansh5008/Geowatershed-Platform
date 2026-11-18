"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Link from "next/link";
import { useWatershed } from "../context/WatershedContext";

export default function PriorityZonesPage() {
  const { zones, addZone } = useWatershed();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    area: "",
    slope: "",
    erosionRate: "",
    risk: "High risk",
    structuresNeeded: "",
    budgetEst: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addZone({
      id: `PZ-0${zones.length + 1}`,
      name: form.name.trim(),
      area: form.area.trim() ? (form.area.includes("km²") ? form.area : `${form.area} km²`) : "450 km²",
      slope: form.slope.trim() ? (form.slope.includes("°") ? form.slope : `${form.slope}° avg`) : "18° avg",
      erosionRate: form.erosionRate.trim() ? form.erosionRate : "24 t/ha/yr",
      risk: form.risk,
      structuresNeeded: form.structuresNeeded.trim() || "Masonry check dams & contour trenches",
      budgetEst: form.budgetEst.trim() || "₹25.0 Lakhs",
    });

    setForm({
      name: "",
      area: "",
      slope: "",
      erosionRate: "",
      risk: "High risk",
      structuresNeeded: "",
      budgetEst: "",
    });
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto space-y-6 max-w-6xl">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#1e6641] uppercase">
                TARGETED WATERSHED TREATMENT
              </span>
              <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight">
                Priority Intervention Zones
              </h1>
              <p className="text-xs text-[#5c6b62] mt-0.5">
                Catchment parcels ranked by revised universal soil loss equation (RUSLE) and DEM slope severity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-xs font-semibold text-[#2d3831] bg-white border border-[#d8dcd6] rounded-lg hover:bg-[#f7f8f6] transition-colors shadow-2xs cursor-pointer flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-[#1e6641]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                + Add Priority Zone
              </button>

              <Link
                href="/map"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm"
              >
                View on GIS Map →
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {zones.map((z) => (
              <div key={z.id} className="bg-white border border-[#e2e5e1] rounded-xl p-5 shadow-2xs hover:border-[#1e6641]/50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-[#1e6641] bg-[#f0f4f1] px-2 py-0.5 rounded">
                        {z.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${z.badge}`}>
                        {z.risk}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1a1f1c]">{z.name}</h3>
                    <p className="text-xs text-[#5c6b62] mt-1">
                      Recommended treatment: <span className="text-[#1a1f1c] font-semibold">{z.structuresNeeded}</span>
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-[#f0f3ef] text-xs">
                      <div>
                        <span className="text-[10px] text-[#7c8b82]">Area</span>
                        <p className="font-semibold text-[#1a1f1c]">{z.area}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7c8b82]">Mean Slope</span>
                        <p className="font-semibold text-[#1a1f1c]">{z.slope}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7c8b82]">Est. Soil Loss</span>
                        <p className="font-semibold text-[#b91c1c]">{z.erosionRate}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7c8b82]">Treatment Budget</span>
                        <p className="font-semibold text-[#1e6641]">{z.budgetEst}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Zone Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-[#d8dcd6] shadow-2xl max-w-md w-full p-6 animate-fadeIn">
                <h3 className="text-sm font-bold text-[#1a1f1c] mb-1">Add Priority Intervention Zone</h3>
                <p className="text-xs text-[#7c8b82] mb-4">Define a new critical catchment parcel requiring soil/water structures.</p>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1a1f1c] mb-1">Zone Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kukadi Valley Steep Slope Parcel"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1a1f1c] mb-1">Catchment Area</label>
                      <input
                        type="text"
                        placeholder="e.g. 520 km²"
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1a1f1c] mb-1">Erosion Severity</label>
                      <select
                        value={form.risk}
                        onChange={(e) => setForm({ ...form, risk: e.target.value })}
                        className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High risk">High risk</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low risk">Low risk</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1a1f1c] mb-1">Mean Slope</label>
                      <input
                        type="text"
                        placeholder="e.g. 19.5° avg"
                        value={form.slope}
                        onChange={(e) => setForm({ ...form, slope: e.target.value })}
                        className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1a1f1c] mb-1">Estimated Budget</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹32.0 Lakhs"
                        value={form.budgetEst}
                        onChange={(e) => setForm({ ...form, budgetEst: e.target.value })}
                        className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1f1c] mb-1">Recommended Conservation Structures</label>
                    <input
                      type="text"
                      placeholder="e.g. Continuous contour trenching, 5 check dams"
                      value={form.structuresNeeded}
                      onChange={(e) => setForm({ ...form, structuresNeeded: e.target.value })}
                      className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#eef1ed] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 font-semibold text-[#5c6b62]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg cursor-pointer"
                    >
                      Save Priority Zone
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
