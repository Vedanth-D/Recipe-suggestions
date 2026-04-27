import React, { useState, useCallback, useEffect } from 'react';
import BrowsePage from './pages/BrowsePage.jsx';
import ScanPage from './pages/ScanPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import { RECIPES } from './utils/recipeData.js';
import { saveRecipeToDb, getSavedRecipesFromDb } from './utils/api.js';
import axios from 'axios';

const TABS = ['browse', 'scan', 'saved'];
const TAB_LABELS = { browse: '🍽 Recipes', scan: '📸 Scan Fridge', saved: '❤️ Saved' };

export default function App() {
  const [tab, setTab] = useState('browse');
  const [saved, setSaved] = useState(new Set());
  const [allRecipes, setAllRecipes] = useState(RECIPES);
  const [detail, setDetail] = useState(null);
  const [dbSavedRecipes, setDbSavedRecipes] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // check if user is already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('fc_token');
    const savedUser = localStorage.getItem('fc_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setAuthLoading(false);
  }, []);

  // load saved recipes when user logs in
  useEffect(() => {
    if (!user || !token) return;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    async function loadSaved() {
      setLoadingSaved(true);
      try {
        const data = await getSavedRecipesFromDb();
        const recipes = data.recipes || [];
        setDbSavedRecipes(recipes);
        const savedIds = new Set(recipes.map(r => r.recipeId));
        setSaved(savedIds);
      } catch (err) {
        console.error('Failed to load saved recipes:', err);
      } finally {
        setLoadingSaved(false);
      }
    }
    loadSaved();
  }, [user, token]);

  function handleLogin(userData, userToken) {
    setUser(userData);
    setToken(userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  }

  function handleLogout() {
    localStorage.removeItem('fc_token');
    localStorage.removeItem('fc_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    setSaved(new Set());
    setDbSavedRecipes([]);
    setDetail(null);
    setTab('browse');
  }

  const savedRecipes = dbSavedRecipes.length > 0
    ? dbSavedRecipes
    : allRecipes.filter(r => saved.has(r.id));

  const toggleSave = useCallback(async (recipe) => {
    if (!allRecipes.find(r => r.id === recipe.id)) {
      setAllRecipes(prev => [...prev, recipe]);
    }
    try {
      const result = await saveRecipeToDb(recipe);
      if (result.saved) {
        setSaved(prev => new Set([...prev, recipe.id]));
        setDbSavedRecipes(prev => [...prev, { ...recipe, recipeId: recipe.id }]);
      } else {
        setSaved(prev => { const next = new Set(prev); next.delete(recipe.id); return next; });
        setDbSavedRecipes(prev => prev.filter(r => r.recipeId !== recipe.id));
      }
    } catch (err) {
      setSaved(prev => {
        const next = new Set(prev);
        if (next.has(recipe.id)) next.delete(recipe.id);
        else next.add(recipe.id);
        return next;
      });
    }
  }, [allRecipes]);

  const openDetail = useCallback((recipe) => setDetail(recipe), []);
  const closeDetail = useCallback(() => setDetail(null), []);

  function switchTab(t) {
    setTab(t);
    setDetail(null);
  }

  // show loading while checking auth
  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4' }}>
      <div className="spinner" />
    </div>
  );

  // show login page if not logged in
  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '0.5px solid #e8e5de', padding: '0 1rem', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: '#085041', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 32, height: 32, background: '#1D9E75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🥗</span>
            FridgeChef
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#888780' }}>👋 {user.name}</span>
            <button onClick={handleLogout}
              style={{ padding: '5px 12px', borderRadius: 7, border: '0.5px solid #d5d3cc', background: 'none', fontSize: 12, cursor: 'pointer', color: '#888780', fontFamily: 'inherit' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid #e8e5de', padding: '0 1rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => switchTab(t)}
              style={{ padding: '12px 18px', border: 'none', background: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: tab === t ? '#1D9E75' : '#888780', borderBottom: tab === t ? '2px solid #1D9E75' : '2px solid transparent', transition: 'all 0.18s', whiteSpace: 'nowrap' }}>
              {TAB_LABELS[t]}
              {t === 'saved' && saved.size > 0 && (
                <span style={{ marginLeft: 5, background: '#E1F5EE', color: '#085041', fontSize: 10, padding: '1px 5px', borderRadius: 10, fontWeight: 600 }}>{saved.size}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '1.25rem 1rem' }}>
        {detail ? (
          <RecipeDetail
            recipe={detail}
            isSaved={saved.has(detail.id) || saved.has(detail.recipeId)}
            onSave={toggleSave}
            onBack={closeDetail}
          />
        ) : (
          <>
            {tab === 'browse' && <BrowsePage onOpen={openDetail} saved={saved} onSave={toggleSave} />}
            {tab === 'scan' && <ScanPage onOpen={openDetail} saved={saved} onSave={toggleSave} user={user} />}
            {tab === 'saved' && (
              loadingSaved
                ? <div style={{ textAlign: 'center', padding: '3rem', color: '#888780' }}><div className="spinner" /></div>
                : <SavedPage savedRecipes={savedRecipes} onOpen={openDetail} saved={saved} onSave={toggleSave} />
            )}
          </>
        )}
      </main>
    </div>
  );
}