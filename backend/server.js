import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import { SavedRecipe, ScanHistory } from "./models.js";
import { User } from "./userModel.js";
import { generateToken, authMiddleware } from "./auth.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage() });

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected!"))
  .catch(err => console.error("❌ MongoDB error:", err.message));

// client for recipe generation
const recipeClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "20mb" }));

// ── AUTH ROUTES ──────────────────────────────────────────────────────

// register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// get current user
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

// ── RECIPE ROUTES ────────────────────────────────────────────────────

// detect ingredients from image
app.post("/api/detect-ingredients", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    res.json({
      ingredients: [],
      note: "Photo uploaded! Please add your ingredients manually below."
    });
  } catch (err) {
    console.error("Detect error:", err.message);
    res.status(500).json({ error: "Failed to process image" });
  }
});

// generate recipes from ingredients
app.post("/api/generate-recipes", async (req, res) => {
  try {
    const { ingredients, filters = {}, userId } = req.body;
    if (!ingredients || !ingredients.length) {
      return res.status(400).json({ error: "ingredients array is required" });
    }

    const { cuisine = "any", diet = "any", type = "any" } = filters;

    const response = await recipeClient.chat.completions.create({
      model: "inclusionai/ling-2.6-1t:free",
      messages: [
        {
          role: "user",
          content: `You are a professional chef. Given these available ingredients: ${ingredients.join(", ")}

Generate 6 diverse recipes using MOSTLY these ingredients (salt, oil, water assumed available).

${cuisine !== "any" ? `Preferred cuisine: ${cuisine}` : "Include a mix of cuisines (Indian, Italian, Continental, Asian etc.)"}
${diet !== "any" ? `Diet type: ${diet}` : "Mix of vegetarian and non-vegetarian"}
${type !== "any" ? `Meal type: ${type}` : "Include starters, mains, and one dessert if possible"}

Return ONLY a JSON object, no markdown, no extra text:
{
  "recipes": [
    {
      "id": "unique-string-id",
      "name": "Recipe Name",
      "emoji": "single relevant emoji",
      "cuisine": "indian|italian|chinese|mexican|continental|asian|fusion",
      "type": "starter|main|dessert|breakfast|snack",
      "diet": ["veg", "nonveg", "vegan", "diet", "casual", "dessert_sweet"],
      "time": 25,
      "serves": 4,
      "matchPct": 90,
      "tags": ["tag1", "tag2"],
      "ingredients": ["ingredient with quantity"],
      "missingIngredients": ["items not in provided list"],
      "steps": ["Step 1", "Step 2"]
    }
  ]
}`,
        },
      ],
    });

    const text = response.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const data = JSON.parse(jsonMatch[0]);

    // save scan history
    await ScanHistory.create({
      userId: userId || null,
      ingredients,
      recipesGenerated: data.recipes?.length || 0,
    });

    res.json(data);
  } catch (err) {
    console.error("Generate error:", err.message);
    res.status(500).json({ error: "Failed to generate recipes" });
  }
});

// save a recipe
app.post("/api/save-recipe", authMiddleware, async (req, res) => {
  try {
    const recipe = req.body;
    const exists = await SavedRecipe.findOne({ recipeId: recipe.id, userId: req.userId });
    if (exists) {
      await SavedRecipe.deleteOne({ recipeId: recipe.id, userId: req.userId });
      return res.json({ saved: false, message: "Recipe removed" });
    }
    await SavedRecipe.create({ recipeId: recipe.id, userId: req.userId, ...recipe });
    res.json({ saved: true, message: "Recipe saved!" });
  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json({ error: "Failed to save recipe" });
  }
});

// get saved recipes
app.get("/api/saved-recipes", authMiddleware, async (req, res) => {
  try {
    const recipes = await SavedRecipe.find({ userId: req.userId }).sort({ savedAt: -1 });
    res.json({ recipes });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// get scan history
app.get("/api/scan-history", authMiddleware, async (req, res) => {
  try {
    const history = await ScanHistory.find({ userId: req.userId }).sort({ scannedAt: -1 }).limit(10);
    res.json({ history });
  } catch (err) {
    console.error("History error:", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FridgeChef API running" });
});

app.listen(PORT, () => {
  console.log(`\n🥗 FridgeChef API running on http://localhost:${PORT}\n`);
});