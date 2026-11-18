"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useWatershed } from "../context/WatershedContext";

export default function MonitoringPage() {
  const { interventions, addIntervention } = useWatershed();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "Masonry Check Dam",
    location: "",
    status: "In Progress",
    progress: 50,
    date: "Est. Aug 2025",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location.trim()) return;

    addIntervention({
      type: form.type,
      location: form.location.trim(),
      status: form.status,
      progress: Number(form.progress),
      date: form.date.trim() || "Est. Sep 2025",
    });

    setForm({
      type: "Masonry Check Dam",
      location: "",
      status: "In Progress",
      progress: 50,
      date: "Est. Aug 2025",
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
                FIELD PROGRESS &amp; STRUCTURE INVENTORY
              </span>
              <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight">
                Monitoring &amp; Interventions
              </h1>
              <p className="text-xs text-[#5c6b62] mt-0.5">
                Live tracking of soil &amp; water conservation structures implemented across catchment sectors.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              + Log New Structure
            </button>
          </div>

          <div className="bg-white border border-[#e2e5e1] rounded-xl p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-[#1a1f1c] mb-4">
              Intervention Structure Log ({interventions.length} items)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#eef1ed] text-[#7c8b82]">
                    <th className="text-left font-semibold pb-3 pr-4">Structure ID</th>
                    <th className="text-left font-semibold pb-3 pr-4">Type</th>
                    <th className="text-left font-semibold pb-3 pr-4">Location</th>
                    <th className="text-left font-semibold pb-3 pr-4">Target Date</th>
                    <th className="text-left font-semibold pb-3 pr-4">Completion</th>
                    <th className="text-right font-semibold pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f6f3]">
                  {interventions.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fafbf9] transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-[#1e6641]">{item.id}</td>
                      <td className="py-3.5 pr-4 font-bold text-[#1a1f1c]">{item.type}</td>
                      <td className="py-3.5 pr-4 text-[#5c6b62]">{item.location}</td>
                      <td className="py-3.5 pr-4 text-[#7c8b82]">{item.date}</td>
                      <td className="py-3.5 pr-4 w-40">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[#e5e9e3] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1e6641] rounded-full" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span className="font-mono text-[11px] text-[#7c8b82]">{item.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.status === "In Progress"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Log New Structure Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-[#d8dcd6] shadow-2xl max-w-md w-full p-6 animate-fadeIn">
                <h3 className="text-sm font-bold text-[#1a1f1c] mb-1">Log New Conservation Structure</h3>
                <p className="text-xs text-[#7c8b82] mb-4">Record field engineering progress for soil &amp; water conservation.</p>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1a1f1c] mb-1">Structure Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                    >
                      <option value="Masonry Check Dam">Masonry Check Dam</option>
                      <option value="Continuous Contour Trenches">Continuous Contour Trenches</option>
                      <option value="Gully Plugging Units">Gully Plugging Units</option>
                      <option value="Farm Pond Excavation">Farm Pond Excavation</option>
                      <option value="Gabion Structure">Gabion Structure</option>
                      <option value="Sub-surface Earthen Bund">Sub-surface Earthen Bund</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1a1f1c] mb-1">Specific Field Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Upper Bhima Sector 4 Stream Bank"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1a1f1c] mb-1">Execution Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1a1f1c] mb-1">Target Completion Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Est. Sep 2025"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full border border-[#d8dcd6] rounded-lg px-3 py-2 bg-[#fafbf9]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#1a1f1c] mb-1">
                      <span>Progress Percentage</span>
                      <span className="font-mono text-[#1e6641]">{form.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={form.progress}
                      onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                      className="w-full accent-[#1e6641] cursor-pointer"
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
                      Save Structure
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
