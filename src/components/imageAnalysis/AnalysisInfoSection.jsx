import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function AnalysisInfoSection({ selectedImage, handleAnalysis, disabled }) {
  return (
    <section className={styles.infoSection}>
      <button
        className={styles.analysisButton}
        onClick={handleAnalysis}
        disabled={!selectedImage || disabled} // 이미지 없거나 로딩 중 비활성화
      >
        분석 시작
      </button>
    </section>
  );
}


export default AnalysisInfoSection;