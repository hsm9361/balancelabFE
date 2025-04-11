import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisResultPage.module.css';

function DietAnalysisResultPage() {
  const location = useLocation();
  const { message, analysisResult } = location.state || { message: null, analysisResult: null };

  useEffect(() => {
    console.log('Diet analysis result updated:', analysisResult);
  }, [analysisResult]);

  console.log('프론트엔드 location.state:', location.state);
  console.log('프론트엔드 analysisResult:', analysisResult);

  const nutrition = analysisResult?.nutrition;

  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.title}>식단 분석 결과</h1>
      <div className={styles.content}>
        {/* 섹션 1: 입력 및 추출 정보 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>입력 정보</h2>
          <div className={styles.card}>
            <p className={styles.label}>입력하신 식단</p>
            <p className={styles.value}>"{message || '데이터 없음'}"</p>
            <p className={styles.label}>추출된 음식</p>
            <p className={styles.value}>
              {analysisResult?.food_list && analysisResult.food_list.length > 0
                ? analysisResult.food_list.join(', ')
                : '없음'}
            </p>
          </div>
        </section>

        {/* 섹션 2: 영양소 분석 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>영양소 분석 (한 끼 기준)</h2>
          <div className={styles.card}>
            {nutrition ? (
              <table className={styles.nutritionTable}>
                <thead>
                  <tr>
                    <th>단백질(g)</th>
                    <th>탄수화물(g)</th>
                    <th>수분(ml)</th>
                    <th>당류(g)</th>
                    <th>지방(g)</th>
                    <th>식이섬유(g)</th>
                    <th>나트륨(mg)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{nutrition.protein ?? 0}</td>
                    <td>{nutrition.carbohydrate ?? 0}</td>
                    <td>{nutrition.water ?? 0}</td>
                    <td>{nutrition.sugar ?? 0}</td>
                    <td>{nutrition.fat ?? 0}</td>
                    <td>{nutrition.fiber ?? 0}</td>
                    <td>{nutrition.sodium ?? 0}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className={styles.placeholder}>영양소 데이터 없음</p>
            )}
          </div>
        </section>

        {/* 섹션 3: 부족한 영양소 및 제안 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>영양 상태 및 제안</h2>
          <div className={styles.card}>
            <p className={styles.label}>부족한 영양소</p>
            <p className={styles.value}>
              {Array.isArray(analysisResult?.deficient_nutrients) && analysisResult.deficient_nutrients.length > 0
                ? analysisResult.deficient_nutrients.join(', ')
                : '없음'}
            </p>
            <p className={styles.label}>다음 식단 제안</p>
            <p className={styles.value}>
              {Array.isArray(analysisResult?.next_meal_suggestion) && analysisResult.next_meal_suggestion.length > 0
                ? analysisResult.next_meal_suggestion.join(', ')
                : '제안 없음'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DietAnalysisResultPage;