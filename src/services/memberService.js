import apiClient from './apiClient';

export const memberService = {
  // 회원 정보 조회
  getMemberInfo: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Authentication required');
      }
      const response = await apiClient.get(`/member/info`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch member info:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  },

  // 회원 정보 수정
  updateMemberInfo: async (formData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      console.log('FormData contents in service:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await apiClient.post(`/member/info`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type은 FormData가 자동 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update member info:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  },
};