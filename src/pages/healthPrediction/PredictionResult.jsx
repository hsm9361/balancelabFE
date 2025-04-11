import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HealthPredictionResults from 'components/healthPrediction/HealthPredictionResults';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';

function PredictionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputData, predictions } = location.state || {};
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log('Received data:', { inputData, predictions }); // 디버깅을 위한 로그
  }, [inputData, predictions]);

  const handleConsultClick = async () => {
    try {
      setIsSaving(true);
      
      // 저장할 데이터 구성
      const saveData = {
        ...inputData,
        diabetesProba: predictions.diabetes,
        hypertensionProba: predictions.hypertension,
        cdvProba: predictions.cardiovascular
      };

      const response = await fetch('http://localhost:8080/api/health-prediction/save_prediction', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        throw new Error('예측 결과 저장에 실패했습니다.');
      }

      navigate('/diet-consulting');
    } catch (error) {
      console.error('Error saving predictions:', error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!predictions) {
    return (
      <div className="health-prediction">
        <h1>결과를 찾을 수 없습니다</h1>
        <button onClick={() => navigate('/healthprediction')}>돌아가기</button>
      </div>
    );
  }

  return (
    <div className="health-prediction">
      <h1>🧬 질병 예측 결과</h1>
      <HealthPredictionResults predictions={predictions} />
      <div className="button-group">
        <button 
          className="back-button"
          onClick={() => navigate('/healthprediction')}
        >
          돌아가기
        </button>
        <button 
          className="consult-button"
          onClick={handleConsultClick}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '저장 후 AI에게 식단 추천받기'}
        </button>
      </div>
    </div>
  );
}

export default PredictionResult; 