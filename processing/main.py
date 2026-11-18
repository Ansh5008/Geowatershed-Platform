"""
GeoWatershed FastAPI microservice for spatial analytics, AI classification,
and ReportLab PDF synthesis.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from gis import get_catchment_summary
from ai import classify_observation
from report import generate_pdf_report

app = FastAPI(
    title="GeoWatershed Processing Engine",
    description="Python microservice for GIS modeling, AI terrain classification, and PDF generation",
    version="1.0.0"
)

class ObservationRequest(BaseModel):
    ndvi: float
    slope_deg: float
    stream_dist_m: float

class ReportRequest(BaseModel):
    watershed_id: int
    watershed_name: Optional[str] = None

class ProcessImageRequest(BaseModel):
    image_id: int
    file_path: str
    watershed_id: int

@app.get("/")
def root():
    return {
        "service": "GeoWatershed Processing Engine",
        "status": "online",
        "supported_features": ["NDVI", "NDWI", "DEM Slope", "Observation AI Scoring", "PDF Reports"]
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze/observation")
def analyze_field_observation(req: ObservationRequest):
    return classify_observation(req.ndvi, req.slope_deg, req.stream_dist_m)

@app.post("/reports/generate")
def create_report(req: ReportRequest):
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "uploads"))
    filename = f"report_watershed_{req.watershed_id}_{int(os.times().elapsed)}.pdf"
    output_path = os.path.join(output_dir, filename)

    generate_pdf_report(req.watershed_id, req.watershed_name or f"Watershed {req.watershed_id}", output_path)

    return {
        "message": "Report generated successfully",
        "file_path": filename,
        "watershed_id": req.watershed_id
    }

@app.post("/process")
def process_imagery(req: ProcessImageRequest):
    summary = get_catchment_summary(f"watershed_{req.watershed_id}", 0)
    return {
        "status": "processed",
        "image_id": req.image_id,
        "summary": summary
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

