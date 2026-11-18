export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: init?.body instanceof FormData
      ? init.headers
      : { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data && "error" in data
        ? String((data as { error: string }).error)
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export type ApiWatershed = {
  id: number;
  name: string;
  area_sqkm?: number | string | null;
  created_at?: string;
  boundary?: unknown;
};

export type ApiImage = {
  id: number;
  watershed_id?: number;
  watershed_name?: string | null;
  file_path: string;
  captured_at?: string | null;
  status?: string | null;
  created_at?: string;
  size?: string | number | null;
};

export type ApiReport = {
  id: number;
  watershed_id?: number;
  watershed_name?: string | null;
  file_path?: string | null;
  created_at?: string;
  status?: string;
};

export type ApiLayer = {
  id: number;
  watershed_id?: number;
  type: string;
  properties?: Record<string, unknown> | null;
  geom?: unknown;
};

export const api = {
  health: () => request<{ status: string }>("/health"),
  listWatersheds: () => request<ApiWatershed[]>("/watersheds"),
  createWatershed: (body: { name: string; boundary?: unknown }) =>
    request<ApiWatershed>("/watersheds", { method: "POST", body: JSON.stringify(body) }),
  deleteWatershed: (id: number) =>
    request<{ success: boolean }>(`/watersheds/${id}`, { method: "DELETE" }),
  listImages: (watershedId?: number) =>
    request<ApiImage[]>(watershedId ? `/images?watershed_id=${watershedId}` : "/images"),
  uploadImage: (file: File, watershedId: number) => {
    const form = new FormData();
    form.append("image", file);
    form.append("watershed_id", String(watershedId));
    return request<{ image: ApiImage }>("/images/upload", { method: "POST", body: form });
  },
  listReports: (watershedId?: number) =>
    request<ApiReport[]>(watershedId ? `/reports?watershed_id=${watershedId}` : "/reports"),
  generateReport: (watershedId: number, watershedName?: string) =>
    request<ApiReport>("/reports/generate", {
      method: "POST",
      body: JSON.stringify({ watershed_id: watershedId, watershed_name: watershedName }),
    }),
  listLayers: (watershedId?: number) =>
    request<ApiLayer[]>(watershedId ? `/layers?watershed_id=${watershedId}` : "/layers"),
  analyzeObservation: (body: { ndvi: number; slope_deg: number; stream_dist_m: number }) =>
    request<{
      land_use: string;
      erosion_risk: string;
      ai_confidence_pct: number;
      recommended_structure: string;
    }>("/analyze/observation", { method: "POST", body: JSON.stringify(body) }),
  trainModel: (body: { modelType?: string; epochs?: number; learningRate?: number; batchSize?: number }) =>
    request<{
      success: boolean;
      modelType: string;
      epochs: number;
      learningRate: number;
      weightsVersion: string;
      metrics: { accuracy: number; precision: number; recall: number; f1Score: number };
      featureImportance: { feature: string; weight: number }[];
      trainingHistory: { epoch: number; loss: number; valAccuracy: number }[];
    }>("/analyze/train", { method: "POST", body: JSON.stringify(body) }),
};

export function formatDisplayDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
