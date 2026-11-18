"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWatershed, HotspotItem, StreamflowRecord } from "../context/WatershedContext";

export default function DashboardContent() {
  const {
    selectedWatershed,
    watersheds,
    observations,
    images,
    layers,
    telemetry,
    updateTelemetry,
    streamflow,
    updateStreamflowRecord,
    addStreamflowRecord,
    hotspots,
    addHotspot,
    deleteHotspot,
    addObservation,
    deleteObservation,
    setSelectedObservation,
  } = useWatershed();

  // Live Digital Clock state
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).toLowerCase()
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modal States for User Input (NO HARDCODING)
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [telemetryForm, setTelemetryForm] = useState(telemetry);

  const [isHotspotModalOpen, setIsHotspotModalOpen] = useState(false);
  const [hotspotForm, setHotspotForm] = useState<{
    name: string;
    capacity: string;
    risk: "high" | "medium" | "low";
  }>({
    name: "",
    capacity: "",
    risk: "high",
  });

  const [isStreamflowModalOpen, setIsStreamflowModalOpen] = useState(false);
  const [streamflowForm, setStreamflowForm] = useState<{
    month: string;
    flow: number;
    rainfall: number;
  }>({
    month: "Jan",
    flow: 200,
    rainfall: 50,
  });

  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [obsForm, setObsForm] = useState({
    customId: "",
    landUse: "Rainfed cropland",
    vegetation: "Moderate",
    erosion: "High risk",
    confidence: 90,
    lat: 18.5204,
    lng: 73.8567,
    notes: "",
  });

  // Handle Telemetry Save
  const handleSaveTelemetry = (e: React.FormEvent) => {
    e.preventDefault();
    updateTelemetry(telemetryForm);
    setIsTelemetryModalOpen(false);
  };

  // Handle Hotspot Submit
  const handleAddHotspot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotspotForm.name.trim()) return;
    addHotspot({
      name: hotspotForm.name,
      capacity: hotspotForm.capacity || "80% capacity",
      risk: hotspotForm.risk,
    });
    setHotspotForm({ name: "", capacity: "", risk: "high" });
    setIsHotspotModalOpen(false);
  };

  // Handle Streamflow Submit
  const handleAddStreamflow = (e: React.FormEvent) => {
    e.preventDefault();
    updateStreamflowRecord(streamflowForm.month, streamflowForm.flow, streamflowForm.rainfall);
    setIsStreamflowModalOpen(false);
  };

  // Handle Observation Submit
  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    addObservation({
      customId: obsForm.customId || undefined,
      landUse: obsForm.landUse,
      vegetation: obsForm.vegetation,
      erosion: obsForm.erosion,
      confidence: Number(obsForm.confidence),
      lat: Number(obsForm.lat),
      lng: Number(obsForm.lng),
      coords: `${obsForm.lat}° N, ${obsForm.lng}° E`,
      notes: obsForm.notes,
    });
    setIsObsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* =========================================================================
          TOP BANNER: Live Spatial System + Digital Clock + Weather Telemetry
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Live Status */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e6641] text-white flex items-center justify-center shadow-md shadow-[#1e6641]/20 shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1f1c] tracking-tight">
                {selectedWatershed} Platform
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-full shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live System
              </span>
            </div>
            <p className="text-xs text-[#5c6b62] mt-0.5">
              Advanced Geospatial Visualization &amp; Catchment Intelligence Platform
            </p>
          </div>
        </div>

        {/* Right Widgets: Clock Card + Weather Card */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Live Digital Clock Card (Claymorphic) */}
          <div className="clay-pill-widget px-4 py-2.5 flex flex-col justify-center min-w-[170px]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2563eb]">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-mono text-sm tracking-tight font-extrabold">{currentTime || "12:00:00 am"}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#5c6b62] font-medium mt-1">
              <svg className="w-3.5 h-3.5 text-[#8fa396] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{currentDate || "Loading date..."}</span>
            </div>
            <span className="text-[10px] text-[#8fa396] font-medium mt-0.5">
              IST (Indian Standard Time)
            </span>
          </div>

          {/* Hydro-meteorological Conditions (Claymorphic) */}
          <div className="clay-pill-widget px-4 py-2.5 flex flex-col justify-center min-w-[210px] relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-bold text-[#1a1f1c]">{telemetry.temperature}</span>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-[#1a1f1c] truncate max-w-[100px]">{selectedWatershed.split(" ")[0]}</p>
                <p className="text-[10px] text-[#7c8b82] leading-tight">{telemetry.weatherCondition}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-[#5c6b62] font-semibold mt-1.5 pt-1.5 border-t border-[#e2e5e1]/60">
              <span title="Relative Humidity">💧 {telemetry.humidity}</span>
              <span title="Wind Speed">💨 {telemetry.windSpeed}</span>
              <span title="Atmospheric Visibility">👁 {telemetry.visibility}</span>
              <button
                onClick={() => {
                  setTelemetryForm(telemetry);
                  setIsTelemetryModalOpen(true);
                }}
                className="ml-auto text-[#1e6641] hover:text-[#174f33] font-bold text-[10px]"
                title="Edit Telemetry & Conditions"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4 CLAYMORPHIC PASTEL METRIC CARDS
          User-enterable & fully dynamic (Soft Blue, Mint, Butter Amber, Lavender)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Soft Sky Blue Clay Card */}
        <div
          onClick={() => {
            setTelemetryForm(telemetry);
            setIsTelemetryModalOpen(true);
          }}
          className="clay-card-blue p-5 cursor-pointer select-none group"
        >
          <div className="flex items-center justify-between text-[#1d4ed8]">
            <div className="flex items-center gap-2">
              <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-semibold tracking-wide text-[#2563eb]">
                Total Catchment Area
              </span>
            </div>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#2563eb] bg-white/70 px-1.5 py-0.5 rounded">
              ✏️ Enter
            </span>
          </div>

          <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f172a] mt-3 tracking-tight">
            {telemetry.catchmentArea}
          </p>

          <p className="text-xs text-[#2563eb] font-semibold mt-1 flex items-center gap-1">
            <span>{telemetry.catchmentDelta}</span>
          </p>
        </div>

        {/* Card 2: Soft Mint Green Clay Card */}
        <div
          onClick={() => {
            setTelemetryForm(telemetry);
            setIsTelemetryModalOpen(true);
          }}
          className="clay-card-green p-5 cursor-pointer select-none group"
        >
          <div className="flex items-center justify-between text-[#15803d]">
            <div className="flex items-center gap-2">
              <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-xs font-semibold tracking-wide text-[#16a34a]">
                WASH Services / Dams
              </span>
            </div>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#16a34a] bg-white/70 px-1.5 py-0.5 rounded">
              ✏️ Enter
            </span>
          </div>

          <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f172a] mt-3 tracking-tight">
            {telemetry.activeInterventions}
          </p>

          <p className="text-xs text-[#16a34a] font-semibold mt-1">
            {telemetry.interventionsLabel}
          </p>
        </div>

        {/* Card 3: Soft Butter/Amber Clay Card */}
        <div
          onClick={() => {
            setTelemetryForm(telemetry);
            setIsTelemetryModalOpen(true);
          }}
          className="clay-card-amber p-5 cursor-pointer select-none group"
        >
          <div className="flex items-center justify-between text-[#b45309]">
            <div className="flex items-center gap-2">
              <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs font-semibold tracking-wide text-[#d97706]">
                Water Quality Index
              </span>
            </div>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#d97706] bg-white/70 px-1.5 py-0.5 rounded">
              ✏️ Enter
            </span>
          </div>

          <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f172a] mt-3 tracking-tight">
            {telemetry.waterQualityIndex}
          </p>

          <p className="text-xs text-[#b45309] font-semibold mt-1">
            {telemetry.waterQualityDetail}
          </p>
        </div>

        {/* Card 4: Soft Lavender Clay Card */}
        <div
          onClick={() => {
            setTelemetryForm(telemetry);
            setIsTelemetryModalOpen(true);
          }}
          className="clay-card-purple p-5 cursor-pointer select-none group"
        >
          <div className="flex items-center justify-between text-[#7e22ce]">
            <div className="flex items-center gap-2">
              <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-semibold tracking-wide text-[#9333ea]">
                System Status
              </span>
            </div>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#9333ea] bg-white/70 px-1.5 py-0.5 rounded">
              ✏️ Enter
            </span>
          </div>

          <p className="text-2xl sm:text-[26px] font-extrabold text-[#0f172a] mt-3 tracking-tight">
            {telemetry.systemStatus}
          </p>

          <p className="text-xs text-[#7e22ce] font-semibold mt-1">
            {telemetry.systemStatusDetail}
          </p>
        </div>
      </div>

      {/* =========================================================================
          ANALYTICS & DENSITY HOTSPOTS (Direct match to reference image layout)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Streamflow Discharge & Rainfall Curve */}
        <div className="lg:col-span-2 clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1a1f1c]">
                  Visitor &amp; Catchment Hydrology - Last 24 Hours / Monthly Profile
                </h2>
                <p className="text-xs text-[#7c8b82] mt-0.5">
                  Real-time runoff monitoring, discharge (m³/s), and capacity analysis
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStreamflowModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#1e6641] bg-[#f0f4f1] hover:bg-[#e4ebe6] rounded-lg transition-colors border border-[#d8e0da]"
                >
                  + Enter Monthly Data
                </button>
              </div>
            </div>

            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={streamflow} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3ef" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#7c8b82", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#7c8b82", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      border: "1px solid #e2e5e1",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="flow"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#flowGrad)"
                    name="Streamflow (m³/s)"
                  />
                  <Area
                    type="natural"
                    dataKey="rainfall"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#rainGrad)"
                    name="Precipitation (mm)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#7c8b82] pt-3 border-t border-[#f0f3ef] mt-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
              Streamflow Hydrograph
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              Rainfall Isohyet
            </span>
            <span className="text-[#1e6641] font-semibold">{streamflow.length} Data Points Synced</span>
          </div>
        </div>

        {/* Right: Crowd & Catchment Density Hotspots (styled like the image) */}
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#1a1f1c]">
                Crowd &amp; Density Hotspots
              </h3>
              <button
                onClick={() => setIsHotspotModalOpen(true)}
                className="text-xs font-bold text-[#1e6641] hover:underline"
              >
                + Add Hotspot
              </button>
            </div>
            <p className="text-xs text-[#7c8b82] mb-4">
              Real-time monitoring &amp; capacity analysis
            </p>

            <div className="space-y-3">
              {hotspots.map((hs) => (
                <div
                  key={hs.id}
                  className="p-3.5 bg-[#fbfcfb] border border-[#eef1ed] rounded-xl hover:border-[#1e6641]/30 transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1a1f1c]">{hs.name}</p>
                    <p className="text-[11px] text-[#7c8b82] mt-0.5">{hs.capacity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${hs.risk === "high"
                          ? "clay-badge-high"
                          : hs.risk === "medium"
                            ? "clay-badge-med"
                            : "clay-badge-low"
                        }`}
                    >
                      {hs.risk}
                    </span>
                    <button
                      onClick={() => deleteHotspot(hs.id)}
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 text-xs font-bold transition-opacity ml-1"
                      title="Delete Hotspot"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0f3ef] mt-4 flex items-center justify-between">
            <span className="text-xs text-[#7c8b82] font-medium">{hotspots.length} active hotspots</span>
            <Link
              href="/map"
              className="text-xs font-bold text-[#1e6641] hover:underline flex items-center gap-1"
            >
              <span>View all on GIS Map</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC FIELD OBSERVATIONS FEED (User-enterable & fully dynamic)
          ========================================================================= */}
      <div className="clay-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-[#1a1f1c]">
              Recent Field Observations ({observations.length} active)
            </h2>
            <p className="text-xs text-[#7c8b82] mt-0.5">
              Click any survey to view or add new observations on the interactive map
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsObsModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>+ Log Field Observation</span>
            </button>
            <Link
              href="/map"
              className="px-3.5 py-1.5 text-xs font-semibold text-[#1e6641] bg-[#f0f4f1] hover:bg-[#e4ebe6] rounded-lg transition-colors"
            >
              Open GIS Map →
            </Link>
          </div>
        </div>

        <div className="divide-y divide-[#f0f3ef]">
          {observations.slice(0, 6).map((obs) => (
            <div
              key={obs.id}
              onClick={() => setSelectedObservation(obs)}
              className="py-3.5 flex items-center justify-between hover:bg-[#fafbf9] -mx-2 px-3 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#1e6641] bg-white flex items-center justify-center font-bold text-[10px] text-[#1e6641] shadow-2xs">
                  OBS
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1a1f1c]">{obs.id}</p>
                  <p className="text-[11px] text-[#7c8b82]">
                    {obs.landUse} • {obs.coords}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#7c8b82] hidden sm:inline">{obs.date}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${obs.erosion.includes("High") || obs.erosion.includes("Critical") || obs.erosion.includes("Severe")
                      ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    }`}
                >
                  {obs.erosion}
                </span>
                <span className="font-semibold text-[#1e6641] text-[11px] hidden sm:inline">
                  {obs.confidence}% AI
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteObservation(obs.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 text-xs font-bold transition-opacity px-1"
                  title="Remove observation"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: Enter & Update Catchment Telemetry (NO HARDCODING)
          ========================================================================= */}
      {isTelemetryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#e2e5e1] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ef]">
              <div>
                <h3 className="text-base font-bold text-[#1a1f1c]">
                  Enter Catchment Telemetry &amp; Metrics
                </h3>
                <p className="text-xs text-[#7c8b82]">
                  Customize all 4 top cards and atmospheric conditions dynamically
                </p>
              </div>
              <button
                onClick={() => setIsTelemetryModalOpen(false)}
                className="text-[#7c8b82] hover:text-[#1a1f1c] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTelemetry} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Total Catchment Area
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.catchmentArea}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, catchmentArea: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. 2,847,592 ha"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Catchment Trend / Delta
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.catchmentDelta}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, catchmentDelta: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. +15.3% from baseline"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    WASH Services / Check Dams
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.activeInterventions}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, activeInterventions: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. 98.7%"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Services Status Label
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.interventionsLabel}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, interventionsLabel: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. Operational Status"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Water Quality Index
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.waterQualityIndex}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, waterQualityIndex: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. Good or 7.2/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Water Quality Detail
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.waterQualityDetail}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, waterQualityDetail: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. Overall Index: 7.2/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    System Status
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.systemStatus}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, systemStatus: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. Active"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    System Status Detail
                  </label>
                  <input
                    type="text"
                    value={telemetryForm.systemStatusDetail}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, systemStatusDetail: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    placeholder="e.g. All systems operational"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#f0f3ef]">
                <p className="text-xs font-bold text-[#1a1f1c] mb-2">Weather &amp; Hydro-meteorology</p>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#7c8b82]">Temperature</label>
                    <input
                      type="text"
                      value={telemetryForm.temperature}
                      onChange={(e) => setTelemetryForm({ ...telemetryForm, temperature: e.target.value })}
                      className="w-full text-xs p-2 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                      placeholder="18°C"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#7c8b82]">Humidity</label>
                    <input
                      type="text"
                      value={telemetryForm.humidity}
                      onChange={(e) => setTelemetryForm({ ...telemetryForm, humidity: e.target.value })}
                      className="w-full text-xs p-2 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                      placeholder="65%"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#7c8b82]">Wind</label>
                    <input
                      type="text"
                      value={telemetryForm.windSpeed}
                      onChange={(e) => setTelemetryForm({ ...telemetryForm, windSpeed: e.target.value })}
                      className="w-full text-xs p-2 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                      placeholder="12 km/h"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#7c8b82]">Visibility</label>
                    <input
                      type="text"
                      value={telemetryForm.visibility}
                      onChange={(e) => setTelemetryForm({ ...telemetryForm, visibility: e.target.value })}
                      className="w-full text-xs p-2 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                      placeholder="8 km"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0f3ef]">
                <button
                  type="button"
                  onClick={() => setIsTelemetryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62] hover:bg-[#f0f4f1] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: Add Hotspot (NO HARDCODING)
          ========================================================================= */}
      {isHotspotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e2e5e1]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ef]">
              <h3 className="text-base font-bold text-[#1a1f1c]">Add Density Hotspot</h3>
              <button
                onClick={() => setIsHotspotModalOpen(false)}
                className="text-[#7c8b82] hover:text-[#1a1f1c] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHotspot} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                  Hotspot / Location Name
                </label>
                <input
                  type="text"
                  value={hotspotForm.name}
                  onChange={(e) => setHotspotForm({ ...hotspotForm, name: e.target.value })}
                  placeholder="e.g. Triveni Sangam Confluence Reach"
                  className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                  Capacity / Status
                </label>
                <input
                  type="text"
                  value={hotspotForm.capacity}
                  onChange={(e) => setHotspotForm({ ...hotspotForm, capacity: e.target.value })}
                  placeholder="e.g. 95% capacity"
                  className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                  Risk Level
                </label>
                <select
                  value={hotspotForm.risk}
                  onChange={(e) =>
                    setHotspotForm({ ...hotspotForm, risk: e.target.value as "high" | "medium" | "low" })
                  }
                  className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none bg-white"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f3ef]">
                <button
                  type="button"
                  onClick={() => setIsHotspotModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62] hover:bg-[#f0f4f1] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm"
                >
                  Add Hotspot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: Enter Monthly Streamflow (NO HARDCODING)
          ========================================================================= */}
      {isStreamflowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e2e5e1]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ef]">
              <h3 className="text-base font-bold text-[#1a1f1c]">Enter Monthly Hydrology Record</h3>
              <button
                onClick={() => setIsStreamflowModalOpen(false)}
                className="text-[#7c8b82] hover:text-[#1a1f1c] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStreamflow} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                  Select Month
                </label>
                <select
                  value={streamflowForm.month}
                  onChange={(e) => setStreamflowForm({ ...streamflowForm, month: e.target.value })}
                  className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none bg-white"
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                  Discharge Flow (m³/s)
                </label>
                <input
                  type="number"
                  value={streamflowForm.flow}
                  onChange={(e) => setStreamflowForm({ ...streamflowForm, flow: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                  Precipitation (mm)
                </label>
                <input
                  type="number"
                  value={streamflowForm.rainfall}
                  onChange={(e) => setStreamflowForm({ ...streamflowForm, rainfall: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f3ef]">
                <button
                  type="button"
                  onClick={() => setIsStreamflowModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62] hover:bg-[#f0f4f1] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm"
                >
                  Update Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: Log Field Observation (NO HARDCODING)
          ========================================================================= */}
      {isObsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#e2e5e1]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3ef]">
              <h3 className="text-base font-bold text-[#1a1f1c]">Log New Field Observation</h3>
              <button
                onClick={() => setIsObsModalOpen(false)}
                className="text-[#7c8b82] hover:text-[#1a1f1c] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Survey / Tag ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={obsForm.customId}
                    onChange={(e) => setObsForm({ ...obsForm, customId: e.target.value })}
                    placeholder="e.g. OBS-2025-9012"
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Land Use Classification
                  </label>
                  <select
                    value={obsForm.landUse}
                    onChange={(e) => setObsForm({ ...obsForm, landUse: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none bg-white"
                  >
                    <option value="Rainfed cropland">Rainfed cropland</option>
                    <option value="Irrigated horticulture">Irrigated horticulture</option>
                    <option value="Scrubland / Forest buffer">Scrubland / Forest buffer</option>
                    <option value="Gully erosion zone">Gully erosion zone</option>
                    <option value="Water reservoir edge">Water reservoir edge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={obsForm.lat}
                    onChange={(e) => setObsForm({ ...obsForm, lat: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={obsForm.lng}
                    onChange={(e) => setObsForm({ ...obsForm, lng: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    Erosion Severity
                  </label>
                  <select
                    value={obsForm.erosion}
                    onChange={(e) => setObsForm({ ...obsForm, erosion: e.target.value })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none bg-white"
                  >
                    <option value="Low risk">Low risk</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High risk">High risk</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                    AI Confidence Score (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={obsForm.confidence}
                    onChange={(e) => setObsForm({ ...obsForm, confidence: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1f1c] mb-1">
                  Field Notes &amp; Observations
                </label>
                <textarea
                  rows={2}
                  value={obsForm.notes}
                  onChange={(e) => setObsForm({ ...obsForm, notes: e.target.value })}
                  placeholder="e.g. Silt runoff noticed near check dam inlet during rainfall..."
                  className="w-full text-xs p-2.5 border border-[#e2e5e1] rounded-lg focus:border-[#1e6641] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f3ef]">
                <button
                  type="button"
                  onClick={() => setIsObsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62] hover:bg-[#f0f4f1] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
