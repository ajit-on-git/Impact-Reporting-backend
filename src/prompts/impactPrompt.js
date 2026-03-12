/**
 * Builds a prompt for AI to generate a sustainability impact statement.
 * Now includes real-world LCA data fields and emphasizes human-readable clarity.
 *
 * @param {Object} data
 * @param {number} data.plastic_saved_grams - Plastic saved in grams
 * @param {number} data.carbon_avoided_kg - Carbon avoided in kg CO2e
 * @param {string} data.local_sourcing_summary - Summary of local sourcing impact
 * @returns {string} AI prompt
 */
export const buildImpactPrompt = (data) => {
  return `
You are a sustainability reporting assistant for an e-commerce platform.

Generate a short, clear, and credible impact statement for a product order based on the following real-world sustainability data:

- Plastic Saved: ${data.plastic_saved_grams} grams
- Carbon Avoided: ${data.carbon_avoided_kg} kg CO2e
- Local Sourcing Impact: ${data.local_sourcing_summary}

Rules for the AI-generated statement:
1. Maximum 2 sentences.
2. Human-readable and precise.
3. Focus on the environmental benefits.
4. Avoid marketing language or exaggerations.
5. Reflect real-world impact using the data provided.
6. Do not include any additional commentary, just return the statement text.
`;
};
