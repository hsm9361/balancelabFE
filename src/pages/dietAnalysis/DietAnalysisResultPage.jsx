import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisResultPage.module.css';

function DietAnalysisResultPage() {
  const location = useLocation();
  const { message, analysisResult } = location.state || { message: null, analysisResult: null };
  
  useEffect(() => {
    console.log('Diet analysis result updated:', analysisResult);
  }, [analysisResult]); // analysisResult가 바뀔 때마다 로그 찍기

  // nutrition 변수는 필요하면 유지
  const nutrition = analysisResult?.nutrition;

  console.log('프론트엔드 location.state:', location.state);
  console.log('프론트엔드 analysisResult:', analysisResult); // 여기서 데이터 확인!

  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.title}>식단 분석 결과</h1>
      <div className={styles.content}>
        <div className={styles.resultText}>
          <p>입력하신 식단: "{message || '데이터 없음'}"</p>

          {/* 음식 리스트 */}
          <p>추출된 음식: {
            analysisResult?.food_list && analysisResult.food_list.length > 0
              ? analysisResult.food_list.join(', ')
              : '없음'
          }</p>

          <h3>영양소 분석 (한 끼 기준):</h3>
          {nutrition ? (
            <table>
              {/* thead, tbody는 동일 */}
              <thead>
                <tr>
                  <th>단백질(g)</th>
                  <th>지방(g)</th>
                  <th>탄수화물(g)</th>
                  <th>식이섬유(g)</th>
                  <th>칼슘(mg)</th>
                  <th>나트륨(mg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{nutrition.protein ?? 0}</td>
                  <td>{nutrition.fat ?? 0}</td>
                  <td>{nutrition.carbohydrate ?? 0}</td>
                  <td>{nutrition.fiber ?? 0}</td>
                  <td>{nutrition.calcium ?? 0}</td>
                  <td>{nutrition.sodium ?? 0}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            '영양소 데이터 없음'
          )}

          {/* 부족한 영양소 */}
          <p>부족한 영양소: {
            Array.isArray(analysisResult?.deficient_nutrients) && analysisResult.deficient_nutrients.length > 0
              ? analysisResult.deficient_nutrients.join(', ')
              : '없음'
          }</p>

          {/* 다음 끼니 제안 */}
          <p>다음 끼니 제안: {
            Array.isArray(analysisResult?.next_meal_suggestion) && analysisResult.next_meal_suggestion.length > 0
              ? analysisResult.next_meal_suggestion.join(', ')
              : '제안 없음'
          }</p>

        </div>
      </div>
    </div>
  );
}

export default DietAnalysisResultPage;