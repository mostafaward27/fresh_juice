import axios from 'axios';

// Configure standard Axios client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shabar_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper to simulate API latency with Framer Motion loaders and transitions
export const mockApiCall = <T>(data: T, delayMs = 400): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};

export default api;
