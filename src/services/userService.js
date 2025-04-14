import apiClient from './apiClient';

export const userService = {
  // 사용자 정보 조회
  getUserInfo: async () => {
    try {
      const response = await apiClient.get('/api/user/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  },

  // 사용자 신체 정보 업데이트
  updateUserInfo: async (userInfo) => {
    try {
      const response = await apiClient.put('/api/user/info', userInfo);
      return response.data;
    } catch (error) {
      console.error('Failed to update user info:', error);
      throw error;
    }
  },

  // 사용자 신체 정보 조회
  getUserBodyInfo: async () => {
    try {
      const response = await apiClient.get('/api/user/body-info');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user body info:', error);
      throw error;
    }
  },

  // 사용자 신체 정보 저장
  saveUserBodyInfo: async (bodyInfo) => {
    try {
      const response = await apiClient.post('/api/user/body-info', bodyInfo);
      return response.data;
    } catch (error) {
      console.error('Failed to save user body info:', error);
      throw error;
    }
  }
}; 