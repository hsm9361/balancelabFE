import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisResultPage.module.css'; // 스타일 임포트
import foodPlate1 from 'assets/images/food-plate1.jpg';

function DietAnalysisResultPage() {
  const location = useLocation();
  
  // 분석 데이터가 있을 때만 결과를 표시하도록 처리
  const analysisData = location.state?.analysisData || { resultText: "분석할 수 없는 데이터입니다." };
  const resultText = analysisData.resultText || "오늘 먹은 음식의 분석이 완료되었습니다!";

  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.title}>식단 분석 결과</h1>
      
      {/* 결과 텍스트를 통으로 보여주기 */}
      <div className={styles.resultContent}>
        <img src={foodPlate1} alt="Food Plate" className={styles.foodImage} />
        <p className={styles.resultText}>{resultText}</p>
      </div>
    </div>
  );
}

export default DietAnalysisResultPage;
