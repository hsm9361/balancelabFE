import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/css/pages/DietAnalysis.module.css';

const NextMealSuggestion = ({ nextMealSuggestion }) => {
  console.log('NextMealSuggestion props:', nextMealSuggestion); // 디버깅

  return (
    <div className={styles.card}>
      <h2 className={styles.sectionTitle}>다음 식사 제안</h2>
      {Array.isArray(nextMealSuggestion) && nextMealSuggestion.length > 0 ? (
        <ul className={styles.suggestionList}>
          {nextMealSuggestion.map((meal, index) => (
            <li key={index} className={styles.suggestionItem}>
              {meal}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.placeholder}>제안된 식사가 없습니다.</p>
      )}
    </div>
  );
};

NextMealSuggestion.propTypes = {
  nextMealSuggestion: PropTypes.arrayOf(PropTypes.string),
};

NextMealSuggestion.defaultProps = {
  nextMealSuggestion: [],
};

export default NextMealSuggestion;