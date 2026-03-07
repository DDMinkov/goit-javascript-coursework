import { createExerciseCardHtml } from './render-utils.js';

const STORAGE_KEY = 'favorite-exercises';
const apiBase = "https://your-energy.b.goit.study/api/exercises";

document.addEventListener('DOMContentLoaded', async () => {
  await renderFavorites();
});

export async function renderFavorites() {
  const container = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('fav-empty');
  
  if (!container) return;

  const favoriteIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const validIds = favoriteIds.filter(id => id && typeof id === 'string' && id.length > 5);

  if (validIds.length === 0) {
    container.innerHTML = '';
    container.classList.add('is-hidden');
    if (emptyState) emptyState.classList.remove('is-hidden');
    return;
  }

  try {
    const fetchPromises = validIds.map(id => 
      fetch(`${apiBase}/${id}`)
        .then(res => {
          if (!res.ok) {
            return null; 
          }
          return res.json();
        })
        .catch(() => null)
    );
    
    const results = await Promise.all(fetchPromises);
    const favoritesData = results.filter(item => item !== null);

    if (favoritesData.length === 0) {
      container.innerHTML = '';
      container.classList.add('is-hidden');
      if (emptyState) emptyState.classList.remove('is-hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('is-hidden');
    container.classList.remove('is-hidden');
    
    const markup = favoritesData.map(item => createExerciseCardHtml(item, true)).join('');
    container.innerHTML = markup;
    
    initDeleteListeners(); 
  } catch (error) {
    console.error("Critical error in renderFavorites:", error);
  }
}

function initDeleteListeners() {
  const container = document.getElementById('favorites-grid');
  if (!container) return;
  
  container.onclick = (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (!deleteBtn) return;
    
    const exerciseId = deleteBtn.dataset.id;
    removeFromFavorites(exerciseId);
  };
}

function removeFromFavorites(id) {
  let favoriteIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  favoriteIds = favoriteIds.filter(favId => favId !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  
  renderFavorites(); 
}