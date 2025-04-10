import React, { useState } from 'react';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';
import HealthPredictionForm from 'components/healthPrediction/HealthPredictionForm';
import HealthPredictionResults from 'components/healthPrediction/HealthPredictionResults';

function HealthPrediction() {
  const [predictions, setPredictions] = useState(null);

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
  
      const data = await response.json();
      setPredictions(data);
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
      {predictions && <HealthPredictionResults predictions={predictions} />}
    </div>
  );
}

export default HealthPrediction; 