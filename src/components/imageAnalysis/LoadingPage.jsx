import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from 'assets/css/common/LoadingPage.module.css';

function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageFile } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/analysis/result', {
        state: { analysisData: { message: '분석 완료 (예시)' } },
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.loadingContainer}>
      <h2>분석 중...</h2>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default LoadingPage;