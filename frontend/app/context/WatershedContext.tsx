"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, formatDisplayDate, type ApiImage, type ApiReport, type ApiWatershed } from "../../lib/api";

export interface Watershed {
  id: number;
  name: string;
  region: string;
  area: string;
  area_sqkm: number;
  lastUpdated: string;
  risk: string;
  riskBadge: string;
}

export interface Observation {
  id: string;
  date: string;
  coords: string;
  lat: number;
  lng: number;
  landUse: string;
  vegetation: string;
  erosion: string;
  confidence: number;
  notes?: string;
  svgX: number;
  svgY: number;
}

export interface ImageryItem {
  id: number;
  name: string;
  watershed: string;
  date: string;
  size: string;
  status: string;
  badge: string;
}

export interface PriorityZone {
  id: string;
  name: string;
  area: string;
  slope: string;
  erosionRate: string;
  risk: string;
  structuresNeeded: string;
  budgetEst: string;
  badge: string;
}

export interface Intervention {
  id: string;
  type: string;
  location: string;
  status: string;
  progress: number;
  date: string;
}

export interface AnalysisReport {
  id: number;
  title: string;
  watershed: string;
  generated: string;
  pages: number | null;
  status: string;
  highlights: string[];
}

export interface CatchmentTelemetry {
  catchmentArea: string;
  catchmentDelta: string;
  activeInterventions: string;
  interventionsLabel: string;
  waterQualityIndex: string;
  waterQualityDetail: string;
  systemStatus: string;
  systemStatusDetail: string;
  temperature: string;
  weatherCondition: string;
  humidity: string;
  windSpeed: string;
  visibility: string;
}

export interface StreamflowRecord {
  month: string;
  flow: number;
  rainfall: number;
}

export interface HotspotItem {
  id: string;
  name: string;
  capacity: string;
  risk: "high" | "medium" | "low";
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: "line" | "polygon" | "point" | "pattern";
  color: string;
}

interface WatershedContextType {
  watersheds: Watershed[];
  selectedWatershed: string;
  setSelectedWatershed: (name: string) => void;
  addWatershed: (ws: Omit<Watershed, "id" | "lastUpdated" | "riskBadge">) => void;
  deleteWatershed: (id: number) => void;

  observations: Observation[];
  selectedObservation: Observation | null;
  setSelectedObservation: (obs: Observation | null) => void;
  addObservation: (obs: Omit<Observation, "id" | "date" | "svgX" | "svgY"> & { customId?: string }) => void;
  deleteObservation: (id: string) => void;
  updateObservation: (id: string, updated: Partial<Observation>) => void;

  telemetry: CatchmentTelemetry;
  updateTelemetry: (updated: Partial<CatchmentTelemetry>) => void;

  streamflow: StreamflowRecord[];
  updateStreamflowRecord: (month: string, flow: number, rainfall: number) => void;
  addStreamflowRecord: (record: StreamflowRecord) => void;

  hotspots: HotspotItem[];
  addHotspot: (item: Omit<HotspotItem, "id">) => void;
  deleteHotspot: (id: string) => void;

  images: ImageryItem[];
  addImages: (newFiles: { name: string; size: number; watershed: string; file?: File }[]) => void;

  zones: PriorityZone[];
  addZone: (zone: Omit<PriorityZone, "badge">) => void;

  interventions: Intervention[];
  addIntervention: (intv: Omit<Intervention, "id">) => void;

  reports: AnalysisReport[];
  generateReport: (watershedName: string, title?: string) => void;

  layers: MapLayer[];
  toggleLayer: (id: string) => void;
  addLayer: (layer: Omit<MapLayer, "id">) => void;

  catalogLoading: boolean;
  apiConnected: boolean;
  refreshCatalog: () => Promise<void>;
}

const STORAGE_PREFIX = "gw_v2_";

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

