import apiClient from './apiClient';

export const memberService = {
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
      console.log('Get member info response:', {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error) {
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: '/member/info',
      };
      console.error('Failed to fetch member info:', errorDetails);
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      if (error.response?.status === 403) {
        throw new Error('접근 권한이 없습니다.');
      }
      if (error.response?.status === 404) {
        throw new Error('회원 정보가 존재하지 않습니다.');
      }
      throw new Error(error.response?.data?.message || '회원 정보 조회에 실패했습니다.');
    }
  },

  updateMemberInfo: async (formData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await apiClient.post(`/member/info`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Update member info response:', {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error) {
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: '/member/info',
      };
      console.error('Failed to update member info:', errorDetails);
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error(error.response?.data?.message || '회원 정보 수정에 실패했습니다.');
    }
  },
};