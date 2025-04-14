import React, { useState, useEffect } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import AddMealModal from 'components/calendar/AddMealModal';
import axios from 'axios';

const days = ['일', '월', '화', '수', '목', '금', '토'];

const getThisWeekDates = () => {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d);
  }
  return week;
};

const formatDate = (date) => date.toISOString().split('T')[0];

export default function WeekCalendar() {
  const weekDates = getThisWeekDates();
  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(days[todayIndex]);
  const [mealData, setMealData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [weekDateRange, setWeekDateRange] = useState('');

  useEffect(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    setWeekDateRange(`${start.getMonth() + 1}.${start.getDate()} ~ ${end.getMonth() + 1}.${end.getDate()}`);

    const startDate = formatDate(start) + 'T00:00:00';
    const endDate = formatDate(end) + 'T23:59:59';

    axios.get(`/api/diet/list?userId=1&startDate=${startDate}&endDate=${endDate}`)
      .then(res => {
        const result = { '일': [], '월': [], '화': [], '수': [], '목': [], '금': [], '토': [] };
        res.data.forEach((r) => {
          const date = new Date(r.eatenDate);
          const day = days[date.getDay()];
          result[day].push({
            type: r.category === 'morning' ? '아침' : r.category === 'lunch' ? '점심' : '저녁',
            time: r.category === 'morning' ? '08:00 ~ 09:30' : r.category === 'lunch' ? '12:00 ~ 13:30' : '18:00 ~ 19:30',
            items: [`${r.foodName} (${r.intakeAmount}${r.unit})`],
            carb: 0,
            protein: 0,
            kcal: 0,
          });
        });
        setMealData(result);
      })
      .catch(err => console.error('식단 불러오기 실패:', err));
  }, []);

  const handleAddMeal = (mealType, menus) => {
    const newMeal = {
      type: mealType === 'morning' ? '아침' : mealType === 'lunch' ? '점심' : '저녁',
      time:
        mealType === 'morning'
          ? '08:00 ~ 09:30'
          : mealType === 'lunch'
            ? '12:00 ~ 13:30'
            : '18:00 ~ 19:30',
      items: menus.map((m) => `${m.name} (${m.servings}인분)`),
      carb: 0,
      protein: 0,
      kcal: 0,
    };

    setMealData((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newMeal],
    }));
    setShowModal(false);
  };

  const meals = mealData[selectedDay] || [];

  return (
    <div className={`${styles.tabContent} ${styles.fadeSlideIn}`}>
      <h2 className={styles.contentTitle}>주간 식단표</h2>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>이번 주: {weekDateRange}</p>

      <div className={styles.daySelector}>
        {days.map((day, idx) => {
          const date = weekDates[idx];
          const label = `${day} (${date.getMonth() + 1}.${date.getDate()})`;
          return (
            <button
              key={day}
              className={`${styles.dayButton} ${selectedDay === day ? styles.activeDay : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {label}
            </button>
          );
        })}
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