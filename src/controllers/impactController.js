import Order from "../models/Order.js";
import {
  calculatePlasticSaved,
  calculateCarbonAvoided,
  generateLocalSourcingSummary,
} from "../services/impactService.js";

import { generateImpactStatement } from "../services/aiService.js";

export const generateImpactReport = async (req, res) => {
  try {
    const {
      customerName,
      productName,
      quantity,
      productMaterial,
      sourceDistance,
      baselineWeight = 0, // grams per unit, default 0
      newWeight = 0, // grams per unit, default 0
      pcrRatio = 0, // fraction of recycled content (0-1)
      reuseFactor = 1, // default 1
      transportMode = "truck", // default truck
      eolDistribution = {
        landfill: 0.7,
        incineration: 0.2,
        recycling: 0.1,
        reuse: 0,
      }, // default fractions
    } = req.body;

    // ---------------------
    // Input Validation
    // ---------------------
    if (!productName || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data: productName and quantity are required",
      });
    }

    // ---------------------
    // Real-World Sustainability Calculations
    // ---------------------
    const plasticSaved = calculatePlasticSaved({
      materialType: productMaterial,
      baselineWeight,
      newWeight,
      quantity,
      pcrRatio,
      reuseFactor,
    });

    const carbonAvoided = calculateCarbonAvoided({
      materialType: productMaterial,
      plasticSavedGrams: plasticSaved,
      distanceKm: sourceDistance,
      transportMode,
      quantity,
      eolDistribution,
    });

    const localSummary = generateLocalSourcingSummary(sourceDistance);

    // ---------------------
    // AI Impact Statement
    // ---------------------
    let impactStatement =
      "This order contributes positively to sustainability efforts.";

    try {
      impactStatement = await generateImpactStatement({
        plastic_saved_grams: plasticSaved,
        carbon_avoided_kg: carbonAvoided,
        local_sourcing_summary: localSummary,
      });
    } catch (err) {
      console.error("AI statement generation failed:", err.message);
    }

    // ---------------------
    // Store in MongoDB
    // ---------------------
    const order = new Order({
      customerName,
      productName,
      quantity,
      productMaterial,
      sourceDistanceKm: sourceDistance,
      baselineWeight,
      newWeight,
      pcrRatio,
      reuseFactor,
      transportMode,
      eolDistribution,
      impactReport: {
        plastic_saved_grams: plasticSaved,
        carbon_avoided_kg: carbonAvoided,
        local_sourcing_summary: localSummary,
        impact_statement: impactStatement,
      },
    });

    await order.save();

    // ---------------------
    // Return only impactReport to frontend
    // ---------------------
    res.status(201).json({
      success: true,
      message: "Impact report generated successfully",
      data: {
        ...order.impactReport,
        baselineWeight,
        newWeight,
        pcrRatio,
        reuseFactor,
        transportMode,
        eolDistribution,
      },
    });
  } catch (error) {
    console.error("Impact generation error:", error);

    res.status(500).json({
      success: false,
      message: "Impact report generation failed",
      error: error.message,
    });
  }
};
