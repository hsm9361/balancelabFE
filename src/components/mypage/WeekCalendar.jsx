import React, { useState, useEffect, useMemo } from 'react';
import styles from 'assets/css/pages/calendar/weekCalendar.module.css';
import AddDietModal from '../../components/calendar/AddMealModal';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';
import CustomModal from '../../components/common/CustomModal';

const days = ['일', '월', '화', '수', '목', '금', '토'];

const getThisWeekDates = (baseDate) => {
  const sunday = new Date(baseDate);
  sunday.setDate(sunday.getDate() - sunday.getDay());

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d);
  }
  return week;
};

const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    console.error('Invalid date:', date);
    return '';
  }
  return date.toISOString().split('T')[0];
};

const getMealTypeAndTime = (mealTime) => {
  if (!mealTime) {
    return { type: '기타', time: '알 수 없음' };
  }
  const [start] = mealTime.split(' ~ ');
  const hour = parseInt(start.split(':')[0], 10);
  if (hour < 10) {
    return { type: '아침', time: '08:00 ~ 09:30' };
  } else if (hour < 15) {
    return { type: '점심', time: '12:00 ~ 13:30' };
  } else {
    return { type: '저녁', time: '18:00 ~ 19:30' };
  }
};

const formatUnit = (unit) => {
  if (unit === 'serving') return '인분';
  return unit || 'g';
};

export default function WeekCalendar() {
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [mealData, setMealData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [weekDateRange, setWeekDateRange] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const weekDates = useMemo(() => getThisWeekDates(baseDate), [baseDate]);

  useEffect(() => {
    const todayStr = formatDate(new Date());
    const todayIndex = weekDates.findIndex((d) => formatDate(d) === todayStr);
    const initialDay = todayIndex >= 0 ? days[todayIndex] : '월';
    setSelectedDay(initialDay);
  }, [weekDates]);

  useEffect(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    setWeekDateRange(`${start.getMonth() + 1}.${start.getDate()} ~ ${end.getMonth() + 1}.${end.getDate()}`);
  }, [weekDates]);

  useEffect(() => {
    if (!selectedDay || !days.includes(selectedDay)) {
      console.log('유효하지 않은 selectedDay:', selectedDay);
      return;
    }

    const selectedDate = formatDate(weekDates[days.indexOf(selectedDay)]);
    if (!selectedDate) {
      console.error('유효하지 않은 selectedDate:', selectedDate);
      return;
    }

    apiClient
      .get(`/food-record/member/date`, {
        params: {
          date: selectedDate,
        },
      })
      .then((res) => {
        console.log('서버 응답 데이터', res.data);
        const result = { ...mealData, [selectedDay]: [] };
        res.data.forEach((r) => {
          const date = r.consumedDate ? new Date(r.consumedDate) : new Date(selectedDate);
          const { type, time } = getMealTypeAndTime(r.mealTime);
          result[selectedDay].push({
            foodId: r.id,
            type,
            time,
            items: [`${r.foodName} (${r.amount}${formatUnit(r.unit)})`],
            carb: r.carbohydrates || 0,
            protein: r.protein || 0,
            kcal: r.carbohydrates && r.protein && r.fat
              ? Math.round((r.carbohydrates * 4) + (r.protein * 4) + (r.fat * 9))
              : 0,
          });
        });
        console.log('업데이트된 mealData', result);
        setMealData(result);
      })
      .catch((err) => {
        console.error('식단 불러오기 실패:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setModalState({
            isOpen: true,
            title: '인증 오류',
            message: '로그인이 필요합니다.',
            onConfirm: null,
          });
        } else if (err.response?.status === 400) {
          setModalState({
            isOpen: true,
            title: '잘못된 요청',
            message: '잘못된 날짜 형식입니다.',
            onConfirm: null,
          });
        }
      });
  }, [baseDate, selectedDay]);

  const handleWeekChange = (daysToAdd) => {
    const newBaseDate = new Date(baseDate);
    newBaseDate.setDate(baseDate.getDate() + daysToAdd);
    setBaseDate(newBaseDate);
  };

  const handleSubmitMeal = (mealType, foodList) => {
    console.log('Meal submitted:', { mealType, foodList });
    setShowModal(false);
  };

  const handleDeleteMeal = (indexToDelete, foodId) => {
    setModalState({
      isOpen: true,
      title: '식단 삭제',
      message: '이 식단을 삭제하시겠습니까?',
      onConfirm: () => {
        apiClient
          .delete(`/food-record/${foodId}`)
          .then(() => {
            setMealData((prev) => {
              const updatedMeals = [...(prev[selectedDay] || [])];
              updatedMeals.splice(indexToDelete, 1);
              return {
                ...prev,
                [selectedDay]: updatedMeals,
              };
            });
            setModalState({
              isOpen: true,
              title: '삭제 완료',
              message: '식단이 성공적으로 삭제되었습니다.',
              onConfirm: null,
            });
          })
          .catch((err) => {
            console.error('삭제 실패:', err);
            setModalState({
              isOpen: true,
              title: '삭제 실패',
              message: '식단 삭제에 실패했습니다.',
              onConfirm: null,
            });
          });
      },
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  const meals = mealData[selectedDay] || [];

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>주간 식단표</h2>

      <div className={styles.weekNavContainer}>
        <button
          onClick={() => handleWeekChange(-7)}
          className={styles.weekNavButton}
        >
          ◀ 이전 주
        </button>
        <span className={styles.weekRangeText}>이번 주: {weekDateRange}</span>
        <button
          onClick={() => handleWeekChange(7)}
          className={styles.weekNavButton}
        >
          다음 주 ▶
        </button>
      </div>

      <div className={styles.daySelector}>
        {days.map((day, idx) => {
          const date = weekDates[idx];
          const label = `${day} (${date.getMonth() + 1}.${date.getDate()})`;
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              className={`${styles.weekDayButton} ${isActive ? styles.weekDayButtonActive : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={baseDate.toISOString() + selectedDay}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className={styles.mealCards}
        >
          {meals.length > 0 ? (
            meals.map((meal, idx) => (
              <div key={idx} className={styles.mealCard}>
                <div className={styles.weekMealTime}>
                  <div>
                    <span className={styles.mealLabel}>{meal.type}</span>
                    <span className={styles.weekMealTimeRange}>{meal.time}</span>
                  </div>
                  <button
                    onClick={() => {
                      console.log('삭제요청', meal.foodId, meal);
                      handleDeleteMeal(idx, meal.foodId);
                    }}
                    className={styles.weekDeleteButton}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.mealContents}>{meal.items.join(', ')}</div>
              </div>
            ))
          ) : (
            <p className={styles.noEvents}>이 날짜에 기록된 식단이 없습니다.</p>
          )}
        </motion.div>
      </AnimatePresence>

      <button className={styles.addButton} onClick={() => setShowModal(true)}>
        + 식단 추가하기
      </button>

      {showModal && (
        <AddDietModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitMeal}
          selectedDate={formatDate(weekDates[days.indexOf(selectedDay)])}
          type='custom'
        />
      )}

      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
      />
    </div>
  );
}