import React, { useState, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import { RECIPES, CATEGORIES, MEAL_TYPES, DIET_TYPES } from '../utils/recipeData.js';

export default function BrowsePage({ onOpen, saved, onSave }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [type, setType] = useState('all');
  const [diet, setDiet] = useState('all');
  const [sort, setSort] = useState('name');

  const filtered = useMemo(() => {
    let list = RECIPES.filter(r => {
      if (cat !== 'all' && r.cuisine !== cat) return false;
      if (type !== 'all' && r.type !== type) return false;
      if (diet !== 'all' && !r.diet.includes(diet)) return false;
      if (q) {
        const lq = q.toLowerCase();
        return r.name.toLowerCase().includes(lq) ||
          r.ingr.some(i => i.includes(lq)) ||
          (r.tags || []).some(t => t.toLowerCase().includes(lq));
      }
      return true;
    });
    if (sort === 'time') list = [...list].sort((a, b) => a.time - b.time);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [q, cat, type, diet, sort]);

  return (
    <div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '0.5px solid #d5d3cc', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', background: '#fff' }}>
        <span style={{ fontSize: 14, color: '#888780' }}>🔍</span>
        <input
          style={{ flex: 1, border: 'none', background: 'none', fontSize: 14, color: 'inherit', outline: 'none' }}
          placeholder="Search recipes, ingredients, cuisines..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {/* Cuisine */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: '1rem', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 20, border: '0.5px solid', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', background: cat === c.id ? '#E1F5EE' : '#fff', borderColor: cat === c.id ? '#9FE1CB' : '#d5d3cc', color: cat === c.id ? '#085041' : '#888780', transition: 'all 0.18s' }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Meal type */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
        {MEAL_TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)}
            style={{ padding: '5px 11px', borderRadius: 16, border: '0.5px solid', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: type === t.id ? '#FAEEDA' : 'none', borderColor: type === t.id ? '#FAC775' : '#d5d3cc', color: type === t.id ? '#633806' : '#888780', transition: 'all 0.18s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Diet */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {DIET_TYPES.map(d => (
          <button key={d.id} onClick={() => setDiet(d.id)}
            style={{ padding: '5px 11px', borderRadius: 16, border: '0.5px solid', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: diet === d.id ? '#E6F1FB' : 'none', borderColor: diet === d.id ? '#B5D4F4' : '#d5d3cc', color: diet === d.id ? '#0C447C' : '#888780', transition: 'all 0.18s' }}>
            {d.label}
          </button>
        ))}
      </div>

      {/* Count + sort */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
        <span style={{ fontSize: 13, color: '#888780' }}>{filtered.length} recipe{filtered.length !== 1 ? 's' : ''}</span>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ border: '0.5px solid #d5d3cc', borderRadius: 7, padding: '5px 10px', fontSize: 13, background: '#fff', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit' }}>
          <option value="name">A-Z</option>
          <option value="time">Quickest first</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {filtered.length ? filtered.map(r => (
          <RecipeCard key={r.id} recipe={r} onOpen={onOpen} onSave={onSave} isSaved={saved.has(r.id)} />
        )) : (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="icon">🔍</div>
            <div>No recipes match your filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}