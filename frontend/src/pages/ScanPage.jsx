import React, { useState, useRef } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import { detectIngredients, generateRecipes } from '../utils/api.js';

const STEPS = { UPLOAD: 'upload', DETECTING: 'detecting', DETECTED: 'detected', GENERATING: 'generating', RESULTS: 'results' };

export default function ScanPage({ onOpen, saved, onSave }) {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [imgUrl, setImgUrl] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setImgUrl(URL.createObjectURL(file));
    setStep(STEPS.DETECTING);
    setError('');
    try {
      const result = await detectIngredients(file);
      setIngredients(result.ingredients || []);
      setStep(STEPS.DETECTED);
    } catch (err) {
      setError('Could not detect ingredients. Add them manually below.');
      setIngredients([]);
      setStep(STEPS.DETECTED);
    }
  }

  function addIngredient() {
    const v = manualInput.trim();
    if (!v || ingredients.includes(v)) return;
    setIngredients(prev => [...prev, v]);
    setManualInput('');
  }

  function removeIngredient(ing) {
    setIngredients(prev => prev.filter(i => i !== ing));
  }

  async function findRecipes() {
    if (!ingredients.length) return;
    setStep(STEPS.GENERATING);
    setError('');
    try {
      const data = await generateRecipes(ingredients);
      setRecipes((data.recipes || []).map(r => ({ ...r, isAI: true })));
      setStep(STEPS.RESULTS);
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      setStep(STEPS.DETECTED);
    }
  }

  function reset() {
    setStep(STEPS.UPLOAD);
    setImgUrl(null);
    setIngredients([]);
    setRecipes([]);
    setError('');
  }

  // UPLOAD
  if (step === STEPS.UPLOAD) return (
    <div>
      <div
        style={{ border: `1.5px dashed ${drag ? '#1D9E75' : '#d5d3cc'}`, borderRadius: 14, padding: '2.5rem', textAlign: 'center', background: drag ? '#E1F5EE' : '#f5f3ec', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
        onClick={() => fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        <div style={{ width: 52, height: 52, background: '#E1F5EE', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24 }}>📷</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, marginBottom: 5 }}>Drop a fridge photo here</div>
        <div style={{ fontSize: 13, color: '#888780' }}>Claude AI will detect what's inside</div>
      </div>

      <div style={{ textAlign: 'center', margin: '1.25rem 0', fontSize: 12, color: '#888780' }}>— or add ingredients manually —</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        <input className="input" placeholder="e.g. tomatoes, paneer, eggs..."
          value={manualInput} onChange={e => setManualInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addIngredient()} />
        <button className="btn btn-primary" onClick={addIngredient}>Add</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: '1rem' }}>
        {ingredients.map(i => (
          <span key={i} className="chip manual">
            {i} <span style={{ cursor: 'pointer', opacity: 0.6, fontSize: 14 }} onClick={() => removeIngredient(i)}>×</span>
          </span>
        ))}
      </div>

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}
        onClick={findRecipes} disabled={!ingredients.length}>
        ✨ Find Matching Recipes
      </button>
    </div>
  );

  // DETECTING
  if (step === STEPS.DETECTING) return (
    <div>
      <img src={imgUrl} style={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }} alt="Uploaded" />
      <div style={{ textAlign: 'center', padding: '2rem', color: '#888780' }}>
        <div className="spinner" style={{ marginBottom: '.75rem' }} />
        <div style={{ fontSize: 14 }}>Detecting ingredients with AI...</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Claude is analysing your photo</div>
      </div>
    </div>
  );

  // DETECTED
  if (step === STEPS.DETECTED) return (
    <div>
      <button className="btn btn-outline" style={{ marginBottom: '1rem', fontSize: 13 }} onClick={reset}>← Rescan</button>
      {imgUrl && <img src={imgUrl} style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }} alt="Uploaded" />}

      {error && (
        <div style={{ padding: '10px 14px', background: '#FCEBEB', borderRadius: 8, fontSize: 13, color: '#A32D2D', marginBottom: '1rem', border: '0.5px solid #F7C1C1' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ padding: '10px 14px', background: '#E1F5EE', borderRadius: 8, fontSize: 13, color: '#085041', marginBottom: '1rem', border: '0.5px solid #9FE1CB' }}>
        📸 Photo uploaded! Add your ingredients manually below and click Generate Recipes.
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: '1rem' }}>
        {ingredients.map(i => (
          <span key={i} className="chip">
            {i} <span style={{ cursor: 'pointer', opacity: 0.6, fontSize: 14 }} onClick={() => removeIngredient(i)}>×</span>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
        <input className="input" placeholder="Add more ingredients..."
          value={manualInput} onChange={e => setManualInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addIngredient()} />
        <button className="btn btn-outline" onClick={addIngredient}>+ Add</button>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}
        onClick={findRecipes} disabled={!ingredients.length}>
        ✨ Generate Recipes
      </button>
    </div>
  );

  // GENERATING
  if (step === STEPS.GENERATING) return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div className="spinner" style={{ marginBottom: '1rem' }} />
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Cooking up recipes...</div>
      <div style={{ fontSize: 13, color: '#888780' }}>Claude is generating recipes for your ingredients</div>
      <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
        {ingredients.map(i => <span key={i} className="chip" style={{ fontSize: 12 }}>{i}</span>)}
      </div>
    </div>
  );

  // RESULTS
  if (step === STEPS.RESULTS) return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 500 }}>✨ AI Recipes for you</div>
          <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>{recipes.length} recipes generated</div>
        </div>
        <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 10px' }} onClick={reset}>← New scan</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {recipes.map(r => (
          <RecipeCard key={r.id} recipe={r} onOpen={onOpen} onSave={onSave} isSaved={saved.has(r.id)} />
        ))}
      </div>
    </div>
  );

  return null;
}