"use client";

import { useState } from "react";
import { useWatershed } from "../context/WatershedContext";

export default function WatershedsContent() {
  const { watersheds, addWatershed, deleteWatershed, setSelectedWatershed } = useWatershed();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    region: "",
    area: "",
    risk: "Moderate runoff",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addWatershed({
      name: form.name.trim(),
      region: form.region.trim() || "Western Ghats Drainage",
      area: form.area.trim().includes("km²") ? form.area.trim() : `${form.area.trim()} km²`,
      area_sqkm: parseFloat(form.area.replace(/[^0-9.]/g, "")) || 10000,
      risk: form.risk,
    });

    setForm({ name: "", region: "", area: "", risk: "Moderate runoff" });
    setShowAddModal(false);
  };

  const filtered = watersheds.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Search and Action Bar */}
      <div className="bg-white border border-[#e2e5e1] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <svg
            className="w-4 h-4 text-[#8fa396] absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search watershed basins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 text-xs font-semibold border border-[#d8dcd6] rounded-lg focus:outline-none focus:border-[#1e6641] bg-[#fafbf9] focus:bg-white w-72 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Watershed
          </button>
        </div>
      </div>

      {/* Watershed Table */}
      <div className="bg-white border border-[#e2e5e1] rounded-xl shadow-2xs overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-[#fafbf9] border-b border-[#eef1ed] text-[#7c8b82]">
            <tr>
              <th className="text-left font-bold px-5 py-3.5">Watershed Name</th>
              <th className="text-left font-bold px-4 py-3.5">Region</th>
              <th className="text-left font-bold px-4 py-3.5">Catchment Area</th>
              <th className="text-left font-bold px-4 py-3.5">Hydrological Risk</th>
              <th className="text-left font-bold px-4 py-3.5">Last Sync</th>
              <th className="text-right font-bold px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f6f3]">
            {filtered.map((ws) => (
              <tr key={ws.id} className="hover:bg-[#fafbf9] transition-colors">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#1a1f1c] text-[13px]">{ws.name}</p>
                </td>
                <td className="px-4 py-4 text-[#5c6b62]">{ws.region}</td>
                <td className="px-4 py-4 font-mono font-semibold text-[#1a1f1c]">{ws.area}</td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ws.riskBadge}`}>
                    {ws.risk}
                  </span>
                </td>
                <td className="px-4 py-4 text-[#7c8b82] font-medium">{ws.lastUpdated}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedWatershed(ws.name)}
                      className="text-xs font-bold text-[#1e6641] hover:underline cursor-pointer"
                    >
                      Select Active
                    </button>
                    <span className="text-[#e2e5e1]">·</span>
                    <button
                      onClick={() => deleteWatershed(ws.id)}
                      className="text-xs font-medium text-[#b91c1c] hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Watershed Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#d8dcd6] shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#eef1ed] mb-4">
              <h3 className="text-sm font-bold text-[#1a1f1c]">Register New Watershed Basin</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8fa396] hover:text-[#1a1f1c]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Watershed Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kukadi Valley Catchment"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Geographical Region</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmednagar District, Maharashtra"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full text-xs border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Catchment Area (km²)</label>
                  <input
                    type="text"
                    placeholder="e.g. 14,200 km²"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full text-xs border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Hydrological Risk</label>
                  <select
                    value={form.risk}
                    onChange={(e) => setForm({ ...form, risk: e.target.value })}
                    className="w-full text-xs border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                  >
                    <option value="High risk erosion">High risk erosion</option>
                    <option value="Moderate runoff">Moderate runoff</option>
                    <option value="Stable Drainage">Stable Drainage</option>
                    <option value="Critical Inundation">Critical Inundation</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eef1ed] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg"
                >
                  Save Watershed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
