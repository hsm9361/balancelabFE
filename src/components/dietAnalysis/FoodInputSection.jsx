import React from 'react';
import styles from 'assets/css/pages/FoodInputSection.module.css';

function FoodInputSection({ foodText, setFoodText, handleAnalysis, loading, textareaRef }) {
  return (
    <div className={styles.foodInputContainer}>
      <textarea
        ref={textareaRef} // ref 연결
        className={styles.foodTextarea}
        value={foodText}
        onChange={(e) => setFoodText(e.target.value)}
        placeholder="시간대 버튼을 선택한 뒤, 먹은 음식을 적어주세요"
        rows="4"
        disabled={loading}
      />
      <button
        className={styles.analyzeButton}
        onClick={handleAnalysis}
        disabled={loading}
      >
        {loading ? '분석 중...' : '분석하기'}
      </button>
    </div>
  );
}

export default FoodInputSection;
// import React, { useState } from 'react';
// import styles from 'assets/css/pages/DietAnalysisPage.module.css';

// function FoodInputSection({ foodText, setFoodText, handleAnalysis, loading }) {
//   const [isLocalLoading, setIsLocalLoading] = useState(false); // 로컬 로딩 상태
//   const isDisabled = !foodText.trim() || loading || isLocalLoading;

//   const handleClick = async () => {
//     setIsLocalLoading(true);
//     await handleAnalysis();
//     setIsLocalLoading(false);
//   };

//   const handleInputChange = (e) => {
//     setFoodText(e.target.value);
//   };

//   return (
//     <div className={styles.inputSection}>
//       <textarea
//         className={styles.textArea}
//         value={foodText}
//         onChange={handleInputChange}
//         placeholder="예: 점심에 김밥이랑 떡볶이랑 아이스아메리카노 먹었어."
//         rows="3"
//         disabled={loading} // 로딩 중 입력 비활성화
//       />
//       <button
//         className={`${styles.analysisButton} ${loading || isLocalLoading ? styles.loading : ''}`}
//         onClick={handleClick}
//         disabled={isDisabled}
//       >
//         {loading || isLocalLoading ? (
//           <span className={styles.spinner}></span>
//         ) : (
//           '분석 시작'
//         )}
//       </button>
//     </div>
//   );
// }

// export default FoodInputSection;