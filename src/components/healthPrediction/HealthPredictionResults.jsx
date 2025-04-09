import React from 'react';

function HealthPredictionResults({ predictions }) {
  // 헬퍼 함수: 확률에 따른 해석 메시지 반환
  const interpretRisk = (proba, diseaseName) => {
    if (proba >= 0.75) {
      return (
        <p className="warning">
          ❗ {diseaseName} 가능성이 높습니다. ({(proba * 100).toFixed(2)}%)
        </p>
      );
    } else if (proba >= 0.5) {
      return (
        <p className="medium">
          ⚠️ {diseaseName} 가능성이 중간 이상입니다. ({(proba * 100).toFixed(2)}%)
        </p>
      );
    } else {
      return (
        <p className="safe">
          ✅ {diseaseName} 가능성은 낮습니다. ({(proba * 100).toFixed(2)}%)
        </p>
      );
    }
  };

  return (
    <div className="prediction-results">
      <h3>✅ 예측 결과</h3>
      <div className="result-item">
        {interpretRisk(predictions.diabetes, '당뇨')}
      </div>

      <div className="result-item">
        {interpretRisk(predictions.hypertension, '고혈압')}
      </div>

      <div className="result-item">
        {interpretRisk(predictions.cardiovascular, '심혈관질환')}
      </div>
    </div>
  );
}

export default HealthPredictionResults;
