-- Initial Seed Data for GeoWatershed Spatial Intelligence Platform

INSERT INTO watersheds (name) VALUES 
  ('Upper Bhima Basin'),
  ('Ghod River Catchment'),
  ('Indrayani Valley Watershed'),
  ('Mula-Mutha Confluence Sector')
ON CONFLICT DO NOTHING;

-- Initial reports placeholder
INSERT INTO reports (watershed_id, file_path) 
SELECT id, 'watershed_synthesis_2026.pdf' FROM watersheds WHERE name = 'Upper Bhima Basin'
LIMIT 1;
