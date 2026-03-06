import { initHeader } from './js/header.js';
import { initQuote } from './js/quote.js';
import { initExercises } from './js/exercises.js';
import './js/exercise-modal.js';
import './js/favorites-page.js';
import './js/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initQuote();
  initExercises();
});