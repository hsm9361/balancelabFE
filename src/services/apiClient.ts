import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
  withCredentials: true,
});

// 리다이렉트 플래그
let isRedirecting = false;

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if ((error.response.status === 401 || error.response.status === 403) && !isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        const redirectUrl = process.env.REACT_APP_OAUTH_REDIRECT
          ? `${BASE_URL}/oauth2/authorization/google`
          : '/';

        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/oauth')) {
          window.location.href = redirectUrl;
        }
        return Promise.reject(new Error('Authentication required'));
      }
    } else if (error.request) {
      console.error('Network error, no response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    isRedirecting = false;
    return Promise.reject(error);
  }
);

export default apiClient;