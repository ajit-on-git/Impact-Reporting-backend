import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import impactRoutes from "./src/routes/impactRoutes.js";

dotenv.config();

const app = express();

// ---------------------
// Middleware
// ---------------------
// Correct origin without trailing slash
app.use(
  cors({
    origin: [
      "https://impact-reporting-frontend-1a7grb21s-ajit-on-gits-projects.vercel.app",
      "https://impact-reporting-frontend.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ---------------------
// Routes
// ---------------------
app.use("/api/impact", impactRoutes);

// ---------------------
// MongoDB Connection
// ---------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ---------------------
// Server Start
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.GEMINI_API_KEY) {
    console.log("Gemini API Key loaded successfully.");
  } else {
    console.warn("⚠️ GEMINI_API_KEY not found in .env");
  }
});
