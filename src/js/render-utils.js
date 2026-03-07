export function createExerciseCardHtml(ex, isFavoriteView = false) {
  const capitalizedName = ex.name.charAt(0).toUpperCase() + ex.name.slice(1);

  // Фікс [object Object]
  const ratingValue = typeof ex.rating === 'object' ? ex.rating.rate : ex.rating;
  const displayRating = Number(ratingValue || 0).toFixed(1);

  // Кнопка видалення (Favorites) або Рейтинг (Exercises)
  const actionElement = isFavoriteView 
    ? `<button class="delete-btn" data-id="${ex._id}" aria-label="Remove">
         <svg width="18" height="18">
           <use href="/img/sprite.svg#icon-trash"></use>
         </svg>
       </button>`
    : `<span class="rating">${displayRating} 
         <svg width="18" height="18">
           <use href="/img/sprite.svg#icon-ratestar"></use>
         </svg>
       </span>`;

  return `
    <li class="exercise-card">
      <div class="card-top">
        <div class="workout-tag">WORKOUT</div>
        ${actionElement}
        <button class="start-btn" data-id="${ex._id}" type="button">
          Start
          <svg width="16" height="16">
            <use href="/img/sprite.svg#icon-arrow"></use>
          </svg>
        </button>
      </div>
      
      <div class="exercise-title-container">
        <div class="exercise-icon-container">
          <svg width="24" height="24">
            <use href="/img/sprite.svg#icon-exec"></use>
          </svg>
        </div>
        <h3 class="exercise-name">${capitalizedName}</h3>
      </div>

      <ul class="card-info">
        <li><span>Burned calories:</span> ${ex.burnedCalories} / ${ex.time} min</li>
        <li><span>Body part:</span> ${ex.bodyPart}</li>
        <li><span>Target:</span> ${ex.target}</li>
      </ul>
    </li>
  `;
}