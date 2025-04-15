import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function FooterSection() {
  return (
    <footer className={styles.footerSection}>
      <h3 className={styles.footerTitle}>어떤 결과를 얻을 수 있나요?</h3>
      <div className={styles.footerContent}>
        <div className={styles.footerItem}>
          <span className={styles.footerIcon}>🍽️</span>
          <p>칼로리 및 영양소 분석</p>
        </div>
        <div className={styles.footerItem}>
          <span className={styles.footerIcon}>📊</span>
          <p>식단 균형 점수</p>
        </div>
        <div className={styles.footerItem}>
          <span className={styles.footerIcon}>💡</span>
          <p>개선 제안</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;