import { fetchCategories, fetchExercises } from './api.js';

const exerciseGrid = document.getElementById('exercise-grid');
const filterList = document.getElementById('filter-list');
const titleElem = document.getElementById('exercises-title');
const searchForm = document.getElementById('search-form');

export async function initExercises() {
  loadCategories('Muscles'); // Initial load

  // 1. Filter Buttons Listener (Independent)
  filterList.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;

    // Toggle Active Class for Animated Underline
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    resetView();
    loadCategories(e.target.dataset.filter);
  });

  // 2. Search Form Submit (Independent)
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const keyword = e.target.elements.keyword.value.trim();
    const activeBtn = document.querySelector('.filter-btn.active');
    const filter = activeBtn ? activeBtn.dataset.filter : 'Muscles';
    const category = titleElem.querySelector('.category-accent')?.textContent;

    if (!keyword) return;

    const sanitizedFilter = filter.toLowerCase().replace(' ', '');
    try {
      const data = await fetchExercises({
        [sanitizedFilter]: category,
        keyword: keyword,
        page: 1,
        limit: 10
      });
      renderExercises(data.results);
    } catch (err) {
      console.error(err);
    }
  });

  // 3. Category Card Click
  exerciseGrid.addEventListener('click', async (e) => {
    const card = e.target.closest('.category-item');
    if (!card) return;

    const category = card.dataset.name;
    const activeBtn = document.querySelector('.filter-btn.active');
    const filter = activeBtn ? activeBtn.dataset.filter : 'Muscles';

    switchToExercises(filter, category);
  });
}

function resetView() {
  titleElem.textContent = "Exercises";
  searchForm.classList.add('is-hidden');
  searchForm.reset(); 
}

function renderExercises(exercises) {
  if (exercises.length === 0) {
    exerciseGrid.innerHTML = `<li class="no-results">No exercises found.</li>`;
    return;
  }

  exerciseGrid.innerHTML = exercises.map(ex => `
    <li class="exercise-card">
      <div class="card-top">
        <span class="workout-tag">WORKOUT</span>
        <span class="rating">${ex.rating.toFixed(1)} ⭐</span>
        <button class="start-btn" data-id="${ex._id}">Start ➔</button>
      </div>
      <h3 class="exercise-name">${ex.name}</h3>
      <div class="card-info">
        <p><span>Burned calories:</span> ${ex.burnedCalories} / 3 min</p>
        <p><span>Body part:</span> ${ex.bodyPart}</p>
        <p><span>Target:</span> ${ex.target}</p>
      </div>
    </li>
  `).join('');
}

async function switchToExercises(filter, category) {
  titleElem.innerHTML = `Exercises / <span class="category-accent">${category}</span>`;
  searchForm.classList.remove('is-hidden'); 

  const sanitizedFilter = filter.toLowerCase().replace(' ', '');
  try {
    const data = await fetchExercises({
      [sanitizedFilter]: category,
      page: 1,
      limit: 10
    });
    renderExercises(data.results);
  } catch (err) {
    console.error(err);
  }
}

async function loadCategories(filter) {
  try {
    const data = await fetchCategories(filter);
    exerciseGrid.innerHTML = data.results.map(item => `
      <li class="category-item" data-name="${item.name}">
        <div class="category-card" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${item.imgURL}')">
           <h3>${item.name}</h3>
           <p>${item.filter}</p>
        </div>
      </li>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}