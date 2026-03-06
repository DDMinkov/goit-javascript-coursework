import { fetchCategories, fetchExercises } from './api.js';
import { createExerciseCardHtml } from './render-utils.js';

const exerciseGrid = document.getElementById('exercise-grid');
const filterList = document.getElementById('filter-list');
const titleElem = document.getElementById('exercises-title');
const searchForm = document.getElementById('search-form');
const paginationContainer = document.getElementById('pagination');

// Track current view state
let currentState = {
  view: 'categories', // 'categories' or 'exercises'
  filter: 'Muscles',
  category: '',
  keyword: '',
  page: 1,
  limit: 12 // Adjusted for better grid symmetry
};

export async function initExercises() {
  loadCategories(); // Initial load

  // 1. Filter Buttons
  filterList.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    currentState.view = 'categories';
    currentState.filter = e.target.dataset.filter;
    currentState.page = 1;
    
    resetView();
    loadCategories();
  });

  // 2. Search Form
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentState.keyword = e.target.elements.keyword.value.trim();
    currentState.page = 1;
    loadExercises();
  });

  // 3. Category Card Click
  exerciseGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.category-item');
    if (!card) return;

    currentState.view = 'exercises';
    currentState.category = card.dataset.name;
    currentState.page = 1;
    currentState.keyword = '';
    
    switchToExercisesView();
  });

  // 4. Pagination Click
  paginationContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('page-btn')) return;
    
    currentState.page = parseInt(e.target.dataset.page);
    
    if (currentState.view === 'categories') {
      loadCategories();
    } else {
      loadExercises();
    }
    
    // Smooth scroll back to top of grid
    window.scrollTo({ top: exerciseGrid.offsetTop - 100, behavior: 'smooth' });
  });
}

async function loadCategories() {
  try {
    const data = await fetchCategories(currentState.filter, currentState.page, currentState.limit);
    renderCategories(data.results);
    renderPagination(data.totalPages);
  } catch (err) { console.error(err); }
}

async function loadExercises() {
  const sanitizedFilter = currentState.filter.toLowerCase().replace(' ', '');
  try {
    const data = await fetchExercises({
      [sanitizedFilter]: currentState.category,
      keyword: currentState.keyword,
      page: currentState.page,
      limit: 10
    });
    renderExercises(data.results);
    renderPagination(data.totalPages);
  } catch (err) { console.error(err); }
}

function renderCategories(categories) {
  exerciseGrid.innerHTML = categories.map(item => `
    <li class="category-item" data-name="${item.name}">
      <div class="category-card" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${item.imgURL}')">
         <h3>${item.name}</h3>
         <p>${item.filter}</p>
      </div>
    </li>
  `).join('');
}

function renderExercises(exercises) {
  if (exercises.length === 0) {
    exerciseGrid.innerHTML = `<li class="no-results">No exercises found.</li>`;
    return;
  }
  
  // Use the shared helper (isFavoriteView = false)
  exerciseGrid.innerHTML = exercises.map(ex => createExerciseCardHtml(ex, false)).join('');
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let buttons = '';
  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button class="page-btn ${i === currentState.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  paginationContainer.innerHTML = buttons;
}

function resetView() {
  titleElem.textContent = "Exercises";
  searchForm.classList.add('is-hidden');
  searchForm.reset();
  currentState.keyword = '';
}

function switchToExercisesView() {
  titleElem.innerHTML = `Exercises / <span class="category-accent">${currentState.category}</span>`;
  searchForm.classList.remove('is-hidden');
  loadExercises();
}