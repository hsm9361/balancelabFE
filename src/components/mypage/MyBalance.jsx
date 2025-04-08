import React from 'react';
import styles from '../../assets/css/pages/mypage/mypage.module.css';

function MyBalance() {
  // 더미 데이터 - 실제 구현 시 API나 상태관리를 통해 데이터 불러올 예정
  const nutritionData = {
    calories: 2100,
    protein: 80,
    carbs: 250,
    fat: 70
  };

  const weeklyIntake = [
    { day: '월', calories: 2000 },
    { day: '화', calories: 2100 },
    { day: '수', calories: 1900 },
    { day: '목', calories: 2200 },
    { day: '금', calories: 2050 },
    { day: '토', calories: 2300 },
    { day: '일', calories: 1800 }
  ];

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>MyBalance</h2>
      
      <div className={styles.balanceContainer}>
        <div className={styles.summarySection}>
          <h3 className={styles.sectionTitle}>영양 섭취 요약</h3>
          <div className={styles.nutritionCards}>
            <div className={styles.nutritionCard}>
              <div className={styles.nutritionIcon}>🔥</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{nutritionData.calories}</div>
                <div className={styles.nutritionLabel}>칼로리</div>
              </div>
            </div>
            <div className={styles.nutritionCard}>
              <div className={styles.nutritionIcon}>🥩</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{nutritionData.protein}g</div>
                <div className={styles.nutritionLabel}>단백질</div>
              </div>
            </div>
            <div className={styles.nutritionCard}>
              <div className={styles.nutritionIcon}>🍚</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{nutritionData.carbs}g</div>
                <div className={styles.nutritionLabel}>탄수화물</div>
              </div>
            </div>
            <div className={styles.nutritionCard}>
              <div className={styles.nutritionIcon}>🥑</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{nutritionData.fat}g</div>
                <div className={styles.nutritionLabel}>지방</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.chartSection}>
          <h3 className={styles.sectionTitle}>주간 칼로리 섭취</h3>
          <div className={styles.barChart}>
            {weeklyIntake.map((item, index) => (
              <div key={index} className={styles.barContainer}>
                <div 
                  className={styles.bar} 
                  style={{ height: `${(item.calories / 2500) * 100}%` }}
                ></div>
                <div className={styles.barLabel}>{item.day}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>최근 기록</h3>
          <div className={styles.historyList}>
            <div className={styles.historyItem}>
              <div className={styles.historyDate}>4월 8일</div>
              <div className={styles.historyMeal}>아침</div>
              <div className={styles.historyCalories}>542 kcal</div>
            </div>
            <div className={styles.historyItem}>
              <div className={styles.historyDate}>4월 8일</div>
              <div className={styles.historyMeal}>점심</div>
              <div className={styles.historyCalories}>780 kcal</div>
            </div>
            <div className={styles.historyItem}>
              <div className={styles.historyDate}>4월 7일</div>
              <div className={styles.historyMeal}>저녁</div>
              <div className={styles.historyCalories}>650 kcal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBalance;