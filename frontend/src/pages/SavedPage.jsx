import React from 'react';
import RecipeCard from '../components/RecipeCard.jsx';

export default function SavedPage({ savedRecipes, onOpen, saved, onSave }) {
  if (!savedRecipes.length) return (
    <div className="empty-state">
      <div className="icon">❤️</div>
      <div>No saved recipes yet</div>
      <div style={{ marginTop: 6, fontSize: 12 }}>Heart a recipe from Browse or Scan to save it here.</div>
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 13, color: '#888780', marginBottom: '1rem' }}>
        {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? 's' : ''}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {savedRecipes.map(r => (
          <RecipeCard key={r.id} recipe={r} onOpen={onOpen} onSave={onSave} isSaved={saved.has(r.id)} />
        ))}
      </div>
    </div>
  );
}