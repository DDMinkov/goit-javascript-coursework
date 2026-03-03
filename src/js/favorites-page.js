import { initQuote } from './quote.js';

const STORAGE_KEY = 'favorite-exercises';

document.addEventListener('DOMContentLoaded', () => {
  initQuote(); // Initialize the quote in the sidebar
  renderFavorites();
  initDeleteListeners();
});

export function renderFavorites() {
  const container = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('fav-empty');
  const favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (favorites.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('is-hidden');
    return;
  }

  emptyState.classList.add('is-hidden');
  
  // Updated markup to use classes from exercises.css
  const markup = favorites.map(item => `
    <li class="exercise-card">
      <div class="card-top">
        <div class="workout-tag">WORKOUT</div>
        <div style="display: flex; gap: 8px; margin-left: auto; align-items: center;">
            <button class="delete-btn" data-id="${item._id}" aria-label="Remove from favorites" style="background:none; border:none; padding: 0; cursor:pointer;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <button class="start-btn" data-id="${item._id}">
              Start ➔
              <svg width="16" height="16"><use href="./img/sprite.svg#icon-arrow"></use></svg>
            </button>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 8px;">
        <h3 class="exercise-name">${item.name}</h3>
      </div>

      <div class="card-info">
        <p>Burned calories: <span>${item.burnedCalories} / ${item.time} min</span></p>
        <p>Body part: <span>${item.bodyPart}</span></p>
        <p>Target: <span>${item.target}</span></p>
      </div>
    </li>
  `).join('');

  container.innerHTML = markup;
}

function initDeleteListeners() {
  const container = document.getElementById('favorites-grid');
  container.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;
    removeFromFavorites(id);
  });
}

function updateHeaderActiveState() {
  const homeLink = document.querySelector('a[href="./index.html"]');
  const favLink = document.querySelector('a[href="./favorites.html"]');
  
  if (homeLink && favLink) {
    homeLink.classList.remove('active');
    favLink.classList.add('active');
  }
}

function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  favorites = favorites.filter(item => item._id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  renderFavorites(); // Re-render the list immediately
}