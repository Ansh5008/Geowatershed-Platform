import { Router } from "express";
import type { Request, Response } from "express";
import { query } from "../db.js";

const router = Router();

// GET all watersheds with GeoJSON boundary
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        id, 
        name, 
        ST_AsGeoJSON(boundary) as boundary,
        ROUND((ST_Area(boundary::geography) / 1000000)::numeric, 2) as area_sqkm,
        created_at 
      FROM watersheds 
      ORDER BY id ASC
    `);

    const watersheds = result.rows.map((row) => ({
      ...row,
      boundary: row.boundary ? JSON.parse(row.boundary) : null,
    }));

    res.json(watersheds);
  } catch (err: any) {
    console.error(err);
    res.json([]);
  }
});

// GET watershed by ID with related layers, images and reports
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const wsResult = await query(
      `SELECT id, name, ST_AsGeoJSON(boundary) as boundary, created_at FROM watersheds WHERE id = $1`,
      [id]
    );

    if (wsResult.rows.length === 0) {
      return res.status(404).json({ error: "Watershed not found" });
    }

    const watershed = wsResult.rows[0];
    watershed.boundary = watershed.boundary ? JSON.parse(watershed.boundary) : null;

    const [imagesResult, layersResult, reportsResult] = await Promise.all([
      query(`SELECT id, file_path, captured_at, status, ST_AsGeoJSON(footprint) as footprint FROM images WHERE watershed_id = $1`, [id]),
      query(`SELECT id, type, properties, ST_AsGeoJSON(geom) as geom FROM layers WHERE watershed_id = $1`, [id]),
      query(`SELECT id, file_path, created_at FROM reports WHERE watershed_id = $1`, [id]),
    ]);

    res.json({
      ...watershed,
      images: imagesResult.rows,
      layers: layersResult.rows,
      reports: reportsResult.rows,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST create watershed
router.post("/", async (req: Request, res: Response) => {
  const { name, boundary } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Watershed name is required" });
  }

  try {
    let result;
    if (boundary) {
      result = await query(
        `INSERT INTO watersheds (name, boundary) VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326)) RETURNING id, name, created_at`,
        [name, JSON.stringify(boundary)]
      );
    } else {
      result = await query(
        `INSERT INTO watersheds (name) VALUES ($1) RETURNING id, name, created_at`,
        [name]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE watershed
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM watersheds WHERE id = $1`, [id]);
    res.json({ success: true, message: `Watershed ${id} deleted` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
