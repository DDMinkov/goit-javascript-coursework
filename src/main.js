import { initQuote } from './js/quote.js';
import { initExercises } from './js/exercises.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("Your Energy App Initialized");
  initQuote();
  initExercises();
});