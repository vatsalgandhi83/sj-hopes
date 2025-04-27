import axios from 'axios';

const API_URL = 'http://localhost:8081';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { role } = JSON.parse(user);
      // For hackathon purpose, we'll just add role in header
      // In production, this should be a proper JWT token
      config.headers['X-User-Role'] = role;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // Clear user data and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Handle 403 Forbidden (usually role-based access issues)
      if (error.response.status === 403) {
        console.error('Access forbidden. Insufficient permissions.');
        return Promise.reject(new Error('You do not have permission to perform this action.'));
      }

      // Handle other errors
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 