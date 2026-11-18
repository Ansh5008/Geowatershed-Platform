import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import watershedsRouter from "./routes/watersheds.js";
import imagesRouter from "./routes/images.js";
import layersRouter from "./routes/layers.js";
import reportsRouter from "./routes/reports.js";
import analyzeRouter from "./routes/analyze.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "GeoWatershed Analysis Platform API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/watersheds", watershedsRouter);
app.use("/images", imagesRouter);
app.use("/layers", layersRouter);
app.use("/reports", reportsRouter);
app.use("/analyze", analyzeRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`GeoWatershed API running on http://localhost:${PORT}`);
});

export default app;
