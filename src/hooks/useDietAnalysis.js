import { useCallback, useState } from 'react';
import axios from 'axios';

export const useDietAnalysis = (userId = 'testUser') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeDiet = useCallback(async (message) => {
    if (!message.trim()) {
      throw new Error('입력된 음식이 없습니다.');
    }
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await axios.post(
        'http://localhost:8080/diet-analysis/message',
        null,
        {
          params: { message },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      setAnalysisResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || '식단 분석 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { analyzeDiet, loading, error, analysisResult };
};
// import { useCallback, useState } from 'react';
// import axios from 'axios';

// export const useDietAnalysis = (userId = 'testUser') => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [analysisResult, setAnalysisResult] = useState(null);

//   const analyzeDiet = useCallback(async (message) => {
//     setLoading(true);
//     setError(null);
//     setAnalysisResult(null);

//     try {
//       const response = await axios.post(
//         'http://localhost:8080/diet-analysis/message',
//         null,
//         {
//           params: { message },
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         }
//       );
//       setAnalysisResult(response.data);
//       return response.data;
//     } catch (err) {
//       const errorMessage = err.response?.data?.nextMealSuggestion || '식단 분석 중 오류가 발생했습니다.';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   return { analyzeDiet, loading, error, analysisResult };
// };