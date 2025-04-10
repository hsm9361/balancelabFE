import React from 'react';
import styles from 'assets/css/pages/DietAnalysisPage.module.css'; // 스타일 추가

function NutritionTable({ nutritionData }) {
  return (
    <div className={styles.nutritionTable}>
      <table>
        <thead>
          <tr>
            <th>영양 성분</th>
            <th>수치</th>
          </tr>
        </thead>
        <tbody>
          {nutritionData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NutritionTable;
