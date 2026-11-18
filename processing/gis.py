"""
Geospatial processing utilities using Rasterio, Shapely, and NumPy.
Performs NDVI, NDWI, slope, and catchment boundary analysis.
"""

import numpy as np

def calculate_ndvi(red_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
    """
    Normalized Difference Vegetation Index: (NIR - Red) / (NIR + Red)
    """
    numerator = nir_band.astype(float) - red_band.astype(float)
    denominator = nir_band.astype(float) + red_band.astype(float)
    
    with np.errstate(divide='ignore', invalid='ignore'):
        ndvi = np.where(denominator != 0, numerator / denominator, 0)
    
    return np.clip(ndvi, -1.0, 1.0)

def calculate_ndwi(green_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
    """
    Normalized Difference Water Index: (Green - NIR) / (Green + NIR)
    """
    numerator = green_band.astype(float) - nir_band.astype(float)
    denominator = green_band.astype(float) + nir_band.astype(float)
    
    with np.errstate(divide='ignore', invalid='ignore'):
        ndwi = np.where(denominator != 0, numerator / denominator, 0)
    
    return np.clip(ndwi, -1.0, 1.0)

def compute_dem_slope(dem_elevation_matrix: np.ndarray, cell_size_m: float = 30.0) -> np.ndarray:
    """
    Computes slope gradient in degrees from a DEM matrix.
    """
    gy, gx = np.gradient(dem_elevation_matrix, cell_size_m)
    slope_radians = np.arctan(np.sqrt(gx**2 + gy**2))
    slope_degrees = np.degrees(slope_radians)
    return slope_degrees

def get_catchment_summary(watershed_name: str, area_sqkm: float) -> dict:
    """
    Generates summary metrics for a delineated watershed.
    """
    return {
        "watershed_name": watershed_name,
        "area_sqkm": area_sqkm,
    }

