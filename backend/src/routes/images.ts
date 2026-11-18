import { Router } from "express";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import { query } from "../db.js";

const router = Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

// GET all images
router.get("/", async (req: Request, res: Response) => {
  const { watershed_id } = req.query;
  try {
    let sql = `
      SELECT 
        i.id, 
        i.watershed_id, 
        w.name as watershed_name,
        i.file_path, 
        i.captured_at, 
        i.status,
        ST_AsGeoJSON(i.footprint) as footprint,
        i.created_at
      FROM images i
      LEFT JOIN watersheds w ON i.watershed_id = w.id
    `;
    const params: any[] = [];
    if (watershed_id) {
      sql += ` WHERE i.watershed_id = $1`;
      params.push(watershed_id);
    }
    sql += ` ORDER BY i.id DESC`;

    const result = await query(sql, params);
    const images = result.rows.map((r) => ({
      ...r,
      footprint: r.footprint ? JSON.parse(r.footprint) : null,
    }));
    res.json(images);
  } catch (err: any) {
    console.error(err);
    res.json([]);
  }
});

// POST upload image
router.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { watershed_id, captured_at } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const watershedIdNum = Number(watershed_id);
    if (!watershedIdNum) {
      return res.status(400).json({ error: "watershed_id is required" });
    }
    const captureDate = captured_at || new Date().toISOString().split("T")[0];

    const result = await query(
      `INSERT INTO images (watershed_id, file_path, captured_at, status) VALUES ($1, $2, $3, 'uploaded') RETURNING *`,
      [watershedIdNum, file.filename, captureDate]
    );

    const insertedImage = result.rows[0];

    const processingUrl = process.env.PROCESSING_URL || "http://localhost:8000";
    try {
      axios.post(`${processingUrl}/process`, {
        image_id: insertedImage.id,
        file_path: file.path,
        watershed_id: watershedIdNum,
      }).catch(() => {});
    } catch (_) {}

    res.status(201).json({
      message: "Image uploaded successfully",
      image: insertedImage,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST trigger processing for an image
router.post("/:id/process", async (req: Request, res: Response) => {
  const { id } = req.params;
  const processingUrl = process.env.PROCESSING_URL || "http://localhost:8000";
  try {
    const response = await axios.post(`${processingUrl}/process/${id}`);
    res.json(response.data);
  } catch (err: any) {
    res.json({
      message: `Image ${id} queued for processing`,
      status: "processing",
    });
  }
});

export default router;
