import apiClient from './apiClient';

export const memberService = {
  // 회원 정보 조회
  getMemberInfo: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await apiClient.get(`/member/info`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch member info:', error);
      throw error;
    }
  },

  // 회원 정보 수정
  updateMemberInfo: async (formData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      // Log FormData contents before sending
      console.log('FormData contents in service:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await apiClient.post(`/member/info`, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // Let browser set the Content-Type header with boundary
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update member info:', error);
      throw error;
    }
  }
}; 