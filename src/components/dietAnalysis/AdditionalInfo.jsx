import React from 'react';
import styles from 'assets/css/pages/DietAnalysisPage.module.css'; // 스타일 추가

function AdditionalInfo({ nutritionData }) {
  return (
    <div className={styles.additionalInfo}>
      <h3>추천 정보</h3>
      <ul>
        <li>균형 잡힌 식단을 유지하려면 다양한 음식을 섭취하는 것이 중요합니다.</li>
        <li>칼로리와 영양소의 균형을 고려하여 식사 계획을 세워보세요.</li>
        {/* 필요한 추가 정보를 이곳에 추가할 수 있습니다. */}
      </ul>
    </div>
  );
}

export default AdditionalInfo;
