import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisPage.module.css';
import FoodInputSection from 'components/dietAnalysis/FoodInputSection';
import dietImage from 'assets/images/diet-placeholder.jpg';
import { useDietAnalysis } from 'hooks/useDietAnalysis';

function DietAnalysisPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { analyzeDiet, loading, error } = useDietAnalysis('testUser');

  const handleAnalysis = async () => {
    if (!message.trim()) {
      alert('음식을 입력해주세요!');
      return;
    }

    try {
      const result = await analyzeDiet(message);
      navigate('/diet-analysis/result', {
        state: {
          message,
          analysisResult: result,
        },
      });
    } catch (err) {
      console.error('Diet analysis failed:', err);
      navigate('/diet-analysis/error', { state: { error: error || '분석에 실패했습니다.' } });
    }
  };

  return (
    <div className={styles.dietAnalysisContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>식단 분석</h1>
        <p className={styles.heroDescription}>
          먹은 음식을 입력하면 AI가 영양 정보를 분석해드립니다.
        </p>
        <div className={styles.imagePlaceholder}>
          <img
            src={dietImage}
            alt="식단 예시 이미지"
            className={styles.placeholderImage}
          />
        </div>
      </div>
      <FoodInputSection
        foodText={message}
        setFoodText={setMessage}
        handleAnalysis={handleAnalysis}
        loading={loading}
      />
      {error && (
        <p className={styles.errorMessage}>
          {typeof error === 'string' ? error : '오류가 발생했습니다.'}
        </p>
      )}
    </div>
  );
}

export default DietAnalysisPage;