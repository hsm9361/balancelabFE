import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/css/pages/DietAnalysis.module.css';

const DeficientNutrients = ({ deficientNutrients }) => {
  console.log('DeficientNutrients props:', deficientNutrients); // 디버깅

  return (
    <div className={styles.card}>
      <h2 className={styles.sectionTitle}>부족한 영양소</h2>
      {Array.isArray(deficientNutrients) && deficientNutrients.length > 0 ? (
        <ul className={styles.suggestionList}>
          {deficientNutrients.map((nutrient, index) => (
            <li key={index} className={styles.suggestionItem}>
              {nutrient}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.placeholder}>부족한 영양소가 없습니다.</p>
      )}
    </div>
  );
};

DeficientNutrients.propTypes = {
  deficientNutrients: PropTypes.arrayOf(PropTypes.string),
};

DeficientNutrients.defaultProps = {
  deficientNutrients: [],
};

export default DeficientNutrients;