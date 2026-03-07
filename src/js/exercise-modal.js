const apiBase = "https://your-energy.b.goit.study/api/exercises";
const STORAGE_KEY = 'favorite-exercises';
const modal = document.querySelector('#exercise-modal');
const ratingModal = document.querySelector('#rating-modal');

const exerciseGrid = document.querySelector('#exercise-grid') || document.querySelector('#favorites-grid');

let currentExercise = null;

// 1. Функція обробки Escape
const handleEscKeyPress = (e) => {
  if (e.key === 'Escape') {
    // Якщо відкрита модалка рейтингу — закриваємо тільки її
    if (ratingModal && !ratingModal.classList.contains('is-hidden')) {
      ratingModal.classList.add('is-hidden');
      return;
    }
    // Інакше закриваємо основну модалку
    closeExerciseModal();
  }
};

// 2. Універсальна функція закриття основної модалки
function closeExerciseModal() {
  if (!modal) return;
  modal.classList.add('is-hidden');
  document.body.style.overflow = 'auto';
  // Видаляємо слухач, щоб він не висів у пам'яті
  window.removeEventListener('keydown', handleEscKeyPress);
}

if (exerciseGrid) {
  exerciseGrid.addEventListener('click', async (e) => {
    const startBtn = e.target.closest('.start-btn');
    if (!startBtn) return;

    const exerciseId = startBtn.dataset.id;
    try {
      const response = await fetch(`${apiBase}/${exerciseId}`);
      const data = await response.json();
      
      currentExercise = data;
      fillModal(data);
      
      modal.classList.remove('is-hidden');
      document.body.style.overflow = 'hidden';
      
      // ДОДАЄМО слухача при відкритті
      window.addEventListener('keydown', handleEscKeyPress);
      
    } catch (error) {
      console.error("Failed to load exercise details:", error);
    }
  });
}

function fillModal(data) {
  if (!modal) return;
  modal.querySelector('.js-exercise-img').src = data.gifUrl;
  modal.querySelector('.js-exercise-title').textContent = data.name;
  modal.querySelector('.js-rating-value').textContent = (typeof data.rating === 'object' ? data.rating.rate : data.rating).toFixed(1);
  modal.querySelector('.js-target').textContent = data.target;
  modal.querySelector('.js-bodyPart').textContent = data.bodyPart;
  modal.querySelector('.js-equipment').textContent = data.equipment;
  modal.querySelector('.js-popular').textContent = data.popularity;
  modal.querySelector('.js-calories').textContent = `${data.burnedCalories}/${data.time} min`;
  modal.querySelector('.js-description').textContent = data.description;
  
  renderStars(data.rating, modal.querySelector('.js-stars'));
  updateFavoriteBtnState();
}

function toggleFavorite() {
  if (!currentExercise) return;
  
  let favoriteIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const exerciseId = currentExercise._id;
  const index = favoriteIds.indexOf(exerciseId);

  if (index === -1) {
    favoriteIds.push(exerciseId);
  } else {
    favoriteIds.splice(index, 1);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  updateFavoriteBtnState();

  const favGrid = document.getElementById('favorites-grid');
  if (favGrid) {
    import('./favorites-page.js').then(m => m.renderFavorites());
  }
}

function updateFavoriteBtnState() {
  const favBtn = modal.querySelector('.add-fav-btn');
  if (!favBtn || !currentExercise) return;

  const favoriteIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const isFav = favoriteIds.includes(currentExercise._id);

  if (isFav) {
    favBtn.innerHTML = `Remove from favorites <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
  } else {
    favBtn.innerHTML = `Add to favorites <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
}

function renderStars(rating, container) {
  if (!container) return;
  const roundedRating = Math.round(rating || 0);
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    const starColor = i <= roundedRating ? '#EEA10C' : 'rgba(244, 244, 244, 0.2)';
    starsHtml += `<span style="color: ${starColor}; cursor: pointer; font-size: 18px;">★</span>`;
  }
  container.innerHTML = starsHtml;
}

if (modal) {
  modal.addEventListener('click', (e) => {
    // Використовуємо функцію закриття для кліків по хрестику або бекдропу
    if (e.target.closest('.modal-close-btn') || e.target === modal) {
      closeExerciseModal();
    }

    if (e.target.closest('.give-rating-btn')) {
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
    }
  });

  if (ratingForm) {
    ratingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailValue = ratingForm.elements.email.value.trim();
      const commentValue = ratingForm.elements.comment.value.trim();
      const ratingValue = parseFloat(ratingModal.querySelector('.js-rating-number').textContent);

      if (!emailValue) return alert("Email is required.");
      if (ratingValue === 0) return alert("Please select a star rating.");

      try {
        const response = await fetch(`${apiBase}/${currentExercise._id}/rating`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rate: ratingValue,
            email: emailValue,
            review: commentValue
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to submit rating");
        }

        alert("Thank you for your rating!");
        ratingModal.classList.add('is-hidden');
        ratingForm.reset();
      } catch (error) {
        alert(error.message);
      }
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