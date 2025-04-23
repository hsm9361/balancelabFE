import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate for navigation
import styles from 'assets/css/pages/mypage/mypage.module.css';
import axios from 'axios';

function MyBalance() {
  const [clickedRecordIndex, setClickedRecordIndex] = useState(null); // Track clicked record
  const navigate = useNavigate(); // For navigation
  const handleRecordClick = (index) => {
    // Toggle the button visibility: show if clicked, hide if clicked again
    setClickedRecordIndex(clickedRecordIndex === index ? null : index);
  };

  const handleCalendarNavigate = (date) => {
    // date는 이미 Date 객체이므로 문자열로 변환할 필요가 없습니다.
    console.log('Navigating with date:', date);
    navigate('/calendar', {
      state: { selectedDate: date }, // Date 객체 그대로 전달
    });
    setClickedRecordIndex(null); // 말풍선 버튼 숨김
  };

  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein: 0,
    carbo: 0,
    fat: 0,
  });
  const [weeklyIntake, setWeeklyIntake] = useState([]); // 초기 주간 데이터
  const [recentRecords, setRecentRecords] = useState([]);
  const [goalNutrition, setGoalNutrition] = useState({
    goalCalories: null,
    goalProtein: null,
    goalCarbo: null,
    goalFat: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNutrient, setSelectedNutrient] = useState('calories');
  const [cachedSummaries, setCachedSummaries] = useState([]); // 데이터 캐싱용 상태

  const token = localStorage.getItem('accessToken');

  // 주간 데이터 초기화 함수
  const initializeWeeklyData = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return Array(7)
      .fill(0)
      .map((_, i) => ({
        day: days[(new Date().getDay() - i + 7) % 7],
        value: 0,
      }))
      .reverse();
  };

  useEffect(() => {
    if (!token) {
      setError('로그인이 필요합니다.');
      setWeeklyIntake(initializeWeeklyData()); // 빈 주간 데이터 설정
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 백엔드 서버의 기본 URL 설정 (필요에 따라 수정)
        axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 포트 확인 후 수정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Cache-Control'] = 'no-cache';

        // 목표 영양소 가져오기
        let goalData = { goalCalories: null, goalProtein: null, goalCarbo: null, goalFat: null };
        try {
          console.log('Fetching goal data...');
          const goalResponse = await axios.get('/member/goal');
          console.log('Goal Response:', goalResponse.data);
          goalData = goalResponse.data || goalData;
        } catch (goalError) {
          console.warn('Goal data fetch failed:', {
            message: goalError.message,
            status: goalError.response?.status,
            data: goalError.response?.data,
          });
          if (goalError.response?.status === 404) {
            console.log('No goal data found, using default values.');
          } else {
            throw goalError; // 다른 에러는 상위 catch로 전달
          }
        }
        console.log('Setting goalNutrition:', goalData);
        setGoalNutrition(goalData);

        // 영양 요약 데이터 가져오기
        let summaries = [];
        try {
          console.log('Fetching nutrition summary...');
          const summaryResponse = await axios.get('/food-record/nutrition-summary');
          console.log('Summary Response:', summaryResponse.data);
          summaries = Array.isArray(summaryResponse.data) ? summaryResponse.data : [];
        } catch (summaryError) {
          console.warn('Nutrition summary fetch failed:', {
            message: summaryError.message,
            status: summaryError.response?.status,
            data: summaryError.response?.data,
          });
          if (summaryError.response?.status === 404) {
            console.log('No nutrition summary found, using empty array.');
          } else {
            throw summaryError; // 다른 에러는 상위 catch로 전달
          }
        }
        setCachedSummaries(summaries);

        // 영양 섭취 요약 계산
        const summary = summaries.reduce(
          (acc, record) => ({
            calories: acc.calories + (record?.sumCalories || 0),
            protein: acc.protein + (record?.sumProtein || 0),
            carbo: acc.carbo + (record?.sumCarbohydrates || 0),
            fat: acc.fat + (record?.sumFat || 0),
          }),
          { calories: 0, protein: 0, carbo: 0, fat: 0 }
        );
        setNutritionData(summary);

        // 최근 기록 설정
        setRecentRecords(summaries.slice(0, 3));

        // 주간 데이터 설정
        const weeklyData = aggregateWeeklyData(summaries, selectedNutrient);
        setWeeklyIntake(weeklyData);
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
        } else {
          setGoalNutrition({
            goalCalories: null,
            goalProtein: null,
            goalCarbo: null,
            goalFat: null,
          });
          setCachedSummaries([]);
          setNutritionData({ calories: 0, protein: 0, carbo: 0, fat: 0 });
          setRecentRecords([]);
          setWeeklyIntake(initializeWeeklyData());
          setError(
            error.response?.status === 404
              ? '데이터를 찾을 수 없습니다.'
              : error.response?.data?.message || '데이터를 불러오지 못했습니다.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // selectedNutrient 변경 시 캐싱된 데이터로 주간 데이터 재집계
  useEffect(() => {
    const weeklyData = aggregateWeeklyData(cachedSummaries, selectedNutrient);
    setWeeklyIntake(weeklyData);
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
    const goalValue = getGoalValue();
    const dataMax = Math.max(
      ...weeklyIntake.map((item) => item.value),
      defaultMax,
      goalValue != null ? goalValue : 0
    );
    return dataMax * 1.1;
  };

  // 동적 targetLabel 생성 함수
  const getTargetLabel = () => {
    const goalValue = getGoalValue();
    const nutrientLabel = getNutrientLabel();
    const unit = getUnit();

    // goalValue가 null 또는 undefined일 경우
    if (goalValue == null) {
      return `챌린지를 시작하고 목표 ${nutrientLabel}를 설정해 보세요!`;
    }

    // 정상적인 경우
    return `목표: ${Math.round(goalValue)} ${unit}`;
  };

  if (error) {
    return (
      <div className={styles.tabContent}>
        <div className={styles.error}>
          {error}
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
        <div className={styles.balanceContainer}>
          <div className={styles.summarySection}>
            <h3 className={styles.sectionTitle}>영양 섭취 요약</h3>
            <p>영양 섭취 데이터가 없습니다.</p>
          </div>
          <div className={styles.chartSection}>
            <h3 className={styles.sectionTitle}>주간 {getNutrientLabel()} 섭취</h3>
            <p>주간 섭취 데이터가 없습니다.</p>
          </div>
          <div className={styles.historySection}>
            <h3 className={styles.sectionTitle}>최근 기록</h3>
            <p>최근 기록이 없습니다.</p>
          </div>
        </div>
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
          <h5 className={styles.sectionTitle2}>최근 7일 영양소 평균</h5>
          {nutritionData.calories === 0 &&
          nutritionData.protein === 0 &&
          nutritionData.carbo === 0 &&
          nutritionData.fat === 0 ? (
            <p>영양 섭취 데이터가 없습니다.</p>
          ) : (
            <div className={styles.nutritionCards}>
              <div
                className={`${styles.nutritionCard} ${selectedNutrient === 'calories' ? styles.active : ''}`}
                onClick={() => setSelectedNutrient('calories')}
              >
                <div className={styles.nutritionIcon}>🔥</div>
                <div className={styles.nutritionInfo}>
                  <div className={styles.nutritionValue}>{Math.round(nutritionData.calories/7*100)/100}kcal</div>
                  <div className={styles.nutritionLabel}>
                    열량 (목표: {Math.round(goalNutrition.goalCalories || 0)}kcal)
                  </div>
                </div>
              </div>
              <div
                className={`${styles.nutritionCard} ${selectedNutrient === 'protein' ? styles.active : ''}`}
                onClick={() => setSelectedNutrient('protein')}
              >
                <div className={styles.nutritionIcon}>🥩</div>
                <div className={styles.nutritionInfo}>
                  <div className={styles.nutritionValue}>{Math.round(nutritionData.protein/7*100)/100}g</div>
                  <div className={styles.nutritionLabel}>
                    단백질 (목표: {Math.round(goalNutrition.goalProtein || 0)}g)
                  </div>
                </div>
              </div>
              <div
                className={`${styles.nutritionCard} ${selectedNutrient === 'carbo' ? styles.active : ''}`}
                onClick={() => setSelectedNutrient('carbo')}
              >
                <div className={styles.nutritionIcon}>🍚</div>
                <div className={styles.nutritionInfo}>
                  <div className={styles.nutritionValue}>{Math.round(nutritionData.carbo/7*100)/100}g</div>
                  <div className={styles.nutritionLabel}>
                    탄수화물 (목표: {Math.round(goalNutrition.goalCarbo || 0)}g)
                  </div>
                </div>
              </div>
              <div
                className={`${styles.nutritionCard} ${selectedNutrient === 'fat' ? styles.active : ''}`}
                onClick={() => setSelectedNutrient('fat')}
              >
                <div className={styles.nutritionIcon}>🥑</div>
                <div className={styles.nutritionInfo}>
                  <div className={styles.nutritionValue}>{Math.round(nutritionData.fat/7*100)/100}g</div>
                  <div className={styles.nutritionLabel}>
                    지방 (목표: {Math.round(goalNutrition.goalFat || 0)}g)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.chartSection}>
          <h3 className={styles.sectionTitle}>주간 {getNutrientLabel()} 섭취</h3>
          {weeklyIntake.every((item) => item.value === 0) ? (
            <p>주간 섭취 데이터가 없습니다.</p>
          ) : (
            <div className={styles.barChart}>
              <div
                className={styles.targetLine}
                style={{
                  bottom: `${
                    getGoalValue() != null ? Math.min((getGoalValue() / getMaxValue()) * 100, 100) : 0
                  }%`,
                }}
              >
                <span className={styles.targetLabel}>{getTargetLabel()}</span>
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
          )}
        </div>
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>최근 기록</h3>
          {recentRecords.length === 0 ? (
            <p>최근 기록이 없습니다.</p>
          ) : (
            <div className={styles.historyList}>
              <div className={styles.historyHeader}>
                <div className={styles.historyDate}>날짜</div>
                <div className={styles.historyNutrient}>칼로리</div>
                <div className={styles.historyNutrient}>탄수화물</div>
                <div className={styles.historyNutrient}>단백질</div>
                <div className={styles.historyNutrient}>지방</div>
              </div>
              {recentRecords.map((record, index) => (
                <div
                  key={index}
                  className={styles.historyItem}
                  onClick={() => handleRecordClick(index)}
                  style={{ position: 'relative' }} // For positioning the speech bubble
                >
                  <div className={styles.historyDate}>
                    {new Date(record.consumedDate).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className={styles.historyNutrient}>{Math.round(record.sumCalories || 0)} kcal</div>
                  <div className={styles.historyNutrient}>{Math.round(record.sumCarbohydrates || 0)} g</div>
                  <div className={styles.historyNutrient}>{Math.round(record.sumProtein || 0)} g</div>
                  <div className={styles.historyNutrient}>{Math.round(record.sumFat || 0)} g</div>
                  {clickedRecordIndex === index && (
                    <button
                      className={styles.speechBubbleButton}
                      onClick={() => handleCalendarNavigate(record.consumedDate)}
                    >
                      캘린더로 이동
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBalance;