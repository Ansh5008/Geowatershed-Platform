"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWatershed, Observation } from "../context/WatershedContext";

export default function MapView() {
  const {
    observations,
    selectedObservation,
    setSelectedObservation,
    addObservation,
    layers,
    toggleLayer,
    addLayer,
    selectedWatershed,
  } = useWatershed();

  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewLayerModal, setShowNewLayerModal] = useState(false);
  const [searchCoords, setSearchCoords] = useState("");
  const [basemapStyle, setBasemapStyle] = useState<"topo" | "satellite" | "hydrology">("topo");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pan and Zoom Engine State
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number }>({ lat: 18.5204, lng: 73.8567 });

  const containerRef = useRef<HTMLDivElement>(null);

  // New observation form state
  const [obsForm, setObsForm] = useState({
    customId: "",
    lat: 18.5204,
    lng: 73.8567,
    landUse: "Rainfed cropland",
    vegetation: "Moderate",
    erosion: "High risk",
    confidence: 92,
    notes: "Field survey verified gully formation along stream bank",
  });

  // New layer form state
  const [newLayerForm, setNewLayerForm] = useState({
    name: "",
    type: "polygon" as "line" | "polygon" | "point" | "pattern",
    color: "#2563eb",
  });

  // Zoom Handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(4.5, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))));
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomStep = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prev) => Math.min(4.5, Math.max(0.5, Number((prev + zoomStep).toFixed(2)))));
  };

  // Mouse Drag Panning Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Unproject to approximate geographic coords
      const svgX = (relativeX - pan.x - 500 * (1 - zoom)) / zoom;
      const svgY = (relativeY - pan.y - 325 * (1 - zoom)) / zoom;
      const currentLng = 73.5 + (svgX / 1000) * 0.8;
      const currentLat = 18.7 - (svgY / 650) * 0.4;
      setCursorCoords({
        lat: Number(currentLat.toFixed(4)),
        lng: Number(currentLng.toFixed(4)),
      });
    }

    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Click on SVG to place or inspect points
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only open add modal if it wasn't a drag gesture
    if (Math.abs(pan.x - (e.clientX - dragStart.x)) > 4 || Math.abs(pan.y - (e.clientY - dragStart.y)) > 4) {
      return;
    }
    setObsForm((prev) => ({
      ...prev,
      lat: cursorCoords.lat,
      lng: cursorCoords.lng,
    }));
    setShowAddModal(true);
  };

  const handleAddObservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addObservation({
      customId: obsForm.customId.trim() || undefined,
      lat: Number(obsForm.lat),
      lng: Number(obsForm.lng),
      coords: `${Number(obsForm.lat).toFixed(4)}° N, ${Number(obsForm.lng).toFixed(4)}° E`,
      landUse: obsForm.landUse,
      vegetation: obsForm.vegetation,
      erosion: obsForm.erosion,
      confidence: Number(obsForm.confidence),
      notes: obsForm.notes,
    });
    setShowAddModal(false);
    setObsForm({
      customId: "",
      lat: 18.5300,
      lng: 73.8700,
      landUse: "Rainfed cropland",
      vegetation: "Moderate",
      erosion: "High risk",
      confidence: 90,
      notes: "",
    });
  };

  const handleCreateLayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayerForm.name.trim()) return;
    addLayer({
      name: newLayerForm.name.trim(),
      type: newLayerForm.type,
      color: newLayerForm.color,
      visible: true,
    });
    setNewLayerForm({ name: "", type: "polygon", color: "#2563eb" });
    setShowNewLayerModal(false);
  };

  // Export map data as GeoJSON
  const handleExportMap = () => {
    const geojson = {
      type: "FeatureCollection",
      watershed: selectedWatershed,
      exportedAt: new Date().toISOString(),
      features: observations.map((obs) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [obs.lng, obs.lat],
        },
        properties: {
          id: obs.id,
          date: obs.date,
          landUse: obs.landUse,
          vegetation: obs.vegetation,
          erosion: obs.erosion,
          confidence: obs.confidence,
          notes: obs.notes,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `geowatershed_${selectedWatershed.toLowerCase().replace(/\s+/g, "_")}_map.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleCount = layers.filter((l) => l.visible).length;

  // Compute dynamic scale bar value
  const scaleKm = (5 / zoom).toFixed(1);

  return (
    <div className={`flex flex-col h-full space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-[#f5f6f4] p-6" : ""}`}>
      {/* Workspace Header Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-1">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#1e6641] uppercase">
            SPATIAL ANALYSIS WORKSPACE
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#1a1f1c] mt-0.5 tracking-tight flex items-center gap-3">
            <span>Interactive GIS Map</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Zoom: {Math.round(zoom * 100)}%
            </span>
          </h1>
          <p className="text-xs text-[#5c6b62] mt-0.5">
            Pan &amp; zoom enabled. Interactive layers and field survey markers for {selectedWatershed}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Basemap Switcher */}
          <div className="flex items-center bg-white border border-[#d8dcd6] rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setBasemapStyle("topo")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                basemapStyle === "topo" ? "bg-[#1e6641] text-white shadow-xs" : "text-[#5c6b62] hover:text-[#1a1f1c]"
              }`}
            >
              Topography
            </button>
            <button
              onClick={() => setBasemapStyle("satellite")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                basemapStyle === "satellite" ? "bg-[#1e6641] text-white shadow-xs" : "text-[#5c6b62] hover:text-[#1a1f1c]"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBasemapStyle("hydrology")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                basemapStyle === "hydrology" ? "bg-[#1e6641] text-white shadow-xs" : "text-[#5c6b62] hover:text-[#1a1f1c]"
              }`}
            >
              Hydro High-Res
            </button>
          </div>

          <button
            onClick={handleExportMap}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#2d3831] bg-white border border-[#d8dcd6] rounded-lg hover:bg-[#f7f8f6] transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#5c6b62]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export GeoJSON
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            + Add observation
          </button>
        </div>
      </div>

      {/* Main Map Container Card */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 min-h-[640px] border border-[#dce1da] rounded-xl overflow-hidden shadow-xs select-none ${
          basemapStyle === "satellite" ? "bg-[#14231b]" : basemapStyle === "hydrology" ? "bg-[#0f172a]" : "bg-[#eef1ed]"
        } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* Floating Search & Controls Bar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Coordinates Search Box */}
          <div className="relative w-64 md:w-80 bg-white border border-[#d8dcd6] rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8fa396]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchCoords}
              onChange={(e) => setSearchCoords(e.target.value)}
              placeholder="Search place or coordinates..."
              className="w-full pl-9 pr-3 py-2 text-xs text-[#1a1f1c] placeholder-[#8fa396] bg-transparent focus:outline-none"
            />
          </div>

          {/* Layers Toggle Button */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer ${
              showLayerPanel
                ? "bg-[#1e6641] text-white"
                : "bg-white text-[#2d3831] border border-[#d8dcd6] hover:bg-[#f7f8f6]"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Layers</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                showLayerPanel ? "bg-white/20 text-white" : "bg-[#e5e9e3] text-[#1e6641]"
              }`}
            >
              {visibleCount}
            </span>
          </button>

          {/* Add Layer Button */}
          <button
            onClick={() => setShowNewLayerModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#2d3831] bg-white border border-[#d8dcd6] rounded-lg shadow-sm hover:bg-[#f7f8f6] transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#1e6641]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Layer</span>
          </button>
        </div>

        {/* Map Layers Drawer (Left Overlay) */}
        {showLayerPanel && (
          <div className="absolute top-16 left-4 z-20 w-72 bg-white rounded-xl border border-[#d8dcd6] shadow-lg overflow-hidden animate-fadeIn pointer-events-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#eef1ed]">
              <div>
                <h4 className="text-xs font-bold text-[#1a1f1c]">Map layers</h4>
                <p className="text-[10px] text-[#7c8b82]">
                  {visibleCount} of {layers.length} visible
                </p>
              </div>
              <button
                onClick={() => setShowLayerPanel(false)}
                className="text-[#8fa396] hover:text-[#1a1f1c] p-1 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="divide-y divide-[#f4f6f3] max-h-[380px] overflow-y-auto">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between px-3.5 py-2 hover:bg-[#fafbf9] transition-colors cursor-pointer"
                  onClick={() => toggleLayer(layer.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => {}}
                      className="rounded border-[#c8cfc7] text-[#1e6641] focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-[#1e6641]"
                    />

                    {layer.type === "line" && (
                      <span className="w-3.5 h-0.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                    )}
                    {layer.type === "polygon" && (
                      <span
                        className="w-3 h-3 rounded-xs shrink-0 border"
                        style={{ borderColor: layer.color, backgroundColor: layer.visible ? `${layer.color}33` : "transparent" }}
                      />
                    )}
                    {layer.type === "point" && (
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 border-2" style={{ borderColor: layer.color }} />
                    )}
                    {layer.type === "pattern" && (
                      <span className="w-3 h-3 rounded-xs shrink-0 border border-dashed" style={{ borderColor: layer.color }} />
                    )}

                    <span className="text-[12px] font-medium text-[#2d3831] truncate">
                      {layer.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 bg-[#f7f8f6] border-t border-[#eef1ed] flex items-center justify-between">
              <button
                onClick={() => setShowNewLayerModal(true)}
                className="text-[11px] font-semibold text-[#1e6641] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Create custom layer</span>
              </button>
            </div>
          </div>
        )}

        {/* Selected Observation Card (Right Floating Overlay) */}
        {selectedObservation && (
          <div className="absolute top-16 right-16 z-20 w-80 bg-white rounded-xl border border-[#d8dcd6] shadow-xl overflow-hidden animate-fadeIn pointer-events-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#eef1ed]">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-[#7c8b82] uppercase">
                  SELECTED OBSERVATION
                </p>
                <h4 className="text-sm font-bold text-[#1a1f1c]">{selectedObservation.id}</h4>
              </div>
              <button
                onClick={() => setSelectedObservation(null)}
                className="text-[#8fa396] hover:text-[#1a1f1c] p-1 rounded transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative h-32 bg-[#ccd3cb] overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 320 128" preserveAspectRatio="none">
                <rect width="320" height="128" fill="#c3ccc2" />
                <path d="M0,128 L110,60 L210,60 L320,128 Z" fill="#9ea89d" />
                <path d="M120,60 L140,0 L180,0 L200,60 Z" fill="#b0bbb0" />
                <circle cx="160" cy="40" r="4" fill="none" stroke="#ffffff" strokeWidth={2} />
              </svg>
              <div className="absolute bottom-2 left-2">
                <span className="text-[9px] font-bold tracking-wider text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                  FIELD IMAGE • {selectedObservation.date}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-[#eef1ed] pb-3">
                <div>
                  <p className="text-[10px] font-medium text-[#7c8b82]">Coordinates</p>
                  <p className="text-[11px] font-bold text-[#1a1f1c] mt-0.5">{selectedObservation.coords}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#7c8b82]">Land-use category</p>
                  <p className="text-[11px] font-bold text-[#1a1f1c] mt-0.5">{selectedObservation.landUse}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-b border-[#eef1ed] pb-3">
                <div>
                  <p className="text-[10px] font-medium text-[#7c8b82]">Vegetation condition</p>
                  <p className="text-[11px] font-bold text-[#1a1f1c] mt-0.5">{selectedObservation.vegetation}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#7c8b82]">Erosion condition</p>
                  <p className="text-[11px] font-bold text-[#b91c1c] mt-0.5">{selectedObservation.erosion}</p>
                </div>
              </div>

              {selectedObservation.notes && (
                <div className="text-[11px] text-[#5c6b62] bg-[#f7f9f6] p-2 rounded border border-[#eef1ed]">
                  <p className="font-semibold text-[#1a1f1c] text-[10px] uppercase">Notes</p>
                  <p className="mt-0.5">{selectedObservation.notes}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                  <span className="text-[#5c6b62]">AI confidence score</span>
                  <span className="text-[#1e6641]">{selectedObservation.confidence}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#e5e9e3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1e6641] rounded-full transition-all duration-500"
                    style={{ width: `${selectedObservation.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROPER WORKING GIS ZOOM & NAVIGATION CONTROLS (Top Right Edge) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col bg-white border border-[#d8dcd6] rounded-xl shadow-md overflow-hidden pointer-events-auto">
          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            title="Zoom In (+)"
            className="p-2.5 hover:bg-[#f0fdf4] text-[#1e6641] border-b border-[#eef1ed] transition-colors cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Zoom Percentage Label */}
          <button
            onClick={handleResetView}
            title="Click to reset zoom to 100%"
            className="px-1.5 py-1 text-[9px] font-mono font-bold text-[#5c6b62] bg-[#fbfcfb] border-b border-[#eef1ed] hover:text-[#1e6641] transition-colors text-center"
          >
            {Math.round(zoom * 100)}%
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            className="p-2.5 hover:bg-[#f0fdf4] text-[#2d3831] border-b border-[#eef1ed] transition-colors cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>

          {/* Reset Viewport Center Button */}
          <button
            onClick={handleResetView}
            title="Recenter and Reset Viewport"
            className="p-2.5 hover:bg-[#f0fdf4] text-[#2d3831] border-b border-[#eef1ed] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
            </svg>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            className="p-2.5 hover:bg-[#f0fdf4] text-[#2d3831] transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>

        {/* HUD: Coordinates & Dynamic Scale Bar (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-[#d8dcd6] px-3.5 py-1.5 rounded-lg shadow-sm text-xs font-mono text-[#2c3e34] pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {cursorCoords.lat.toFixed(4)}° N, {cursorCoords.lng.toFixed(4)}° E
            </span>
          </div>

          <div className="h-3 w-px bg-[#d8dcd6]" />

          {/* Dynamic Geographic Scale Bar */}
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-1 bg-[#1a1f1c] relative">
              <div className="absolute -top-1 left-0 w-0.5 h-3 bg-[#1a1f1c]" />
              <div className="absolute -top-1 right-0 w-0.5 h-3 bg-[#1a1f1c]" />
            </div>
            <span className="text-[10px] font-bold text-[#5c6b62]">{scaleKm} km</span>
          </div>
        </div>

        {/* Interactive Vector GIS Canvas */}
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 650"
            preserveAspectRatio="xMidYMid slice"
            onClick={handleSvgClick}
          >
            {/* Background Fill depending on style */}
            <rect
              width="1000"
              height="650"
              fill={
                basemapStyle === "satellite"
                  ? "#17291f"
                  : basemapStyle === "hydrology"
                  ? "#0b1329"
                  : "#edf2eb"
              }
            />

            {/* Transform Group for Pan & Zoom Engine */}
            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
              style={{
                transformOrigin: "500px 325px",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              {/* Dynamic Grid / Satellite imagery background tiles */}
              <defs>
                <pattern id="gridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke={basemapStyle === "satellite" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}
                    strokeWidth="0.8"
                  />
                </pattern>
                <linearGradient id="hillshade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              <rect width="1000" height="650" fill="url(#gridPattern)" />

              {/* Contour lines (Elevation Terrain) */}
              <g stroke={basemapStyle === "satellite" ? "#2d4838" : "#dfe6dc"} strokeWidth="1" fill="none">
                <path d="M 0,100 Q 250,80 500,120 T 1000,90" />
                <path d="M 0,220 Q 280,200 520,240 T 1000,210" />
                <path d="M 0,340 Q 320,310 600,360 T 1000,320" />
                <path d="M 0,460 Q 350,440 680,480 T 1000,450" />
                <path d="M 0,580 Q 400,560 750,600 T 1000,570" />
              </g>

              {/* Sub-catchments / Micro-watershed polygons */}
              <polygon
                points="490,180 635,170 700,300 625,430 480,420 410,290"
                fill={basemapStyle === "satellite" ? "#1f382a" : "#e6ecdf"}
                stroke={basemapStyle === "satellite" ? "#2f5741" : "#cbd5c3"}
                strokeWidth="1.5"
              />
              <polygon
                points="450,440 600,435 670,550 560,630 440,610 370,500"
                fill={basemapStyle === "satellite" ? "#1b3326" : "#dbe4d5"}
                stroke={basemapStyle === "satellite" ? "#294d3a" : "#c0cbb9"}
                strokeWidth="1.5"
              />
              <polygon
                points="240,320 440,300 460,450 380,570 230,550 160,420"
                fill={basemapStyle === "satellite" ? "#313824" : "#ebdcc8"}
                fillOpacity="0.75"
                stroke={basemapStyle === "satellite" ? "#4d5838" : "#d4be9f"}
                strokeWidth="1.5"
              />
              <polygon
                points="640,430 870,410 930,580 820,640 660,620 620,510"
                fill={basemapStyle === "satellite" ? "#2a3625" : "#f1e2cc"}
                fillOpacity="0.7"
                stroke={basemapStyle === "satellite" ? "#44573b" : "#d8c5aa"}
                strokeWidth="1.5"
              />

              {/* Drainage Streams (Blue Network) */}
              <g>
                <path
                  d="M 430,220 Q 480,310 570,450 T 640,620"
                  fill="none"
                  stroke={basemapStyle === "hydrology" ? "#38bdf8" : "#3b82f6"}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 570,450 Q 640,510 700,560"
                  fill="none"
                  stroke={basemapStyle === "hydrology" ? "#38bdf8" : "#3b82f6"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 410,340 Q 460,400 480,460"
                  fill="none"
                  stroke={basemapStyle === "hydrology" ? "#7dd3fc" : "#60a5fa"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>

              {/* Water Reservoirs */}
              <ellipse
                cx="370"
                cy="580"
                rx="42"
                ry="26"
                fill={basemapStyle === "hydrology" ? "#0284c7" : "#bfdbfe"}
                stroke="#60a5fa"
                strokeWidth="2"
              />
              <ellipse
                cx="835"
                cy="500"
                rx="55"
                ry="32"
                fill={basemapStyle === "hydrology" ? "#0284c7" : "#bfdbfe"}
                stroke="#60a5fa"
                strokeWidth="2"
              />

              {/* Priority Soil Erosion Zones */}
              <polygon
                points="550,260 575,320 565,380 535,370 530,300"
                fill="#fed7aa"
                fillOpacity="0.6"
                stroke="#ea580c"
                strokeWidth="2"
              />
              <polygon
                points="750,510 772,550 765,600 735,590 730,540"
                fill="#fed7aa"
                fillOpacity="0.6"
                stroke="#ea580c"
                strokeWidth="2"
              />

              {/* Watershed Outer Boundary Line */}
              <path
                d="M 230,190 L 370,180 L 610,190 L 780,250 L 920,440 L 910,610 L 740,640 L 520,680 L 330,640 L 220,580 L 210,390 Z"
                fill="none"
                stroke={basemapStyle === "satellite" ? "#4ade80" : "#1b4d36"}
                strokeWidth="3"
                strokeDasharray="9 7"
              />

              <text
                x="590"
                y="600"
                fill={basemapStyle === "satellite" || basemapStyle === "hydrology" ? "#ffffff" : "#2c3e34"}
                fontFamily="sans-serif"
                fontSize="14"
                fontWeight="700"
              >
                {selectedWatershed}
              </text>

              {/* Dynamic Interactive Observations Markers */}
              {observations.map((obs) => {
                const isSelected = selectedObservation?.id === obs.id;
                return (
                  <g
                    key={obs.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedObservation(obs);
                    }}
                  >
                    <circle
                      cx={obs.svgX}
                      cy={obs.svgY}
                      r={isSelected ? 18 : 13}
                      fill={isSelected ? "#ea580c" : "#1b4d36"}
                      fillOpacity={isSelected ? 0.35 : 0.18}
                    />
                    <circle
                      cx={obs.svgX}
                      cy={obs.svgY}
                      r={isSelected ? 10 : 8}
                      fill="#ffffff"
                      stroke={isSelected ? "#ea580c" : "#1b4d36"}
                      strokeWidth={isSelected ? 3 : 2.5}
                    />
                    <circle
                      cx={obs.svgX}
                      cy={obs.svgY}
                      r={3.5}
                      fill={isSelected ? "#ea580c" : "#1b4d36"}
                    />
                    {isSelected && (
                      <text
                        x={obs.svgX}
                        y={obs.svgY - 14}
                        fill="#ea580c"
                        fontSize="11"
                        fontWeight="700"
                        textAnchor="middle"
                        filter="drop-shadow(0px 1px 2px rgba(255,255,255,0.9))"
                      >
                        {obs.id}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Add Observation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#d8dcd6] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eef1ed] bg-[#fbfcfb]">
              <div>
                <h3 className="font-bold text-sm text-[#1a1f1c]">Log Field Observation</h3>
                <p className="text-xs text-[#7c8b82]">
                  Add verified hydrological observation to {selectedWatershed}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8fa396] hover:text-[#1a1f1c] p-1 rounded transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddObservationSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Observation ID</label>
                  <input
                    type="text"
                    value={obsForm.customId}
                    onChange={(e) => setObsForm({ ...obsForm, customId: e.target.value })}
                    placeholder="e.g. OBS-782"
                    className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">AI Confidence (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={obsForm.confidence}
                    onChange={(e) => setObsForm({ ...obsForm, confidence: parseInt(e.target.value) || 90 })}
                    className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={obsForm.lat}
                    onChange={(e) => setObsForm({ ...obsForm, lat: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={obsForm.lng}
                    onChange={(e) => setObsForm({ ...obsForm, lng: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Land Use Classification</label>
                  <select
                    value={obsForm.landUse}
                    onChange={(e) => setObsForm({ ...obsForm, landUse: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                  >
                    <option>Rainfed cropland</option>
                    <option>Dense Forest / Ridge</option>
                    <option>Degraded Scrubland</option>
                    <option>Riverbank buffer</option>
                    <option>Gully zone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Erosion Severity</label>
                  <select
                    value={obsForm.erosion}
                    onChange={(e) => setObsForm({ ...obsForm, erosion: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                  >
                    <option>Low risk</option>
                    <option>Moderate</option>
                    <option>High risk</option>
                    <option>Critical (Active Gully)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Field Surveyor Notes</label>
                <textarea
                  rows={3}
                  value={obsForm.notes}
                  onChange={(e) => setObsForm({ ...obsForm, notes: e.target.value })}
                  placeholder="Record terrain indicators, sediment runoff, or proposed interventions..."
                  className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#eef1ed]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62] hover:bg-[#f5f6f4] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Layer Modal */}
      {showNewLayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#d8dcd6] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eef1ed] bg-[#fbfcfb]">
              <div>
                <h3 className="font-bold text-sm text-[#1a1f1c]">Create Custom Layer</h3>
                <p className="text-xs text-[#7c8b82]">Add a thematic spatial overlay</p>
              </div>
              <button
                onClick={() => setShowNewLayerModal(false)}
                className="text-[#8fa396] hover:text-[#1a1f1c] p-1 rounded transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateLayerSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Layer Title</label>
                <input
                  type="text"
                  required
                  value={newLayerForm.name}
                  onChange={(e) => setNewLayerForm({ ...newLayerForm, name: e.target.value })}
                  placeholder="e.g. Silt Detention Bunds"
                  className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Geometry Type</label>
                <select
                  value={newLayerForm.type}
                  onChange={(e) => setNewLayerForm({ ...newLayerForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-[#fbfcfb] border border-[#d2d7d0] rounded-lg text-[#1a1f1c] focus:outline-none focus:border-[#1e6641]"
                >
                  <option value="polygon">Polygon (Zones, Basins)</option>
                  <option value="line">Line (Streams, Trenches)</option>
                  <option value="point">Point (Structures, Wells)</option>
                  <option value="pattern">Pattern (Erosion areas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1a1f1c] mb-1">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newLayerForm.color}
                    onChange={(e) => setNewLayerForm({ ...newLayerForm, color: e.target.value })}
                    className="w-10 h-8 p-0 rounded border border-[#d2d7d0] cursor-pointer"
                  />
                  <span className="font-mono text-xs text-[#5c6b62]">{newLayerForm.color}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#eef1ed]">
                <button
                  type="button"
                  onClick={() => setShowNewLayerModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5c6b62] hover:bg-[#f5f6f4] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1e6641] hover:bg-[#174f33] rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Add Layer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
