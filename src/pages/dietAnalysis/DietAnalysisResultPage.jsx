import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisResultPage.module.css';
import NutritionTable from 'components/imageAnalysis/NutritionTable';
import AdditionalInfo from 'components/imageAnalysis/AdditionalInfo';

function DietAnalysisResultPage() {
  const location = useLocation();
  const foodText = location.state?.foodText || '';

  // 더미 데이터: FastAPI + LLM으로 대체 예정
  const dummyFoodItems = foodText
    ? ['김치볶음밥', '된장국', '계란후라이']
    : [];

  const nutritionData = dummyFoodItems.map((name, index) => ({
    id: index + 1,
    name,
    calories: Math.round(Math.random() * 300 + 100),
    protein: Math.round(Math.random() * 20 + 5),
    carbs: Math.round(Math.random() * 50 + 10),
    fat: Math.round(Math.random() * 15 + 5),
  }));

  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.title}>분석 결과</h1>
      <div className={styles.content}>
        <div className={styles.resultText}>
          입력: "{foodText || '없음'}"<br />
          아래는 식단의 영양 분석입니다.
        </div>
        {nutritionData.length > 0 ? (
          <>
            <NutritionTable nutritionData={nutritionData} />
            <AdditionalInfo nutritionData={nutritionData} />
          </>
        ) : (
          <div className={styles.placeholder}>
            분석할 식단이 입력되지 않았습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default DietAnalysisResultPage;