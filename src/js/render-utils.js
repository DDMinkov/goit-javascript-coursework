export function createExerciseCardHtml(ex, isFavoriteView = false) {
  const capitalizedName = ex.name.charAt(0).toUpperCase() + ex.name.slice(1);

  const actionButton = isFavoriteView 
    ? `<button class="delete-btn" data-id="${ex._id}" aria-label="Remove">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
       </button>`
    : `<span class="rating">${ex.rating.toFixed(1)} <svg width="18" height="18"><use href="./img/ratestar.svg"></use></svg></span>`;

  return `
    <li class="exercise-card">
      <div class="card-top">
        <div class="workout-tag">WORKOUT</div>
        ${actionButton}
        <button class="start-btn" data-id="${ex._id}">
          Start ➔
          <svg width="16" height="16"><use href="./img/sprite.svg#icon-arrow"></use></svg>
        </button>
      </div>
      
      <div class="exercise-title-container">
        <div class="exercise-icon-container">
          <svg width="24" height="24"><use href="./img/exec.svg"></use></svg>
        </div>
        <h3 class="exercise-name">${capitalizedName}</h3>
      </div>

      <div class="card-info">
        <p><span>Burned calories:</span> ${ex.burnedCalories} / ${ex.time} min</p>
        <p><span>Body part:</span> ${ex.bodyPart}</p>
        <p><span>Target:</span> ${ex.target}</p>
      </div>
    </li>
  `;
}