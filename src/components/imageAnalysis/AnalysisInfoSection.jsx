import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function AnalysisInfoSection({ selectedImage, handleAnalysis }) {
  return (
    <div className={styles.infoSection}>
      <h2 className={styles.title}>오늘의 한 끼 분석</h2>
      <p className={styles.description}>
        음식 사진 전체를 찍어 업로드하면 AI가 분석을 시작합니다.
      </p>
      <button
        className={styles.analysisButton}
        onClick={handleAnalysis}
        disabled={!selectedImage}
      >
        분석 시작
      </button>
    </div>
  );
}

export default AnalysisInfoSection;