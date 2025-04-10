import React, { useState } from 'react';
import styles from 'assets/css/pages/DietAnalysisPage.module.css';

function DietAnalysisInfoSection({ foodText, handleAnalysis }) {
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = !foodText.trim() || isLoading;

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      handleAnalysis();
      setIsLoading(false);
    }, 800); // 부드러운 전환을 위해 짧은 딜레이
  };

  return (
    <div className={styles.infoSection}>
      <h2 className={styles.title}>식단 분석</h2>
      <p className={styles.description}>
        먹은 음식을 간단히 입력하면 AI가 영양 정보를 분석해드립니다.
      </p>
      <button
        className={`${styles.analysisButton} ${isLoading ? styles.loading : ''}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {isLoading ? (
          <span className={styles.spinner}></span>
        ) : (
          '분석 시작'
        )}
      </button>
    </div>
  );
}

export default DietAnalysisInfoSection;