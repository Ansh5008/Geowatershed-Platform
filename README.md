# GeoWatershed · Spatial Intelligence & Catchment Monitoring Platform

GeoWatershed is a full-stack geospatial intelligence platform for hydrological monitoring, catchment modeling, and terrain analysis.

## Architecture

- **Frontend (`frontend/`)**: Next.js 16 (App Router), Tailwind CSS v4 with custom claymorphic UI utilities, Recharts, Leaflet/React-Leaflet, and a full reactive `WatershedContext` with dual-persistence (local offline storage + live PostgreSQL backend bridge).
- **Backend API (`backend/`)**: Node.js Express service running on `http://localhost:5000` with routes for watersheds, image management, GIS layers, reports, and heuristic/AI observation analytics.
- **Database (`database/`)**: PostGIS-enabled PostgreSQL schema (`schema.sql` and `seed.sql`) for spatial boundaries, imagery footprints, and GIS layers.
- **Processing (`processing/`)**: Python microservice (FastAPI + Rasterio + ReportLab) on port 8000 for raster computation and PDF report generation (optional, with automatic graceful fallback built into the backend).

## Running the Platform

### Quick Start (Both Backend & Frontend)
Run the convenience PowerShell script:
```powershell
.\start-dev.ps1
```

### Manual Start

1. **Start Backend Server (Port 5000)**:
   ```powershell
   cd backend
   npm run dev
   ```

2. **Start Frontend Client (Port 3000)**:
   ```powershell
   cd frontend
   npm run dev
   ```

3. Open **`http://localhost:3000`** in your browser.

## Features & Dynamic Data Entry

- **No Hardcoded Data**: All metrics, monthly streamflow, rainfall, erosion density hotspots, and field observations are 100% editable and user-enterable via interactive modals.
- **Claymorphic UI**: High-fidelity modern claymorphic design matching the Figma specification (dark forest green sidebar `#1a3328`, soft pastel metric cards, and clean white cards).
- **Dual Persistence**: Works seamlessly standalone with browser `localStorage`, and synchronizes automatically with the Express API and PostGIS database when the backend is active.
- **Next.js Proxying**: Frontend proxies all `/api/*` requests to `http://localhost:5000/*` via Next.js rewrite rules.
