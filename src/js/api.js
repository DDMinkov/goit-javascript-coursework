import axios from 'axios';

const BASE_URL = 'https://your-energy.b.goit.study/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchQuote = async () => {
  const response = await api.get('/quote');
  return response.data;
};

export const fetchCategories = async (filter, page = 1, limit = 12) => {
  const response = await api.get('/filters', {
    params: { filter, page, limit },
  });
  return response.data;
};

export const fetchExercises = async (params) => {
  const response = await api.get('/exercises', { params });
  return response.data;
};