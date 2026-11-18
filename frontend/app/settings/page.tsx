"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";

export default function SettingsPage() {
  const [dbHost, setDbHost] = useState("localhost:5432");
  const [dbName, setDbName] = useState("watershed");
  const [procUrl, setProcUrl] = useState("http://localhost:8000");
  const [crs, setCrs] = useState("EPSG:4326");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto space-y-6 max-w-4xl">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#1e6641] uppercase">
              PLATFORM CONFIGURATION
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight">
              System Settings
            </h1>
            <p className="text-xs text-[#5c6b62] mt-0.5">
              Manage PostGIS connections, Python processing microservice endpoints, and default CRS projections.
            </p>
          </div>

          <form onSubmit={handleSave} className="bg-white border border-[#e2e5e1] rounded-xl p-6 shadow-2xs space-y-5">
            <h2 className="text-sm font-bold text-[#1a1f1c] pb-3 border-b border-[#f0f3ef]">
              Spatial Database &amp; Microservice Endpoints
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">PostGIS Host</label>
                <input
                  type="text"
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  className="w-full text-xs font-mono border border-[#d8dcd6] rounded-lg px-3 py-2 text-[#1a1f1c] bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Database Name</label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full text-xs font-mono border border-[#d8dcd6] rounded-lg px-3 py-2 text-[#1a1f1c] bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Python Processing Service URL</label>
                <input
                  type="text"
                  value={procUrl}
                  onChange={(e) => setProcUrl(e.target.value)}
                  className="w-full text-xs font-mono border border-[#d8dcd6] rounded-lg px-3 py-2 text-[#1a1f1c] bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Default Spatial Reference (CRS)</label>
                <input
                  type="text"
                  value={crs}
                  onChange={(e) => setCrs(e.target.value)}
                  className="w-full text-xs font-mono border border-[#d8dcd6] rounded-lg px-3 py-2 text-[#1a1f1c] bg-[#fafbf9] focus:bg-white focus:outline-none focus:border-[#1e6641]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#f0f3ef] flex items-center justify-between">
              {saved ? (
                <span className="text-xs font-semibold text-[#1e6641] flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Settings updated successfully
                </span>
              ) : (
                <span className="text-[11px] text-[#7c8b82]">Configured in backend/.env</span>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-[#1e6641] hover:bg-[#174f33] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Save Settings
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

