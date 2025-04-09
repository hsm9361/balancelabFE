import React from 'react';
import styles from 'assets/css/pages/DietAnalysisPage.module.css'; // 스타일 추가

function AnalysisInfoSection({ foodInput, handleAnalysis }) {
  return (
    <div className={styles.infoSection}>
      <p className={styles.description}>
        입력한 음식을 분석하여 영양 정보를 제공합니다.
      </p>
      <button
        className={styles.analysisButton}
        onClick={handleAnalysis}
        disabled={!foodInput.trim()}
      >
        분석 시작
      </button>
    </div>
  );
}

export default AnalysisInfoSection;
