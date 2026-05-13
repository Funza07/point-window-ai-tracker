import express from "express";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import authRoutes from "./routes/auth.routes.js";
import titlesRoutes from "./routes/titles.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import recommendationsRoutes from "./routes/recommendations.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/titles", titlesRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/ai", aiRoutes);
app.use(errorMiddleware);

export default app;
