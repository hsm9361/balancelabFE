// src/components/imageAnalysis/NutritionTable.jsx
import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisResultPage.module.css';

function NutritionTable({ nutritionData }) {
  return (
    <section className={styles.tableSection}>
      <h2 className={styles.sectionTitle}>영양 정보</h2>
      {Array.isArray(nutritionData) && nutritionData.length > 0 ? (
        <table className={styles.nutritionTable}>
          <thead>
            <tr>
              <th>음식</th>
              <th>칼로리</th>
              <th>단백질</th>
              <th>지방</th>
              <th>탄수화물</th>
            </tr>
          </thead>
          <tbody>
            {nutritionData.map((item, index) => (
              <tr key={index} className={styles.tableRow}>
                <td>{item.name}</td>
                <td>{item.calories} kcal</td>
                <td>{item.protein} g</td>
                <td>{item.fat} g</td>
                <td>{item.carbs} g</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.placeholder}>검출된 음식이 없습니다.</p>
      )}
    </section>
  );
}

export default NutritionTable; // 추가 또는 확인