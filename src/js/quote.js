import { fetchQuote } from './api.js';

const STORAGE_KEY = 'daily-quote';

export async function initQuote() {
  const container = document.getElementById('quote-container');
  if (!container) return;

  const today = new Date().toLocaleDateString();
  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (savedData && savedData.date === today) {
    renderQuote(container, savedData.quote, savedData.author);
    return;
  }

  try {
    const data = await fetchQuote();
    const dataToSave = { ...data, date: today };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    renderQuote(container, data.quote, data.author);
  } catch (error) {
    console.error("Quote error:", error);
  }
}

function renderQuote(container, text, author) {
  const textElem = container.querySelector('.quote-text');
  const authorElem = container.querySelector('.quote-author');
  if (textElem) textElem.textContent = text;
  if (authorElem) authorElem.textContent = author;
}