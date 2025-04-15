// hooks/useImageUpload.js
import { useCallback, useState } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';

export const useImageUpload = (userId = 'testUser') => { // userId는 기본값 또는 외부에서 주입
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const uploadImage = useCallback(async (imageFile) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('userId', userId);

      const response = await apiClient.post(
        'http://localhost:8080/image-analysis/start', // Spring Boot 엔드포인트
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setAnalysisResult(response.data);
      return response.data; // 호출한 곳에서 결과 활용 가능
    } catch (err) {
      setError(err.response?.data || '이미지 업로드 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { uploadImage, loading, error, analysisResult };
};