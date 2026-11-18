"""
AI Analysis modules for Land-Use/Land-Cover classification,
field observation confidence scoring, and erosion risk prioritization.
"""

def classify_observation(ndvi: float, slope_deg: float, stream_dist_m: float) -> dict:
    """
    Classifies a field observation coordinate using multi-factor heuristics.
    """
    # Land use prediction
    if ndvi > 0.6:
        land_use = "Dense riparian canopy / Forest buffer"
    elif ndvi > 0.35:
        land_use = "Rainfed cropland"
    elif ndvi > 0.15:
        land_use = "Scrubland / Grazing field"
    else:
        land_use = "Barren / Rocky outcrop"

    # Soil erosion risk
    if slope_deg > 20 and stream_dist_m < 150:
        erosion_risk = "Critical"
        priority = True
    elif slope_deg > 12:
        erosion_risk = "High risk"
        priority = True
    elif slope_deg > 5:
        erosion_risk = "Moderate"
        priority = False
    else:
        erosion_risk = "Low risk"
        priority = False

    confidence_score = min(98, max(75, int(85 + (ndvi * 10) - (slope_deg * 0.2))))

    return {
        "land_use": land_use,
        "erosion_risk": erosion_risk,
        "priority_intervention": priority,
        "ai_confidence_pct": confidence_score,
        "recommended_structure": "Continuous contour trench" if slope_deg > 15 else "Check dam",
    }

