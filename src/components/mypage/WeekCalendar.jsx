import React, { useState } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import AddMealModal from 'components/calendar/AddMealModal';
import axios from 'axios';
const days = ['월', '화', '수', '목', '금', '토', '일'];

const initialData = {
  월: [],
  화: [],
  수: [],
  목: [],
  금: [],
  토: [],
  일: [],
};

export default function WeekCalendar() {
  const [selectedDay, setSelectedDay] = useState('금');
  const [mealData, setMealData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);

  const handleAddMeal = (mealType, menus) => {
    const newMeal = {
      type: mealType === 'morning' ? '아침' : mealType === 'lunch' ? '점심' : '저녁',
      time:
        mealType === 'morning'
          ? '08:00 ~ 09:30'
          : mealType === 'lunch'
          ? '12:00 ~ 13:30'
          : '18:00 ~ 19:30',
      items: menus.map((m) => `${m.name} (${m.grams} g)`),
      carb: 0,
      protein: 0,
      kcal: 0,
    };

    setMealData((prev) => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newMeal],
    }));
    setShowModal(false);
  };

  const meals = mealData[selectedDay] || [];

  return (
    <div className={`${styles.tabContent} ${styles.fadeSlideIn}`}>
      <h2 className={styles.contentTitle}>주간 식단표</h2>

      <div className={styles.daySelector}>
        {days.map((day) => (
          <button
            key={day}
            className={`${styles.dayButton} ${selectedDay === day ? styles.activeDay : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className={styles.mealCards}>
        {meals.length > 0 ? (
          meals.map((meal, idx) => (
            <div key={idx} className={styles.mealCard}>
              <div className={styles.mealTime}>
                <span className={styles.mealLabel}>{meal.type}</span>
                <span className={styles.mealTimeRange}>{meal.time}</span>
              </div>
              <div className={styles.mealContents}>{meal.items.join(', ')}</div>
              <div className={styles.nutritionInfo}>
                탄수화물: {meal.carb}g / 단백질: {meal.protein}g / 예상 칼로리: {meal.kcal}kcal
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noEvents}>이 날짜에 기록된 식단이 없습니다.</p>
        )}
      </div>

      <button className={styles.addButton} onClick={() => setShowModal(true)}>
        + 식단 추가하기
      </button>

      {showModal && (
        <AddMealModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMeal}
        />
      )}
    </div>
  );
}
