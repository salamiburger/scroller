import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getRandomVideo = () => api.get('/videos/random');
export const getVideosBySource = (source) => api.get(`/videos/${source}`);
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const getUserProfile = () => api.get('/auth/profile');

export default api;
