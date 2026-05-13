// API Client for MongoDB Backend
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name: string) => {
    const response = await apiClient.post('/auth/register', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// Cycles API
export const cyclesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/cycles');
    return response.data.cycles;
  },

  create: async (cycleData: any) => {
    const response = await apiClient.post('/cycles', cycleData);
    return response.data.cycle;
  },

  update: async (id: string, cycleData: any) => {
    const response = await apiClient.put('/cycles', { id, ...cycleData });
    return response.data.cycle;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/cycles?id=${id}`);
    return response.data;
  },
};

// Daily Logs API
export const dailyLogsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/daily-logs');
    return response.data.logs;
  },

  create: async (logData: any) => {
    const response = await apiClient.post('/daily-logs', logData);
    return response.data.log;
  },

  update: async (id: string, logData: any) => {
    const response = await apiClient.put('/daily-logs', { id, ...logData });
    return response.data.log;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/daily-logs?id=${id}`);
    return response.data;
  },
};

export default apiClient;
