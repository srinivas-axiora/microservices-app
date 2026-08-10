import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'guest-user-123';
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const setAuthData = (token, userId, email, fullName) => {
  if (token) localStorage.setItem('token', token);
  if (userId) localStorage.setItem('userId', userId);
  if (email) localStorage.setItem('userEmail', email);
  if (fullName) localStorage.setItem('userFullName', fullName);
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userFullName');
};

export default api;
