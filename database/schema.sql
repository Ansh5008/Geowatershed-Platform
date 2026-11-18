CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE watersheds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  boundary GEOMETRY(Polygon, 4326),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  watershed_id INT REFERENCES watersheds(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  captured_at DATE,
  footprint GEOMETRY(Polygon, 4326),
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE layers (
  id SERIAL PRIMARY KEY,
  watershed_id INT REFERENCES watersheds(id) ON DELETE CASCADE,
  image_id INT REFERENCES images(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  geom GEOMETRY(Geometry, 4326),
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  watershed_id INT REFERENCES watersheds(id),
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);