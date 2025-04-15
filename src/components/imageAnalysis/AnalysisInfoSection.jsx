import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function AnalysisInfoSection({ selectedImage, handleAnalysis }) {
  return (
    <div className={styles.infoSection}>
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