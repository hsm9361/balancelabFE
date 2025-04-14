import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true // CORS 요청에서 쿠키를 포함하도록 설정
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // FormData 요청의 경우 Content-Type 헤더를 설정하지 않음
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('accessToken');
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
      return Promise.reject(new Error('Authentication required'));
    }
    return Promise.reject(error);
  }
);

export default apiClient; 