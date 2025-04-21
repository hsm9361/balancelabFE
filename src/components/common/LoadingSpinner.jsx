import React from 'react';
import styles from 'assets/css/components/LoadingSpinner.module.css';

function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.spinnerText}>분석 중...</p>
    </div>
  );
}

export default LoadingSpinner;