import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisPage.module.css';
import FoodInputSection from 'components/dietAnalysis/FoodInputSection';
import dietImage from 'assets/images/diet-placeholder.jpg';

function DietAnalysisPage() {
  const [foodText, setFoodText] = useState('');
  const navigate = useNavigate();

  const handleAnalysis = () => {
    if (foodText.trim()) {
      navigate('/diet-analysis/loading', {
        state: { foodText },
      });
    }
  };

  return (
    <div className={styles.dietAnalysisContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>식단 분석</h1>
        <p className={styles.heroDescription}>
          아래에 먹은 음식을 입력하면 AI가 영양 정보를 분석합니다.
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
        foodText={foodText}
        setFoodText={setFoodText}
        handleAnalysis={handleAnalysis}
      />
    </div>
  );
}

export default DietAnalysisPage;