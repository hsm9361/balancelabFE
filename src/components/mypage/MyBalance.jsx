import React, { useEffect, useState, useMemo } from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import axios from 'axios';

function MyBalance() {
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein: 0,
    carbo: 0,
    fat: 0,
  });
  const [weeklyIntake, setWeeklyIntake] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [goalNutrition, setGoalNutrition] = useState({
    goalCalories: 0,
    goalProtein: 0,
    goalFat: 0,
    goalCarbo: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNutrient, setSelectedNutrient] = useState('calories');
  const [cachedSummaries, setCachedSummaries] = useState([]); // 데이터 캐싱용 상태

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Cache-Control'] = 'no-cache';

        // 목표 영양소 가져오기
        const goalResponse = await axios.get('/member/goal');
        setGoalNutrition(goalResponse.data);

        // 영양 요약 데이터 가져오기
        const summaryResponse = await axios.get('/food-record/nutrition-summary');
        const summaries = summaryResponse.data;

        // 캐싱
        setCachedSummaries(summaries);

        // 영양 섭취 요약 계산
        const summary = summaries.reduce(
          (acc, record) => ({
            calories: acc.calories + (record.sumCalories || 0),
            protein: acc.protein + (record.sumProtein || 0),
            carbo: acc.carbo + (record.sumCarbohydrates || 0),
            fat: acc.fat + (record.sumFat || 0),
          }),
          { calories: 0, protein: 0, carbo: 0, fat: 0 }
        );
        setNutritionData(summary);

        // 최근 기록 설정
        setRecentRecords(summaries.slice(0, 3));
      } catch (error) {
        console.error('데이터 가져오기 오류:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 401) {
          setError('로그인이 필요합니다.');
          localStorage.setItem('redirectPath', window.location.pathname);
          window.location.href = '/login';
        } else if (error.response?.status === 404) {
          setError('데이터를 찾을 수 없습니다.');
        } else {
          setError(error.response?.data?.message || '데이터를 불러오지 못했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]); // selectedNutrient 제거

  // selectedNutrient 변경 시 캐싱된 데이터로 주간 데이터 재집계
  useEffect(() => {
    if (cachedSummaries.length > 0) {
      const weeklyData = aggregateWeeklyData(cachedSummaries, selectedNutrient);
      setWeeklyIntake(weeklyData);
    }
  }, [selectedNutrient, cachedSummaries]);

  const aggregateWeeklyData = (summaries, nutrient) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    const weekly = Array(7)
      .fill(0)
      .map((_, i) => ({
        day: days[(today.getDay() - i + 7) % 7],
        value: 0,
      }));

    summaries.forEach((record) => {
      const date = new Date(record.consumedDate);
      const dayDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 0 && dayDiff < 7) {
        const nutrientKey = {
          calories: 'sumCalories',
          protein: 'sumProtein',
          carbo: 'sumCarbohydrates',
          fat: 'sumFat',
        }[nutrient];
        weekly[dayDiff].value += record[nutrientKey] || 0;
      }
    });

    return weekly.reverse();
  };

  const getNutrientLabel = () => {
    switch (selectedNutrient) {
      case 'calories':
        return '칼로리';
      case 'protein':
        return '단백질';
      case 'carbo':
        return '탄수화물';
      case 'fat':
        return '지방';
      default:
        return '칼로리';
    }
  };

  const getGoalValue = () => {
    switch (selectedNutrient) {
      case 'calories':
        return goalNutrition.goalCalories;
      case 'protein':
        return goalNutrition.goalProtein;
      case 'carbo':
        return goalNutrition.goalCarbo;
      case 'fat':
        return goalNutrition.goalFat;
      default:
        return goalNutrition.goalCalories;
    }
  };

  const getUnit = () => {
    return selectedNutrient === 'calories' ? 'kcal' : 'g';
  };

  const getMaxValue = () => {
    const defaultMax = selectedNutrient === 'calories' ? 3500 : 200;
    const dataMax = Math.max(...weeklyIntake.map(item => item.value), defaultMax, getGoalValue());
    return dataMax * 1.1;
  };

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>MyBalance</h2>
      <div className={styles.balanceContainer}>
        <div className={styles.summarySection}>
          <h3 className={styles.sectionTitle}>영양 섭취 요약</h3>
          <div className={styles.nutritionCards}>
            <div
              className={`${styles.nutritionCard} ${selectedNutrient === 'calories' ? styles.active : ''}`}
              onClick={() => setSelectedNutrient('calories')}
            >
              <div className={styles.nutritionIcon}>🔥</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{Math.round(nutritionData.calories)}kcal</div>
                <div className={styles.nutritionLabel}>열량 (목표: {Math.round(goalNutrition.goalCalories)}kcal)</div>
              </div>
            </div>
            <div
              className={`${styles.nutritionCard} ${selectedNutrient === 'protein' ? styles.active : ''}`}
              onClick={() => setSelectedNutrient('protein')}
            >
              <div className={styles.nutritionIcon}>🥩</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{Math.round(nutritionData.protein)}g</div>
                <div className={styles.nutritionLabel}>단백질 (목표: {Math.round(goalNutrition.goalProtein)}g)</div>
              </div>
            </div>
            <div
              className={`${styles.nutritionCard} ${selectedNutrient === 'carbo' ? styles.active : ''}`}
              onClick={() => setSelectedNutrient('carbo')}
            >
              <div className={styles.nutritionIcon}>🍚</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{Math.round(nutritionData.carbo)}g</div>
                <div className={styles.nutritionLabel}>탄수화물 (목표: {Math.round(goalNutrition.goalCarbo)}g)</div>
              </div>
            </div>
            <div
              className={`${styles.nutritionCard} ${selectedNutrient === 'fat' ? styles.active : ''}`}
              onClick={() => setSelectedNutrient('fat')}
            >
              <div className={styles.nutritionIcon}>🥑</div>
              <div className={styles.nutritionInfo}>
                <div className={styles.nutritionValue}>{Math.round(nutritionData.fat)}g</div>
                <div className={styles.nutritionLabel}>지방 (목표: {Math.round(goalNutrition.goalFat)}g)</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.chartSection}>
          <h3 className={styles.sectionTitle}>주간 {getNutrientLabel()} 섭취</h3>
          <div className={styles.barChart}>
            <div
              className={styles.targetLine}
              style={{ bottom: `${Math.min((getGoalValue() / getMaxValue()) * 100, 100)}%` }}
            >
              <span className={styles.targetLabel}>목표: {Math.round(getGoalValue())} {getUnit()}</span>
            </div>
            {weeklyIntake.map((item, index) => (
              <div key={index} className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{ height: `${Math.min((item.value / getMaxValue()) * 100, 100)}%` }}
                >
                  <div className={styles.barValue}>
                    {Math.round(item.value)} {getUnit()}
                  </div>
                </div>
                <div className={styles.barLabel}>{item.day}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>최근 기록</h3>
          <div className={styles.historyList}>
            <div className={styles.historyHeader}>
              <div className={styles.historyDate}>날짜</div>
              <div className={styles.historyMeal}>구분</div>
              <div className={styles.historyNutrient}>칼로리</div>
              <div className={styles.historyNutrient}>탄수화물</div>
              <div className={styles.historyNutrient}>단백질</div>
              <div className={styles.historyNutrient}>지방</div>
            </div>
            {recentRecords.map((record, index) => (
              <div key={index} className={styles.historyItem}>
                <div className={styles.historyDate}>
                  {new Date(record.consumedDate).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className={styles.historyMeal}>일일 기록</div>
                <div className={styles.historyNutrient}>{Math.round(record.sumCalories)} kcal</div>
                <div className={styles.historyNutrient}>{Math.round(record.sumCarbohydrates)} g</div>
                <div className={styles.historyNutrient}>{Math.round(record.sumProtein)} g</div>
                <div className={styles.historyNutrient}>{Math.round(record.sumFat)} g</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBalance;