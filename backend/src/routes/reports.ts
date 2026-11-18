import { Router } from "express";
import type { Request, Response } from "express";
import axios from "axios";
import { query } from "../db.js";

const router = Router();

// GET reports
router.get("/", async (req: Request, res: Response) => {
  const { watershed_id } = req.query;
  try {
    let sql = `
      SELECT 
        r.id, 
        r.watershed_id, 
        w.name as watershed_name,
        r.file_path, 
        r.created_at
      FROM reports r
      LEFT JOIN watersheds w ON r.watershed_id = w.id
    `;
    const params: any[] = [];
    if (watershed_id) {
      sql += ` WHERE r.watershed_id = $1`;
      params.push(watershed_id);
    }
    sql += ` ORDER BY r.id DESC`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err: any) {
    console.error(err);
    res.json([]);
  }
});

// POST generate new report
router.post("/generate", async (req: Request, res: Response) => {
  const { watershed_id, watershed_name } = req.body;
  const watershedIdNum = Number(watershed_id);
  if (!watershedIdNum) {
    return res.status(400).json({ error: "watershed_id is required" });
  }
  const processingUrl = process.env.PROCESSING_URL || "http://localhost:8000";

  let reportPath = `report_watershed_${watershedIdNum}_${Date.now()}.pdf`;

  // Try to call Python processing service; ignore if unavailable
  try {
    const pyResponse = await axios.post(`${processingUrl}/reports/generate`, {
      watershed_id: watershedIdNum,
      watershed_name: watershed_name || undefined,
    });
    if (pyResponse.data?.file_path) {
      reportPath = pyResponse.data.file_path;
    }
  } catch {
    // Python service offline - create a placeholder report record
  }

  try {
    const result = await query(
      `INSERT INTO reports (watershed_id, file_path) VALUES ($1, $2) RETURNING *`,
      [watershedIdNum, reportPath]
    );
    res.status(201).json({ ...result.rows[0], watershed_name: watershed_name || null });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
