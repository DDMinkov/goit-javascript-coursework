import { createExerciseCardHtml } from './render-utils.js'; //

const STORAGE_KEY = 'favorite-exercises';
const apiBase = "https://your-energy.b.goit.study/api/exercises";

document.addEventListener('DOMContentLoaded', async () => {
  await renderFavorites();
});

export async function renderFavorites() {
  const container = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('fav-empty');
  
  const favoriteIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // 1. Immediate check: If storage is empty, show message and STOP
  if (favoriteIds.length === 0) {
    container.innerHTML = '';
    container.classList.add('is-hidden'); // Ensure grid is hidden
    emptyState.classList.remove('is-hidden'); // Show the "It appears..." text
    return;
  }

  try {
    const fetchPromises = favoriteIds.map(id => 
      fetch(`${apiBase}/${id}`).then(res => res.ok ? res.json() : null)
    );
    
    const favoritesData = (await Promise.all(fetchPromises)).filter(item => item !== null);

    // 2. Secondary check: If API returns nothing for those IDs
    if (favoritesData.length === 0) {
      container.innerHTML = '';
      container.classList.add('is-hidden');
      emptyState.classList.remove('is-hidden');
      return;
    }

    // 3. Success: Hide the empty message and show the grid
    emptyState.classList.add('is-hidden');
    container.classList.remove('is-hidden');
    
    const markup = favoritesData.map(item => createExerciseCardHtml(item, true)).join('');
    container.innerHTML = markup;
    
    initDeleteListeners(); 
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

function initDeleteListeners() {
  const container = document.getElementById('favorites-grid');
  container.onclick = (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (!deleteBtn) return;
    removeFromFavorites(deleteBtn.dataset.id);
  };
}

function removeFromFavorites(id) {
  let favoriteIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  favoriteIds = favoriteIds.filter(favId => favId !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  
  // Re-run the render logic immediately to update the UI
  renderFavorites(); 
}