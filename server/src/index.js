import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import leadRoutes from "./routes/leads.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Happhygreenz API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/leads", leadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Unexpected server error",
  });
});

async function start() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  app.listen(port, () => {
    console.log(`Happhygreenz kiosk API listening on ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
