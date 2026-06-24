import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import analyzeRouter from "./routes/analyze";
import apiRouter from "./routes/api";

const PORT = process.env.PORT || 5000;

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "active", service: "NexusAgent Risk Engine API" });
});

// API Routes
app.use("/api/analyze", analyzeRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`🛡️ NexusAgent Backend running on port ${PORT}`);
});
