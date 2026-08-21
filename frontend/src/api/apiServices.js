import axiosInstance from './axiosInstance';

// User API endpoints
export const userAPI = {
  login: (email, password) =>
    axiosInstance.post('/users/login', { email, password }),
  
  register: (name, email, password) =>
    axiosInstance.post('/users/register', { name, email, password }),
  
  getProfile: () =>
    axiosInstance.get('/users/profile'),
  
  updateProfile: (userData) =>
    axiosInstance.put('/users/profile', userData),
};

// Crops API endpoints
export const cropAPI = {
  getAll: () =>
    axiosInstance.get('/crops'),
  
  create: (cropData) =>
    axiosInstance.post('/crops', cropData),
  
  update: (id, cropData) =>
    axiosInstance.put(`/crops/${id}`, cropData),
  
  delete: (id) =>
    axiosInstance.delete(`/crops/${id}`),
};

// AI API endpoints
export const aiAPI = {
  diseaseDetection: (formData) =>
    axiosInstance.post('/ai/disease', formData),
  
  yieldPrediction: (cropData) =>
    axiosInstance.post('/ai/yield', cropData),
  
  fertilizerRecommendation: (soilData) =>
    axiosInstance.post('/ai/fertilizer', soilData),
  
  farmingAssistant: (question) =>
    axiosInstance.post('/ai/assistant', { question }),
};

// Expenses API endpoints
export const expenseAPI = {
  getAll: () =>
    axiosInstance.get('/expenses'),
  
  create: (expenseData) =>
    axiosInstance.post('/expenses', expenseData),
  
  update: (id, expenseData) =>
    axiosInstance.put(`/expenses/${id}`, expenseData),
  
  delete: (id) =>
    axiosInstance.delete(`/expenses/${id}`),
};