function statusBadge(status: string) {
  const value = status.toLowerCase();
  if (value.includes("process") || value.includes("ready") || value.includes("upload")) {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  if (value.includes("fail") || value.includes("error")) {
    return "bg-rose-50 text-rose-700 border border-rose-200";
  }
  return "bg-blue-50 text-blue-700 border border-blue-200";
}

function mapWatershed(row: ApiWatershed): Watershed {
  const areaSqkm = Number(row.area_sqkm) || 0;
  return {
    id: row.id,
    name: row.name,
    region: "Maharashtra, India",
    area: areaSqkm ? `${areaSqkm.toLocaleString()} km²` : "—",
    area_sqkm: areaSqkm,
    lastUpdated: formatDisplayDate(row.created_at),
    risk: "Active Monitoring",
    riskBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
}

function mapImage(row: ApiImage): ImageryItem {
  const status = row.status || "uploaded";
  return {
    id: row.id,
    name: row.file_path,
    watershed: row.watershed_name || "Unassigned",
    date: formatDisplayDate(row.captured_at || row.created_at),
    size: row.size != null ? String(row.size) : "—",
    status,
    badge: statusBadge(status),
  };
}

function mapReport(row: ApiReport): AnalysisReport {
  const fileName = row.file_path?.split(/[/\\]/).pop() || `Report ${row.id}`;
  return {
    id: row.id,
    title: fileName,
    watershed: row.watershed_name || "Unassigned",
    generated: formatDisplayDate(row.created_at),
    pages: null,
    status: row.status || "Ready",
    highlights: [],
  };
}

const defaultWatersheds: Watershed[] = [
  {
    id: 1,
    name: "Upper Bhima Basin",
    region: "Maharashtra, India",
    area: "4,820 km²",
    area_sqkm: 4820,
    lastUpdated: "18 Nov 2026",
    risk: "High Erosion Risk",
    riskBadge: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  {
    id: 2,
    name: "Ghod River Catchment",
    region: "Maharashtra, India",
    area: "2,340 km²",
    area_sqkm: 2340,
    lastUpdated: "17 Nov 2026",
    risk: "Moderate",
    riskBadge: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  {
    id: 3,
    name: "Indrayani Valley Watershed",
    region: "Maharashtra, India",
    area: "1,180 km²",
    area_sqkm: 1180,
    lastUpdated: "15 Nov 2026",
    risk: "Low Risk",
    riskBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  {
    id: 4,
    name: "Mula-Mutha Confluence Sector",
    region: "Maharashtra, India",
    area: "860 km²",
    area_sqkm: 860,
    lastUpdated: "12 Nov 2026",
    risk: "Moderate",
    riskBadge: "bg-amber-50 text-amber-700 border border-amber-200",
  },
];

const defaultTelemetry: CatchmentTelemetry = {
  catchmentArea: "4,820 km²",
  catchmentDelta: "+3.2% runoff efficiency vs baseline",
  activeInterventions: "142",
  interventionsLabel: "Check dams, farm ponds & trenches",
  waterQualityIndex: "78.4 / 100",
  waterQualityDetail: "Good condition · Turbidity normal",
  systemStatus: "98.2%",
  systemStatusDetail: "Hydrological sensors operational",
  temperature: "28°C",
  weatherCondition: "Partly Cloudy",
  humidity: "64%",
  windSpeed: "14 km/h",
  visibility: "8.5 km",
};

const defaultStreamflow: StreamflowRecord[] = [
  { month: "Jan", flow: 120, rainfall: 45 },
  { month: "Feb", flow: 140, rainfall: 50 },
  { month: "Mar", flow: 180, rainfall: 65 },
  { month: "Apr", flow: 210, rainfall: 90 },
  { month: "May", flow: 290, rainfall: 140 },
  { month: "Jun", flow: 480, rainfall: 320 },
  { month: "Jul", flow: 640, rainfall: 480 },
  { month: "Aug", flow: 590, rainfall: 420 },
  { month: "Sep", flow: 410, rainfall: 260 },
  { month: "Oct", flow: 270, rainfall: 130 },
  { month: "Nov", flow: 190, rainfall: 75 },
  { month: "Dec", flow: 135, rainfall: 40 },
];

const defaultHotspots: HotspotItem[] = [
  { id: "HS-01", name: "North Ridge Gully System", capacity: "Critical run-off zone · Slope > 24°", risk: "high" },
  { id: "HS-02", name: "Central Confluence Sector", capacity: "Silt accumulation zone", risk: "high" },
  { id: "HS-03", name: "East Bank Valley Escarpment", capacity: "Moderate erosion risk · Silt check needed", risk: "medium" },
  { id: "HS-04", name: "Upper Plateau Infiltration Basin", capacity: "Stabilized pasture · Minimal erosion", risk: "low" },
];

const defaultObservations: Observation[] = [
  {
    id: "OBS-001",
    date: "18 NOV 2026",
    coords: "18.5204° N, 73.8567° E",
    lat: 18.5204,
    lng: 73.8567,
    landUse: "Dense Forest / Ridge",
    vegetation: "Broadleaf Canopy (NDVI 0.72)",
    erosion: "Low (Stable)",
    confidence: 94,
    notes: "Upstream catchment boundary in healthy condition. Minimal soil dislocation.",
    svgX: 380,
    svgY: 220,
  },
  {
    id: "OBS-002",
    date: "17 NOV 2026",
    coords: "18.4892° N, 73.9102° E",
    lat: 18.4892,
    lng: 73.9102,
    landUse: "Agricultural Terrace",
    vegetation: "Seasonal Crops (NDVI 0.44)",
    erosion: "Moderate (Gully forming)",
    confidence: 86,
    notes: "Active drainage channel requires stone pitching along lower perimeter.",
    svgX: 520,
    svgY: 340,
  },
  {
    id: "OBS-003",
    date: "16 NOV 2026",
    coords: "18.4410° N, 73.8210° E",
    lat: 18.4410,
    lng: 73.8210,
    landUse: "Degraded Scrubland",
    vegetation: "Sparse Bush (NDVI 0.18)",
    erosion: "Critical (Severe Gully)",
    confidence: 91,
    notes: "High priority intervention required. Proposed continuous contour trenching.",
    svgX: 280,
    svgY: 460,
  },
];

const defaultLayers: MapLayer[] = [
  { id: "landuse", name: "Land Use Layer", visible: false, type: "polygon", color: "#65a30d" },
  { id: "drainage", name: "Drainage Network", visible: true, type: "line", color: "#2563eb" },
  { id: "vegetation", name: "Vegetation Layer", visible: true, type: "polygon", color: "#16a34a" },
  { id: "water", name: "Water Bodies", visible: true, type: "line", color: "#0284c7" },
  { id: "erosion", name: "Soil Erosion", visible: true, type: "polygon", color: "#ea580c" },
  { id: "geocoded", name: "Geo-coded Images", visible: true, type: "point", color: "#059669" },
  { id: "checkdams", name: "Check Dams", visible: false, type: "point", color: "#0284c7" },
  { id: "farmponds", name: "Farm Ponds", visible: false, type: "polygon", color: "#38bdf8" },
  { id: "priority", name: "Priority Zones", visible: true, type: "pattern", color: "#d97706" },
  { id: "monitoring", name: "Monitoring Locations", visible: false, type: "point", color: "#10b981" },
];

const WatershedContext = createContext<WatershedContextType | undefined>(undefined);

export const WatershedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedWatershed, setSelectedWatershed] = useState<string>("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const [watersheds, setWatersheds] = useState<Watershed[]>(() => loadStored("watersheds", defaultWatersheds));
  const [observations, setObservations] = useState<Observation[]>(() => loadStored("observations", defaultObservations));
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [images, setImages] = useState<ImageryItem[]>(() => loadStored("images", []));
  const [zones, setZones] = useState<PriorityZone[]>(() => loadStored("zones", []));
  const [interventions, setInterventions] = useState<Intervention[]>(() => loadStored("interventions", []));
  const [reports, setReports] = useState<AnalysisReport[]>(() => loadStored("reports", []));
  const [telemetry, setTelemetry] = useState<CatchmentTelemetry>(() => ({
    ...defaultTelemetry,
    ...loadStored("telemetry", {}),
  }));
  const [streamflow, setStreamflow] = useState<StreamflowRecord[]>(() => loadStored("streamflow", defaultStreamflow));
  const [hotspots, setHotspots] = useState<HotspotItem[]>(() => loadStored("hotspots", defaultHotspots));
  const [layers, setLayers] = useState<MapLayer[]>(() => loadStored("layers", defaultLayers));

  // Initialize selected watershed
  useEffect(() => {
    if (!selectedWatershed && watersheds.length > 0) {
      setSelectedWatershed(watersheds[0].name);
    }
  }, [watersheds, selectedWatershed]);

  // Set default selected observation initially
  useEffect(() => {
    if (observations.length > 0 && !selectedObservation) {
      setSelectedObservation(observations[0]);
    }
  }, [observations, selectedObservation]);

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const [wsRows, imageRows, reportRows] = await Promise.all([
        api.listWatersheds(),
        api.listImages(),
        api.listReports(),
      ]);
      if (Array.isArray(wsRows) && wsRows.length > 0) {
        const mappedWatersheds = wsRows.map(mapWatershed);
        setWatersheds(mappedWatersheds);
        setSelectedWatershed((current) => {
          if (current && mappedWatersheds.some((w) => w.name === current)) return current;
          return mappedWatersheds[0]?.name || "";
        });
      }
      if (Array.isArray(imageRows) && imageRows.length > 0) {
        setImages(imageRows.map(mapImage));
      }
      if (Array.isArray(reportRows) && reportRows.length > 0) {
        setReports(reportRows.map(mapReport));
      }
      setApiConnected(true);
    } catch {
      setApiConnected(false);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  // Sync state to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${STORAGE_PREFIX}watersheds`, JSON.stringify(watersheds));
    localStorage.setItem(`${STORAGE_PREFIX}observations`, JSON.stringify(observations));
    localStorage.setItem(`${STORAGE_PREFIX}images`, JSON.stringify(images));
    localStorage.setItem(`${STORAGE_PREFIX}zones`, JSON.stringify(zones));
    localStorage.setItem(`${STORAGE_PREFIX}interventions`, JSON.stringify(interventions));
    localStorage.setItem(`${STORAGE_PREFIX}reports`, JSON.stringify(reports));
    localStorage.setItem(`${STORAGE_PREFIX}layers`, JSON.stringify(layers));
    localStorage.setItem(`${STORAGE_PREFIX}telemetry`, JSON.stringify(telemetry));
    localStorage.setItem(`${STORAGE_PREFIX}streamflow`, JSON.stringify(streamflow));
    localStorage.setItem(`${STORAGE_PREFIX}hotspots`, JSON.stringify(hotspots));
  }, [watersheds, observations, images, zones, interventions, reports, layers, telemetry, streamflow, hotspots]);

  // Telemetry Updater
  const updateTelemetry = (updated: Partial<CatchmentTelemetry>) => {
    setTelemetry((prev) => ({ ...prev, ...updated }));
  };

  // Streamflow Record Updaters
  const updateStreamflowRecord = (month: string, flow: number, rainfall: number) => {
    setStreamflow((prev) =>
      prev.map((r) => (r.month.toLowerCase() === month.toLowerCase() ? { ...r, flow, rainfall } : r))
    );
  };

  const addStreamflowRecord = (record: StreamflowRecord) => {
    setStreamflow((prev) => [...prev, record]);
  };

  // Hotspots Updaters
  const addHotspot = (item: Omit<HotspotItem, "id">) => {
    const id = `HS-${Date.now().toString().slice(-4)}`;
    setHotspots((prev) => [{ ...item, id }, ...prev]);
  };

  const deleteHotspot = (id: string) => {
    setHotspots((prev) => prev.filter((h) => h.id !== id));
  };

  // Delete & Update Observation Handlers
  const deleteObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
    if (selectedObservation?.id === id) {
      setSelectedObservation(null);
    }
  };

  const updateObservation = (id: string, updated: Partial<Observation>) => {
    setObservations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updated } : o))
    );
    if (selectedObservation?.id === id) {
      setSelectedObservation((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const addWatershed = (ws: Omit<Watershed, "id" | "lastUpdated" | "riskBadge">) => {
    const isCritical = ws.risk.toLowerCase().includes("high") || ws.risk.toLowerCase().includes("critical");
    const riskBadge = isCritical
      ? "bg-rose-50 text-rose-700 border border-rose-200"
      : ws.risk.toLowerCase().includes("moderate")
        ? "bg-amber-50 text-amber-700 border border-amber-200"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200";

    const applyLocal = (id: number) => {
      const newWs: Watershed = {
        ...ws,
        id,
        lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        riskBadge,
      };
      setWatersheds((prev) => [newWs, ...prev]);
      if (!selectedWatershed) setSelectedWatershed(newWs.name);
    };

    void api
      .createWatershed({ name: ws.name })
      .then((created) => applyLocal(created.id))
      .catch(() => applyLocal(Date.now()));
  };

  const deleteWatershed = (id: number) => {
    setWatersheds((prev) => prev.filter((w) => w.id !== id));
    void api.deleteWatershed(id).catch(() => {});
  };

  // Add Observation Handler
  const addObservation = (obs: Omit<Observation, "id" | "date" | "svgX" | "svgY"> & { customId?: string }) => {
    const id = obs.customId || `OBS-${Date.now().toString().slice(-6)}`;
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

    const normalizedX = Math.min(900, Math.max(150, Math.round(200 + ((obs.lng - 73.5) / 1.0) * 600)));
    const normalizedY = Math.min(600, Math.max(100, Math.round(600 - ((obs.lat - 18.0) / 1.5) * 500)));

    const newObs: Observation = {
      ...obs,
      id,
      date,
      svgX: normalizedX,
      svgY: normalizedY,
    };

    setObservations((prev) => [newObs, ...prev]);
    setSelectedObservation(newObs);
  };

  const addImages = (newFiles: { name: string; size: number; watershed: string; file?: File }[]) => {
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const target = watersheds.find((w) => w.name === newFiles[0]?.watershed);

    void (async () => {
      const uploaded: ImageryItem[] = [];
      for (const [i, f] of newFiles.entries()) {
        if (f.file && target) {
          try {
            const result = await api.uploadImage(f.file, target.id);
            uploaded.push(mapImage({ ...result.image, watershed_name: target.name, file_path: result.image.file_path || f.name }));
            continue;
          } catch {
            // Fall through to local catalog entry using the real file name
          }
        }
        uploaded.push({
          id: Date.now() + i,
          name: f.name,
          watershed: f.watershed,
          date: today,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          status: target ? "Queued locally" : "Unassigned",
          badge: "bg-amber-50 text-amber-700 border border-amber-200",
        });
      }
      setImages((prev) => [...uploaded, ...prev]);
    })();
  };

  // Add Priority Zone
  const addZone = (zone: Omit<PriorityZone, "badge">) => {
    const isCritical = zone.risk.toLowerCase().includes("critical") || zone.risk.toLowerCase().includes("high");
    const badge = isCritical
      ? "bg-rose-50 text-rose-700 border border-rose-200"
      : zone.risk.toLowerCase().includes("moderate")
        ? "bg-amber-50 text-amber-700 border border-amber-200"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200";

    setZones((prev) => [{ ...zone, badge }, ...prev]);
  };

  // Add Intervention
  const addIntervention = (intv: Omit<Intervention, "id">) => {
    const id = `INT-${Math.floor(100 + Math.random() * 900)}`;
    setInterventions((prev) => [{ ...intv, id }, ...prev]);
  };

  const generateReport = (watershedName: string, title?: string) => {
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const target = watersheds.find((w) => w.name === watershedName);
    const localReport = (id: number, status: string): AnalysisReport => ({
      id,
      title: title || `${watershedName} synthesis report`,
      watershed: watershedName,
      generated: today,
      pages: null,
      status,
      highlights: [],
    });

    if (target) {
      void api
        .generateReport(target.id, target.name)
        .then((created) => {
          setReports((prev) => [mapReport(created), ...prev]);
        })
        .catch(() => {
          setReports((prev) => [localReport(Date.now(), "Offline cached"), ...prev]);
        });
      return;
    }

    setReports((prev) => [localReport(Date.now(), "Queued locally"), ...prev]);
  };

  const toggleLayer = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  };

  const addLayer = (layer: Omit<MapLayer, "id">) => {
    const id = `layer_${Date.now()}`;
    setLayers((prev) => [...prev, { ...layer, id }]);
  };

  return (
    <WatershedContext.Provider
      value={{
        watersheds,
        selectedWatershed,
        setSelectedWatershed,
        addWatershed,
        deleteWatershed,
        observations,
        selectedObservation,
        setSelectedObservation,
        addObservation,
        deleteObservation,
        updateObservation,
        telemetry,
        updateTelemetry,
        streamflow,
        updateStreamflowRecord,
        addStreamflowRecord,
        hotspots,
        addHotspot,
        deleteHotspot,
        images,
        addImages,
        zones,
        addZone,
        interventions,
        addIntervention,
        reports,
        generateReport,
        layers,
        toggleLayer,
        addLayer,
        catalogLoading,
        apiConnected,
        refreshCatalog,
      }}
    >
      {children}
    </WatershedContext.Provider>
  );
};

export function useWatershed() {
  const context = useContext(WatershedContext);
  if (!context) {
    throw new Error("useWatershed must be used within a WatershedProvider");
  }
  return context;
}
