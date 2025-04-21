import { useCallback, useState } from 'react';
import apiClient from '../services/apiClient';

export const useImageUpload = (userId = 'testUser') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const uploadImage = useCallback(
    async (imageFile) => {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);

      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('userId', userId);

        const response = await apiClient.post(
          'http://localhost:8080/image-analysis/start',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('API Response:', response.data);

        if (response.data?.error) {
          const errorMessage = response.data.error;
          setError(errorMessage);
          throw new Error(errorMessage);
        }

        setAnalysisResult(response.data);
        return response.data;
      } catch (err) {
        let errorMessage = '이미지 업로드 중 오류가 발생했습니다.';
        if (err.message) {
          errorMessage = err.message;
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.data) {
          errorMessage = JSON.stringify(err.response.data);
        }
        console.error('Upload error:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { uploadImage, loading, error, analysisResult };
};