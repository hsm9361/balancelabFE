import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/css/pages/DietAnalysis.module.css';

const TotalNutrition = ({ totalNutrition }) => {
  console.log('TotalNutrition props:', totalNutrition);

  return (
    <div className={styles.card}>
      <h2 className={styles.sectionTitle}>총 영양소</h2>
      {totalNutrition && typeof totalNutrition === 'object' && Object.keys(totalNutrition).length > 0 ? (
        <table className={`${styles.nutritionTable} ${styles.horizontalTable}`}>
          <thead>
            <tr>
              <th>단백질</th>
              <th>탄수화물</th>
              <th>수분</th>
              <th>당</th>
              <th>지방</th>
              <th>식이섬유</th>
              <th>나트륨</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.value}>{totalNutrition.protein || 0}g</td>
              <td className={styles.value}>{totalNutrition.carbohydrate || 0}g</td>
              <td className={styles.value}>{totalNutrition.water || 0}ml</td>
              <td className={styles.value}>{totalNutrition.sugar || 0}g</td>
              <td className={styles.value}>{totalNutrition.fat || 0}g</td>
              <td className={styles.value}>{totalNutrition.fiber || 0}g</td>
              <td className={styles.value}>{totalNutrition.sodium || 0}mg</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className={styles.placeholder}>총 영양소 정보가 없습니다.</p>
      )}
    </div>
  );
};

TotalNutrition.propTypes = {
  totalNutrition: PropTypes.shape({
    protein: PropTypes.number,
    carbohydrate: PropTypes.number,
    water: PropTypes.number,
    sugar: PropTypes.number,
    fat: PropTypes.number,
    fiber: PropTypes.number,
    sodium: PropTypes.number,
  }),
};

TotalNutrition.defaultProps = {
  totalNutrition: {},
};

export default TotalNutrition;