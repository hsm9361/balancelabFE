import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';
import HealthPredictionForm from 'components/healthPrediction/HealthPredictionForm';

function HealthPrediction() {
  const navigate = useNavigate();

  const handleSubmit = async (inputData) => {
    try {
      const response = await fetch('http://localhost:8000/predict/health', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '서버 응답 오류');
      }
  
      const predictions = await response.json();
      console.log('Prediction data:', predictions); // 디버깅을 위한 로그
      
      // 입력 데이터와 예측 결과를 함께 전달
      navigate('/healthprediction/result', { 
        state: { 
          inputData,
          predictions 
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`예측 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <div className="health-prediction">
      <h1>🧬 질병 예측 시스템</h1>
      <h2>질병 위험군을 예측해보세요!</h2>

      <HealthPredictionForm onSubmit={handleSubmit} />
    </div>
  );
}

export default HealthPrediction; 