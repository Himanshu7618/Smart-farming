import axios from 'axios';

// Centralized axios instance configuration
// Change the BASE_URL here to switch between development and production
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
