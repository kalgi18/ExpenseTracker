import axios from 'axios';

const API = axios.create({
  baseURL: 'https://expense-tracker-backend-4b3r.onrender.com',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
