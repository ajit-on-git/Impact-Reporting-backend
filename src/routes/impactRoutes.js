import express from "express";
import { generateImpactReport } from "../controllers/impactController.js";

const router = express.Router();

/**
 * @route POST /api/impact/generate
 * @desc Generate a sustainability impact report
 * @body customerName, productName, quantity, productMaterial, sourceDistance
 *       Optional: baselineWeight, newWeight, pcrRatio, reuseFactor, transportMode, eolDistribution
 */
router.post("/generate", generateImpactReport);

export default router;
