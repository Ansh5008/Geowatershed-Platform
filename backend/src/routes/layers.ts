import { Router } from "express";
import type { Request, Response } from "express";
import { query } from "../db.js";

const router = Router();

// GET layers
router.get("/", async (req: Request, res: Response) => {
  const { watershed_id, type } = req.query;
  try {
    let sql = `
      SELECT 
        l.id, 
        l.watershed_id, 
        l.image_id, 
        l.type, 
        l.properties,
        ST_AsGeoJSON(l.geom) as geom,
        l.created_at
      FROM layers l
      WHERE 1=1
    `;
    const params: any[] = [];
    if (watershed_id) {
      params.push(watershed_id);
      sql += ` AND l.watershed_id = $${params.length}`;
    }
    if (type) {
      params.push(type);
      sql += ` AND l.type = $${params.length}`;
    }
    sql += ` ORDER BY l.id ASC`;

    const result = await query(sql, params);
    const layers = result.rows.map((r) => ({
      ...r,
      geom: r.geom ? JSON.parse(r.geom) : null,
    }));
    res.json(layers);
  } catch (err: any) {
    console.error(err);
    res.json([]);
  }
});

// POST create layer
router.post("/", async (req: Request, res: Response) => {
  const { watershed_id, image_id, type, geom, properties } = req.body;
  if (!watershed_id || !type) {
    return res.status(400).json({ error: "watershed_id and type are required" });
  }

  try {
    let result;
    if (geom) {
      result = await query(
        `INSERT INTO layers (watershed_id, image_id, type, geom, properties) 
         VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326), $5) RETURNING id, type, properties, created_at`,
        [watershed_id, image_id || null, type, JSON.stringify(geom), properties || {}]
      );
    } else {
      result = await query(
        `INSERT INTO layers (watershed_id, image_id, type, properties) 
         VALUES ($1, $2, $3, $4) RETURNING id, type, properties, created_at`,
        [watershed_id, image_id || null, type, properties || {}]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
