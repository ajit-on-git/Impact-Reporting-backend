import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { logPrompt } from "../utils/logger.js";
import { buildImpactPrompt } from "../prompts/impactPrompt.js";

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/**
 * Generates a human-readable impact statement using AI
 * @param {Object} data - Sustainability data
 * @param {number} data.plastic_saved_grams
 * @param {number} data.carbon_avoided_kg
 * @param {string} data.local_sourcing_summary
 * @returns {Promise<string>} AI-generated statement
 */
export const generateImpactStatement = async (data) => {
  try {
    const prompt = buildImpactPrompt(data);

    // Generate response from Gemini AI
    const result = await model.generateContent(prompt);

    const response = result.response.text().trim();

    // Log prompt & AI response
    logPrompt(prompt, response);

    return response;
  } catch (error) {
    console.error("Gemini AI Error:", error.message);

    // Fallback statement if AI fails
    return `This order contributes to reducing ${data.plastic_saved_grams} grams of plastic waste and avoids ${data.carbon_avoided_kg} kg of CO₂e. ${data.local_sourcing_summary}`;
  }
};
