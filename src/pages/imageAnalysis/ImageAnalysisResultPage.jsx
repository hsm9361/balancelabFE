import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from 'assets/css/pages/ImageAnalysisResultPage.module.css';

function ImageAnalysisResultPage() {
  const location = useLocation();
  const { analysisData } = location.state || {};

  return (
    <div className={styles.resultContainer}>
      <h2>분석 결과</h2>
      <p>{analysisData?.message || '결과 데이터가 없습니다.'}</p>
    </div>
  );
}

export default ImageAnalysisResultPage;