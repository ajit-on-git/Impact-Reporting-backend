// Enhanced Impact Service with Real-World LCA Data

// ---------------------
// Material Emission Factors (kg CO2e per kg)
// ---------------------
const MATERIAL_EMISSION_FACTORS = {
  PET: 2.5, // virgin PET
  HDPE: 1.9,
  LDPE: 1.8,
  PP: 1.7,
  PCR: 1.0, // Post-consumer recycled
  compostable: 1.5,
  bamboo: 0.2,
};

// ---------------------
// Plastic weight per unit in grams (baseline if not provided)
// ---------------------
const MATERIAL_BASELINE_WEIGHT = {
  default: 20, // grams per unit of conventional plastic
};

// ---------------------
// Manufacturing scrap percentage
// ---------------------
const MANUFACTURING_SCRAP = {
  baseline: 0.05, // 5%
  new: 0.02, // 2%
};

// ---------------------
// Transport Emission Factors (kg CO2e per ton-km)
// ---------------------
const TRANSPORT_EMISSION_FACTORS = {
  air: 1.5,
  truck: 0.12,
  rail: 0.03,
  ocean: 0.01,
};

// ---------------------
// End-of-Life emission factors (kg CO2e per kg)
// Negative means carbon avoided
// ---------------------
const EOL_EMISSION_FACTORS = {
  landfill: 1.0,
  incineration: 2.0,
  recycling: -1.5,
  reuse: -2.0,
};

// ---------------------
// Helpers
// ---------------------
const gramsToKg = (grams) => grams / 1000;
const gramsToTon = (grams) => grams / 1_000_000;

// ---------------------
// Calculate Plastic Saved (grams)
// ---------------------
export const calculatePlasticSaved = ({
  materialType = "PET",
  baselineWeight = MATERIAL_BASELINE_WEIGHT.default,
  newWeight,
  quantity = 1,
  pcrRatio = 0,
  reuseFactor = 1,
  manufacturingScrapBaseline = MANUFACTURING_SCRAP.baseline,
  manufacturingScrapNew = MANUFACTURING_SCRAP.new,
}) => {
  if (!newWeight) newWeight = baselineWeight * 0.5; // default 50% reduction

  // Adjust for manufacturing scrap
  const netBaseline = baselineWeight * (1 + manufacturingScrapBaseline);
  const netNew = newWeight * (1 + manufacturingScrapNew);

  // Plastic saved per unit
  let plasticSavedPerUnit = netBaseline - netNew;

  // Adjust for PCR ratio (only virgin plastic is saved)
  plasticSavedPerUnit *= 1 - pcrRatio;

  // Apply reuse factor
  plasticSavedPerUnit *= reuseFactor;

  const totalPlasticSaved = plasticSavedPerUnit * quantity;

  return Number(totalPlasticSaved.toFixed(2)); // grams
};

// ---------------------
// Calculate Carbon Avoided (kg CO2e)
// ---------------------
export const calculateCarbonAvoided = ({
  materialType = "PET",
  plasticSavedGrams,
  distanceKm = 0,
  transportMode = "truck",
  eolDistribution = { landfill: 0.7, incineration: 0.2, recycling: 0.1 },
}) => {
  const plasticSavedKg = gramsToKg(plasticSavedGrams);

  // Material production emissions
  const materialCF = MATERIAL_EMISSION_FACTORS[materialType] ?? 2.5;
  const materialCarbon = plasticSavedKg * materialCF;

  // Transport emissions
  const transportFactor = TRANSPORT_EMISSION_FACTORS[transportMode] ?? 0.12;
  const transportCarbon =
    gramsToTon(plasticSavedGrams) * distanceKm * transportFactor;

  // End-of-life emissions
  let eolCarbon = 0;
  for (const [method, fraction] of Object.entries(eolDistribution)) {
    const factor = EOL_EMISSION_FACTORS[method] ?? 0;
    eolCarbon += plasticSavedKg * factor * fraction;
  }

  // Total carbon avoided
  const totalCarbonAvoided = materialCarbon + transportCarbon + eolCarbon;

  return Number(totalCarbonAvoided.toFixed(3)); // kg CO2e
};

// ---------------------
// Local Sourcing Summary
// ---------------------
export const generateLocalSourcingSummary = (distanceKm) => {
  if (distanceKm <= 50) {
    return `Product sourced very locally (${distanceKm} km), minimizing transport emissions and supporting nearby suppliers.`;
  }
  if (distanceKm <= 200) {
    return `Product sourced locally (${distanceKm} km), reducing long-distance transport emissions.`;
  }
  if (distanceKm <= 500) {
    return `Product sourced regionally (${distanceKm} km), lowering transportation impact compared to global supply chains.`;
  }
  return `Product sourced from ${distanceKm} km away; transport impact remains higher than locally sourced alternatives.`;
};
