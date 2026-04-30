import axios from 'axios';

const BASE = '/api';

export async function detectIngredients(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  const { data } = await axios.post(`${BASE}/detect-ingredients`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function generateRecipes(ingredients, filters = {}) {
  const { data } = await axios.post(`${BASE}/generate-recipes`, { ingredients, filters });
  return data;
}

export async function saveRecipeToDb(recipe) {
  const { data } = await axios.post(`${BASE}/save-recipe`, recipe);
  return data;
}

export async function getSavedRecipesFromDb() {
  const { data } = await axios.get(`${BASE}/saved-recipes`);
  return data;
}

export async function getScanHistory() {
  const { data } = await axios.get(`${BASE}/scan-history`);
  return data;
}