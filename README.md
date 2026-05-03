# 🥗 FridgeChef — AI-Powered Recipe Assistant

<div align="center">

![FridgeChef Banner](https://img.shields.io/badge/FridgeChef-AI%20Recipe%20Assistant-1D9E75?style=for-the-badge&logo=leaf&logoColor=white)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-FF6B35?style=flat-square)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> **Cook smarter with what you already have.** Upload a fridge photo, add your ingredients, and let AI generate personalized recipes instantly.

[🚀 Live Demo](#) • [📸 Screenshots](#-screenshots) • [⚙️ Setup](#️-local-setup) • [🗂 Project Structure](#-project-structure)

</div>

---

## 📚 Table of Contents

- [✨ About the Project](#-about-the-project)
- [🎯 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🗂 Project Structure](#-project-structure)
- [⚙️ Local Setup](#️-local-setup)
- [🔑 Environment Variables](#-environment-variables)
- [🤖 How the AI Works](#-how-the-ai-works)
- [🗄 Database Schema](#-database-schema)
- [🚀 Deployment](#-deployment)
- [🛣 Roadmap](#-roadmap)
- [📄 License](#-license)

---

## ✨ About the Project

**FridgeChef** is a full-stack AI-powered recipe assistant that helps you cook delicious meals using ingredients you already have at home. No more food waste, no more "what should I cook today?" struggles.

Simply:
1. 📸 Upload a photo of your fridge or pantry
2. ✏️ Add or edit detected ingredients
3. 🤖 Let AI generate 6 personalized recipes just for you
4. ❤️ Save your favorites to your personal collection

Built with **React + Node.js + MongoDB + OpenRouter AI** — completely free to run!

---

## 🎯 Features

### 🍽 Recipe Browser
- **63+ handcrafted recipes** across 6 cuisines
- Filter by **Cuisine** — Indian 🇮🇳, Italian 🇮🇹, Chinese 🥡, Mexican 🌮, Continental 🌍
- Filter by **Meal Type** — Starters, Main Course, Desserts, Breakfast, Snacks
- Filter by **Diet** — Vegetarian 🌱, Vegan 🌿, Non-Veg 🍗, Diet 🥗, Casual 🍔, Desserts & Sweets 🍮
- **Search** by recipe name, ingredient, or tag
- **Sort** A-Z or by quickest cook time

### 📸 Scan Fridge (AI-Powered)
- Upload any fridge or pantry photo
- Add ingredients manually with chips UI
- AI generates **6 custom recipes** from your exact ingredients
- Shows **ingredient match percentage** per recipe
- Highlights **missing ingredients** you'd need to buy

### ❤️ Save & Persist
- Save any recipe to your personal collection
- Saved recipes **persist across sessions** via MongoDB
- Each user has their **own private collection**

### 🔐 User Authentication
- Register with name, email, password
- Secure **JWT-based** login system
- Stay logged in after page refresh
- Each user's data is completely **private and isolated**

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework |
| **Styling** | Inline CSS + CSS Variables | Custom design system |
| **Routing** | React Router DOM | Page navigation |
| **HTTP Client** | Axios | API calls |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB Atlas | Cloud data storage |
| **ODM** | Mongoose | MongoDB object modeling |
| **AI** | OpenRouter API | Recipe generation |
| **Auth** | JWT + bcryptjs | Secure authentication |
| **File Upload** | Multer | Image handling |

---

## 📸 Screenshots

### 🏠 Login Page
> Clean login and registration with toggle between modes
<img width="567" height="702" alt="Screenshot 2026-05-03 075654" src="https://github.com/user-attachments/assets/02411ef7-9581-491d-bed0-a23e7da4908d" />


### 🍽 Recipe Browser
> 63+ recipes with cuisine, meal type, and diet filters
<img width="1301" height="974" alt="Screenshot 2026-05-03 075735" src="https://github.com/user-attachments/assets/2da24b04-7c63-4953-8167-53c4f0fe6280" />


### 📸 Scan Fridge
> Upload photo → add ingredients → generate AI recipes
<img width="1206" height="825" alt="Screenshot 2026-05-03 080005" src="https://github.com/user-attachments/assets/c13a72e6-2092-4682-a4da-dd9081f89964" />


### 📋 Recipe Detail
> Full steps, ingredients, diet tags, and save button
<img width="1032" height="895" alt="Screenshot 2026-05-03 075837" src="https://github.com/user-attachments/assets/981535a4-1c97-4ae7-8233-4879ded2d8da" />


### ❤️ Saved Recipes
> Personal collection synced with MongoDB
<img width="1227" height="729" alt="Screenshot 2026-05-03 075818" src="https://github.com/user-attachments/assets/150c0f9a-f204-49d2-8097-2f106602cf4a" />

---

## 🗂 Project Structure

```
fridgechef/
│
├── 📁 backend/
│   ├── server.js          ← Express API + all routes
│   ├── models.js          ← SavedRecipe + ScanHistory schemas
│   ├── userModel.js       ← User schema
│   ├── auth.js            ← JWT token helpers + middleware
│   ├── package.json
│   └── .env               ← API keys (never commit this!)
│
└── 📁 frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx                    ← Root component + auth state
        ├── main.jsx                   ← React entry point
        ├── index.css                  ← Global styles
        │
        ├── 📁 components/
        │   ├── RecipeCard.jsx         ← Recipe grid card
        │   └── RecipeDetail.jsx       ← Full recipe view
        │
        ├── 📁 pages/
        │   ├── AuthPage.jsx           ← Login + Register
        │   ├── BrowsePage.jsx         ← Recipe browser with filters
        │   ├── ScanPage.jsx           ← AI fridge scan flow
        │   └── SavedPage.jsx          ← Saved recipes collection
        │
        └── 📁 utils/
            ├── api.js                 ← All API call functions
            └── recipeData.js          ← 63 recipes + filter config
```

---

## ⚙️ Local Setup

### Prerequisites
- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB Atlas** free account — [mongodb.com/atlas](https://mongodb.com/atlas)
- **OpenRouter** free account — [openrouter.ai](https://openrouter.ai)

### Step 1 — Clone the repo

```bash
git clone https://github.com/yourusername/fridgechef.git
cd fridgechef
```

### Step 2 — Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

You should see:
```
🥗 FridgeChef API running on http://localhost:3001
✅ MongoDB connected!
```

### Step 3 — Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

### Step 4 — Open the app

Go to **http://localhost:5173** 🎉

---

## 🔑 Environment Variables

Create `backend/.env` with these values:

```env
# OpenRouter AI (free) — openrouter.ai
OPENROUTER_API_KEY=sk-or-your-key-here
OPENROUTER_API_KEY_IMAGE=sk-or-your-second-key-here

# MongoDB Atlas (free) — mongodb.com/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fridgechef

# JWT Secret — any random long string
JWT_SECRET=your-super-secret-jwt-key

# Server port
PORT=3001
```

> ⚠️ **Never commit your `.env` file to GitHub!** Make sure `.gitignore` includes `.env`

---

## 🤖 How the AI Works

### Recipe Generation
```
User adds ingredients
        ↓
POST /api/generate-recipes
        ↓
OpenRouter API (free LLM)
        ↓
Returns 6 custom recipes as JSON
        ↓
Each recipe has: name, steps, ingredients,
cuisine, type, diet tags, match %
```

### Image Detection
```
User uploads fridge photo
        ↓
POST /api/detect-ingredients
        ↓
Image processed as base64
        ↓
User confirms/edits ingredients
        ↓
Feeds into recipe generation
```

---

## 🗄 Database Schema

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### SavedRecipe
```js
{
  userId: ObjectId (ref: User),
  recipeId: String,
  name, emoji, cuisine, type,
  diet: [String],
  ingredients: [String],
  steps: [String],
  savedAt: Date
}
```

### ScanHistory
```js
{
  userId: ObjectId,
  ingredients: [String],
  recipesGenerated: Number,
  scannedAt: Date
}
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Inside frontend folder
cd frontend
vercel
```

### Backend → Render
1. Push code to GitHub
2. Go to **render.com** → New Web Service
3. Connect your GitHub repo
4. Set root directory to `backend`
5. Add all environment variables
6. Deploy!

---

## 🛣 Roadmap

- [x] Recipe browser with 63+ recipes
- [x] Cuisine, meal type, and diet filters
- [x] AI recipe generation from ingredients
- [x] Fridge photo upload
- [x] Save recipes to MongoDB
- [x] User authentication (JWT)
- [ ] Scan history page
- [ ] Missing ingredients shopping list
- [ ] Weekly meal planner
- [ ] Nutrition info (calories, macros)
- [ ] Share recipe via link
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Vedanth** — Built with ❤️.

---

## 📄 License

Apache License 2.0 — free to use, modify and distribute with attribution.
---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with 🥗 + ☕ + 🤖

</div>
