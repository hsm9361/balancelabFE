import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    const originalRequest = error.config;

    // 401 에러이고 토큰 재발급 시도를 하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken으로 새로운 accessToken 발급 시도
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken: refreshToken
        });

        const { accessToken: newAccessToken } = response.data;

        // 새로운 accessToken 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 시 로그아웃 처리
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // 로그인 페이지로 리다이렉트
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient; 