import React, { useState } from 'react';
import styles from 'assets/css/pages/DietAnalysisPage.module.css';

function FoodInputSection({ foodText, setFoodText, handleAnalysis, loading }) {
  const [isLocalLoading, setIsLocalLoading] = useState(false); // 로컬 로딩 상태
  const isDisabled = !foodText.trim() || loading || isLocalLoading;

  const handleClick = async () => {
    setIsLocalLoading(true);
    await handleAnalysis();
    setIsLocalLoading(false);
  };

  const handleInputChange = (e) => {
    setFoodText(e.target.value);
  };

  return (
    <div className={styles.inputSection}>
      <textarea
        className={styles.textArea}
        value={foodText}
        onChange={handleInputChange}
        placeholder="예: 점심에 김밥이랑 떡볶이랑 아이스아메리카노 먹었어."
        rows="3"
        disabled={loading} // 로딩 중 입력 비활성화
      />
      <button
        className={`${styles.analysisButton} ${loading || isLocalLoading ? styles.loading : ''}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {loading || isLocalLoading ? (
          <span className={styles.spinner}></span>
        ) : (
          '분석 시작'
        )}
      </button>
    </div>
  );
}

export default FoodInputSection;