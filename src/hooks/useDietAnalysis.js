import { useCallback, useState } from 'react';
import axios from 'axios';
import apiClient from '../services/apiClient';

export const useDietAnalysis = (userId = 'testUser') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeDiet = useCallback(async (message, mealTime) => {
    if (!message.trim()) {
      throw new Error('입력된 음식이 없습니다.');
    }
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      const response = await apiClient.post(
        'http://localhost:8080/diet-analysis/message',
        formData,
        {
          params: { message, mealTime },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      // 응답 데이터 디버깅
      console.log('응답 데이터:', response.data);
      console.log('food_list:', response.data.food_list);

      // food_list 확인
      const foodList = response.data.food_list || [];
      if (!Array.isArray(foodList)) {
        console.warn('food_list가 배열이 아님:', foodList);
        throw new Error('분석할 음식이 없습니다. 음식을 추가해 주세요!');
      }

      // 비정상적인 foodList 항목 필터링
      const validFoodList = foodList.filter(food => {
        if (!food || typeof food !== 'string') return false;
        const trimmed = food.trim();
        return trimmed !== '' &&
               trimmed !== '[]' &&
               trimmed !== '[\"\"]' &&
               !trimmed.match(/```.*$$  $$.*```/);
      });

      if (validFoodList.length === 0) {
        console.warn('food_list가 비어 있거나 유효하지 않음:', foodList);
        throw new Error('분석할 음식이 없습니다. 음식을 추가해 주세요!');
      }

      // 유효한 foodList 디버깅
      console.log('유효한 foodList:', validFoodList);

      setAnalysisResult(response.data);
      return response.data;
    } catch (err) {
      console.error('분석 에러:', err);
      const errorMessage = err.message || '식단 분석 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { analyzeDiet, loading, error, analysisResult };
};