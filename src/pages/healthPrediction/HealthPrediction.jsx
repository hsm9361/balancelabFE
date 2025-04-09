import React, { useState } from 'react';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';
import HealthPredictionForm from 'components/healthPrediction/HealthPredictionForm';
import HealthPredictionResults from 'components/healthPrediction/HealthPredictionResults';

function HealthPrediction() {
  const [predictions, setPredictions] = useState(null);

  const handleSubmit = async (inputData) => {
    try {
      const response = await fetch('http://192.168.0.66:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error('Error:', error);
      alert('예측 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="health-prediction">
      <h1>🧬 질병 예측 시스템</h1>
      <h2>생활 습관, 가족력 등을 입력하여 질병 여부를 예측해보세요!</h2>

      <HealthPredictionForm onSubmit={handleSubmit} />
      {predictions && <HealthPredictionResults predictions={predictions} />}
    </div>
  );
}

export default HealthPrediction; 