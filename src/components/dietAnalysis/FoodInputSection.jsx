import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/css/components/FoodInputSection.module.css';

function FoodInputSection({ foodText, setFoodText, handleAnalysis, loading, textareaRef }) {
  return (
    <div className={styles.foodInputContainer}>
      <textarea
        ref={textareaRef}
        className={styles.foodTextarea}
        value={foodText}
        onChange={(e) => setFoodText(e.target.value)}
        placeholder="시간대 버튼을 선택한 뒤, 먹은 음식을 적어주세요"
        rows="4"
        maxLength="500"
        disabled={loading}
      />
      <button
        className={`${styles.analyzeButton} ${loading ? styles.disabled : ''}`}
        onClick={handleAnalysis}
        disabled={loading}
      >
        {loading ? '분석 중...' : '분석하기'}
      </button>
    </div>
  );
}

FoodInputSection.propTypes = {
  foodText: PropTypes.string.isRequired,
  setFoodText: PropTypes.func.isRequired,
  handleAnalysis: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  textareaRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default FoodInputSection;