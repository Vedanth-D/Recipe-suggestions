import React from 'react';

export default function RecipeDetail({ recipe, isSaved, onSave, onBack }) {
  if (!recipe) return null;

  return (
    <div>
      <button className="btn btn-outline" style={{ marginBottom: '1.25rem', fontSize: 13 }} onClick={onBack}>← Back</button>

      <div style={{ height: 200, background: '#f5f3ec', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, marginBottom: '1.25rem', position: 'relative', border: '0.5px solid #e8e5de' }}>
        {recipe.emoji}
        {recipe.isAI && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#1D9E75', color: '#fff', fontSize: 11, padding: '3px 9px', borderRadius: 5, fontWeight: 500 }}>✨ AI Generated</span>
        )}
        <button
          className="btn"
          style={{ position: 'absolute', top: 12, right: 12, padding: '6px 14px', fontSize: 13, background: isSaved ? '#FAEEDA' : 'rgba(255,255,255,0.9)', color: isSaved ? '#633806' : '#5f5e5a', border: `0.5px solid ${isSaved ? '#FAC775' : '#d5d3cc'}` }}
          onClick={() => onSave(recipe)}
        >
          {isSaved ? '❤️ Saved' : '🤍 Save'}
        </button>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>{recipe.name}</h1>
      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888780', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span>⏱ {recipe.time} min</span>
        <span>👥 {recipe.serves} servings</span>
        <span style={{ textTransform: 'capitalize' }}>🍴 {recipe.cuisine}</span>
        <span style={{ textTransform: 'capitalize' }}>🏷 {recipe.type}</span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {(recipe.diet || []).map(d => <span key={d} className="chip" style={{ fontSize: 12 }}>{d}</span>)}
        {(recipe.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
      </div>

      <div style={{ height: '0.5px', background: '#e8e5de', marginBottom: '1.25rem' }} />

      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888780', marginBottom: 12 }}>Ingredients</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: '1.25rem' }}>
        {(recipe.ingredients || recipe.ingr || []).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '7px 10px', borderRadius: 8, background: '#f5f3ec', border: '0.5px solid #e8e5de' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D9E75', flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>

      <div style={{ height: '0.5px', background: '#e8e5de', marginBottom: '1.25rem' }} />

      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888780', marginBottom: 12 }}>Steps</div>
      <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
        {(recipe.steps || []).map((step, i) => (
          <li key={i} style={{ display: 'flex', gap: 11 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#E1F5EE', color: '#085041', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              {i + 1}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, paddingTop: 3 }}>{step}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}