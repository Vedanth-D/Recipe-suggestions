import React from 'react';

const TYPE_BADGE = {
  starter: { bg: '#E1F5EE', color: '#085041' },
  main: { bg: '#E6F1FB', color: '#0C447C' },
  dessert: { bg: '#FAEEDA', color: '#633806' },
  breakfast: { bg: '#FBEAF0', color: '#72243E' },
  snack: { bg: '#F1EFE8', color: '#5F5E5A' },
};

export default function RecipeCard({ recipe, onOpen, onSave, isSaved }) {
  const badge = TYPE_BADGE[recipe.type] || TYPE_BADGE.snack;

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'transform 0.18s, border-color 0.18s' }}
      onClick={() => onOpen(recipe)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#1D9E75'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; }}
    >
      <div style={{ height: 120, background: '#f5f3ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative' }}>
        {recipe.emoji}
        <span style={{ position: 'absolute', top: 8, left: 8, padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 500, background: badge.bg, color: badge.color }}>
          {recipe.type}
        </span>
        <button
          style={{ position: 'absolute', top: 7, right: 7, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.88)', border: 'none', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { e.stopPropagation(); onSave(recipe); }}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
        {recipe.isAI && (
          <span style={{ position: 'absolute', bottom: 8, right: 8, background: '#1D9E75', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>AI</span>
        )}
      </div>

      <div style={{ padding: '11px 13px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 500, marginBottom: 5, lineHeight: 1.3 }}>
          {recipe.name}
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#888780', marginBottom: 6 }}>
          <span>⏱ {recipe.time}m</span>
          <span>👥 {recipe.serves}</span>
          <span style={{ textTransform: 'capitalize' }}>{recipe.cuisine}</span>
        </div>
        {recipe.matchPct !== undefined && (
          <>
            <div className="match-bar"><div className="match-fill" style={{ width: `${recipe.matchPct}%` }} /></div>
            <div style={{ fontSize: 10, color: '#888780', marginTop: 3 }}>{recipe.matchPct}% ingredient match</div>
          </>
        )}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 7 }}>
          {(recipe.tags || []).slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </div>
  );
}