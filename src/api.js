// RapidAPI Movies Database örnek endpoint ayarları
// Kendi RapidAPI anahtarınızı .env dosyasına ekleyin: REACT_APP_RAPIDAPI_KEY=xxx

import axios from 'axios';

const API_HOST = 'movie-database-api1.p.rapidapi.com';
const API_URL = `https://${API_HOST}`;

if (!process.env.REACT_APP_RAPIDAPI_KEY) {
  console.error('RapidAPI key is missing! Please add REACT_APP_RAPIDAPI_KEY to your .env file');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
