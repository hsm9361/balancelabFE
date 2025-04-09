import React from 'react';

function HealthPredictionResults({ predictions }) {
  return (
    <div className="prediction-results">
      <h3>✅ 예측 결과</h3>
      <div className="result-item">
        <p>🔸 <strong>당뇨 확률:</strong> {(predictions.diabetes * 100).toFixed(2)}%</p>
        {predictions.diabetes >= 0.75 ? (
          <p className="warning">⚠️ 당뇨 가능성이 높습니다.</p>
        ) : (
          <p className="safe">✅ 당뇨 가능성은 낮습니다.</p>
        )}
      </div>

      <div className="result-item">
        <p>🔸 <strong>고혈압 확률:</strong> {(predictions.hypertension * 100).toFixed(2)}%</p>
        {predictions.hypertension >= 0.75 ? (
          <p className="warning">⚠️ 고혈압 가능성이 높습니다.</p>
        ) : (
          <p className="safe">✅ 고혈압 가능성은 낮습니다.</p>
        )}
      </div>

      <div className="result-item">
        <p>🔸 <strong>심혈관질환 확률:</strong> {(predictions.cardiovascular * 100).toFixed(2)}%</p>
        {predictions.cardiovascular >= 0.75 ? (
          <p className="warning">⚠️ 심혈관질환 가능성이 높습니다.</p>
        ) : (
          <p className="safe">✅ 심혈관질환 가능성은 낮습니다.</p>
        )}
      </div>
    </div>
  );
}

export default HealthPredictionResults; 