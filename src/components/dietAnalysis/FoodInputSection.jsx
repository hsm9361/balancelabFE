import React from 'react';
import styles from 'assets/css/pages/DietAnalysisPage.module.css'; // 스타일 추가

function FoodInputSection({ foodInput, setFoodInput }) {
  return (
    <div className={styles.inputSection}>
      <h2 className={styles.title}>먹은 음식을 입력해주세요</h2>
      <textarea
        className={styles.foodInput}
        value={foodInput}
        onChange={(e) => setFoodInput(e.target.value)}
        placeholder="예: 점심에 참치김밥과 국밥을 먹었어"
      />
    </div>
  );
}

export default FoodInputSection;
