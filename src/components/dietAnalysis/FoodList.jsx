import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/css/pages/DietAnalysis.module.css';

const FoodList = ({ foodList }) => {
  console.log('FoodList props:', foodList); // 디버깅

  return (
    <div className={styles.card}>
      <h2 className={styles.sectionTitle}>먹은 음식</h2>
      {Array.isArray(foodList) && foodList.length > 0 ? (
        <ul className={styles.suggestionList}>
          {foodList.map((food, index) => (
            <li key={index} className={styles.suggestionItem}>
              {food}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.placeholder}>음식 정보가 없습니다.</p>
      )}
    </div>
  );
};

FoodList.propTypes = {
  foodList: PropTypes.arrayOf(PropTypes.string),
};

FoodList.defaultProps = {
  foodList: [],
};

export default FoodList;