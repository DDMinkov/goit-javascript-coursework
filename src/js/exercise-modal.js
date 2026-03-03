const apiBase = "https://your-energy.b.goit.study/api/exercises";
const STORAGE_KEY = 'favorite-exercises';
const modal = document.querySelector('#exercise-modal');
const ratingModal = document.querySelector('#rating-modal');

// Select both the home grid and the favorites grid
const exerciseGrid = document.querySelector('#exercise-grid') || document.querySelector('#favorites-grid');

let currentExercise = null;

if (exerciseGrid) {
  exerciseGrid.addEventListener('click', async (e) => {
    const startBtn = e.target.closest('.start-btn');
    if (!startBtn) return;

    const exerciseId = startBtn.dataset.id;
    try {
      const response = await fetch(`${apiBase}/${exerciseId}`);
      const data = await response.json();
      
      currentExercise = data; // Store data for the favorite toggle
      fillModal(data);
      modal.classList.remove('is-hidden');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error("Failed to load exercise details:", error);
    }
  });
}

function fillModal(data) {
  if (!modal) return;
  modal.querySelector('.js-exercise-img').src = data.gifUrl;
  modal.querySelector('.js-exercise-title').textContent = data.name;
  modal.querySelector('.js-rating-value').textContent = data.rating.toFixed(1);
  modal.querySelector('.js-target').textContent = data.target;
  modal.querySelector('.js-bodyPart').textContent = data.bodyPart;
  modal.querySelector('.js-equipment').textContent = data.equipment;
  modal.querySelector('.js-popular').textContent = data.popularity;
  modal.querySelector('.js-calories').textContent = `${data.burnedCalories}/${data.time} min`;
  modal.querySelector('.js-description').textContent = data.description;
  
  renderStars(data.rating, modal.querySelector('.js-stars'));
  updateFavoriteBtnState(); // Check if this should say "Add" or "Remove"
}

// Logic to toggle Favorites
function updateFavoriteBtnState() {
  const favBtn = modal.querySelector('.add-fav-btn');
  if (!favBtn || !currentExercise) return;

  const favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const isFav = favorites.some(item => item._id === currentExercise._id);

  if (isFav) {
    favBtn.innerHTML = `Remove from favorites <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
  } else {
    favBtn.innerHTML = `Add to favorites <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"/>`;
  }
}

function toggleFavorite() {
  let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const index = favorites.findIndex(item => item._id === currentExercise._id);

  if (index === -1) {
    favorites.push(currentExercise);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  updateFavoriteBtnState();

  // If we are on the favorites page, refresh the list immediately
  if (document.getElementById('favorites-grid')) {
    location.reload(); 
  }
}

function renderStars(rating, container) {
  if (!container) return;
  const roundedRating = Math.round(rating);
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    const starColor = i <= roundedRating ? '#EEA10C' : 'rgba(244, 244, 244, 0.2)';
    starsHtml += `<span style="color: ${starColor}; cursor: pointer; font-size: 18px;">★</span>`;
  }
  container.innerHTML = starsHtml;
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target.closest('.modal-close-btn') || e.target === modal) {
      modal.classList.add('is-hidden');
      document.body.style.overflow = 'auto';
    }

    if (e.target.closest('.give-rating-btn')) {
      modal.classList.add('is-hidden'); 
      ratingModal.classList.remove('is-hidden'); 
      updateRatingSelection(0); 
    }

    if (e.target.closest('.add-fav-btn')) {
      toggleFavorite();
    }
  });
}

if (ratingModal) {
  const ratingForm = ratingModal.querySelector('.rating-form');

  ratingModal.addEventListener('click', (e) => {
    if (e.target.closest('[data-rating-modal-close]') || e.target === ratingModal) {
      ratingModal.classList.add('is-hidden');
      document.body.style.overflow = 'auto';
    }
  });

  if (ratingForm) {
    ratingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      ratingModal.classList.add('is-hidden');
      document.body.style.overflow = 'auto';
      
      ratingForm.reset();
      console.log("Rating modal closed via Send button.");
    });
  }

  const starsContainer = ratingModal.querySelector('.js-rating-stars');
  starsContainer.addEventListener('click', (e) => {
    if (e.target.tagName !== 'SPAN') return;
    
    const stars = Array.from(starsContainer.children);
    const clickedIndex = stars.indexOf(e.target);
    const newRating = clickedIndex + 1;
    
    updateRatingSelection(newRating);
  });
}

function updateRatingSelection(rating) {
  const numDisplay = ratingModal.querySelector('.js-rating-number');
  const starsContainer = ratingModal.querySelector('.js-rating-stars');
  if (numDisplay) numDisplay.textContent = rating.toFixed(1);
  renderStars(rating, starsContainer);
}