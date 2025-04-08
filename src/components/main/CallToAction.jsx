import React from 'react';
import styles from '../../assets/css/pages/Home.module.css';

const CallToAction = ({ navigate }) => {
  return (
    <div className={styles.textContainer}>
      <h1 className={styles.title}>나의 식단을 분석해보세요</h1>
      <p className={styles.description}>
        식단을 등록하면 AI가 필요한 영양소를 제안하고, 건강 위험을 알려줍니다.
      </p>
      <button
        className={styles.analyzeButton}
        onClick={() => navigate('/analysis')}
      >
        지금 식단 등록하기
      </button>
    </div>
  );
};

export default CallToAction;