import React from 'react';

function HealthPredictionResults({ predictions }) {
  // 헬퍼 함수: 확률에 따른 해석 메시지 반환
  const interpretRisk = (proba, diseaseName) => {
    if (proba >= 0.6) {
      return (
        <p className="warning">
          ❗ {diseaseName} 관련 위험이 높습니다. 건강 검진을 권장드립니다. ({(proba * 100).toFixed(2)}%)
        </p>
      );
    } else if (proba >= 0.31) {
      return (
        <p className="medium">
          ⚠️ {diseaseName} 징후가 일부 보입니다. 식습관 개선이 필요할 수 있습니다. ({(proba * 100).toFixed(2)}%)
        </p>
      );
    } else {
      return (
        <p className="safe">
          ✅ {diseaseName} 위험은 낮은 편입니다. 지금처럼 건강 관리 잘 하세요! ({(proba * 100).toFixed(2)}%)
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
