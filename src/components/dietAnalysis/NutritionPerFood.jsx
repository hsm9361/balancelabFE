import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/css/pages/DietAnalysis.module.css';

const NutritionPerFood = ({ nutritionPerFood }) => {
  console.log('NutritionPerFood props:', nutritionPerFood);

  return (
    <div className={styles.card}>
      <h2 className={styles.sectionTitle}>영양소 분석</h2>
      {Array.isArray(nutritionPerFood) && nutritionPerFood.length > 0 ? (
        nutritionPerFood.map((item, index) => (
          <div key={index} className={styles.foodNutrition}>
            <h3 className={styles.foodTitle}>{item.food || '알 수 없는 음식'}</h3>
            {item.nutrition ? (
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
                    <td className={styles.value}>{item.nutrition.protein || 0}g</td>
                    <td className={styles.value}>{item.nutrition.carbohydrate || 0}g</td>
                    <td className={styles.value}>{item.nutrition.water || 0}ml</td>
                    <td className={styles.value}>{item.nutrition.sugar || 0}g</td>
                    <td className={styles.value}>{item.nutrition.fat || 0}g</td>
                    <td className={styles.value}>{item.nutrition.fiber || 0}g</td>
                    <td className={styles.value}>{item.nutrition.sodium || 0}mg</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className={styles.placeholder}>영양소 데이터가 없습니다.</p>
            )}
          </div>
        ))
      ) : (
        <p className={styles.placeholder}>영양소 정보가 없습니다.</p>
      )}
    </div>
  );
};

NutritionPerFood.propTypes = {
  nutritionPerFood: PropTypes.arrayOf(
    PropTypes.shape({
      food: PropTypes.string,
      nutrition: PropTypes.shape({
        protein: PropTypes.number,
        carbohydrate: PropTypes.number,
        water: PropTypes.number,
        sugar: PropTypes.number,
        fat: PropTypes.number,
        fiber: PropTypes.number,
        sodium: PropTypes.number,
      }),
    })
  ),
};

NutritionPerFood.defaultProps = {
  nutritionPerFood: [],
};

export default NutritionPerFood;