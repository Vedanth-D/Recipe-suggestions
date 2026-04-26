import mongoose from "mongoose";

// Saved Recipe Schema
const savedRecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: String,
  name: String,
  emoji: String,
  cuisine: String,
  type: String,
  diet: [String],
  time: Number,
  serves: Number,
  tags: [String],
  ingredients: [String],
  steps: [String],
  matchPct: Number,
  isAI: Boolean,
  savedAt: { type: Date, default: Date.now }
});

// Scan History Schema
const scanHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ingredients: [String],
  recipesGenerated: Number,
  scannedAt: { type: Date, default: Date.now }
});

export const SavedRecipe = mongoose.model("SavedRecipe", savedRecipeSchema);
export const ScanHistory = mongoose.model("ScanHistory", scanHistorySchema);