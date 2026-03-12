import mongoose from "mongoose";

// Schema for detailed impact report
const ImpactSchema = new mongoose.Schema({
  plastic_saved_grams: {
    type: Number,
    required: true,
  },
  carbon_avoided_kg: {
    type: Number,
    required: true,
  },
  local_sourcing_summary: {
    type: String,
    required: true,
  },
  impact_statement: {
    type: String,
    required: true,
  },
});

// Main Order schema
const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },

  productName: {
    type: String,
    required: true,
    index: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  productMaterial: {
    type: String,
    required: true,
  },

  sourceDistanceKm: {
    type: Number,
    required: true,
  },

  // Optional LCA fields for traceability
  baselineWeight: { type: Number }, // grams per unit
  newWeight: { type: Number }, // grams per unit
  pcrRatio: { type: Number }, // fraction of recycled content
  reuseFactor: { type: Number }, // multiplier for reusable products
  transportMode: { type: String }, // 'truck', 'air', 'rail', 'ocean'
  eolDistribution: { type: Object }, // { landfill, incineration, recycling, reuse }

  impactReport: ImpactSchema,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", OrderSchema);
