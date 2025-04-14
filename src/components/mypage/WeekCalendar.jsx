import React, { useState, useEffect } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import AddMealModal from 'components/calendar/AddMealModal';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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

const formatDate = (date) => date.toISOString().split('T')[0];

export default function WeekCalendar() {
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState('');
  const [mealData, setMealData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [weekDateRange, setWeekDateRange] = useState('');

  const weekDates = getThisWeekDates(baseDate);

  useEffect(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    setWeekDateRange(`${start.getMonth() + 1}.${start.getDate()} ~ ${end.getMonth() + 1}.${end.getDate()}`);

    const todayStr = formatDate(new Date());
    const todayIndex = weekDates.findIndex((d) => formatDate(d) === todayStr);
    const defaultDay = todayIndex >= 0 ? days[todayIndex] : '월';
    setSelectedDay(defaultDay);

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
  }, [baseDate]);

  const handleWeekChange = (daysToAdd) => {
    const newBaseDate = new Date(baseDate);
    newBaseDate.setDate(baseDate.getDate() + daysToAdd);
    setBaseDate(newBaseDate);
  };

  const handleAddMeal = (mealType, menus) => {
    const newMeal = {
      type: mealType === 'morning' ? '아침' : mealType === 'lunch' ? '점심' : '저녁',
      time:
        mealType === 'morning'
          ? '08:00 ~ 09:30'
          : mealType === 'lunch'
            ? '12:00 ~ 13:30'
            : '18:00 ~ 19:30',
      items: menus.map((m) => `${m.foodName} (${m.intakeAmount}${m.unit})`),
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
    <div className={`${styles.tabContent}`}>
      <h2 className={styles.contentTitle}>주간 식단표</h2>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => handleWeekChange(-7)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '0.4rem 0.8rem' }}>◀ 이전 주</button>
        <span style={{ fontSize: '14px', color: '#555' }}>이번 주: {weekDateRange}</span>
        <button onClick={() => handleWeekChange(7)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '0.4rem 0.8rem' }}>다음 주 ▶</button>
      </div>

      <div className={styles.daySelector}>
        {days.map((day, idx) => {
          const date = weekDates[idx];
          const label = `${day} (${date.getMonth() + 1}.${date.getDate()})`;
          return (
            <button
              key={day}
              className={`${styles.dayButton} ${selectedDay === day ? styles.activeDay : ''}`}
              style={{ backgroundColor: '#007bff', color: 'white', borderRadius: '8px', padding: '0.4rem 0.8rem', border: 'none', margin: '0 0.3rem' }}
              onClick={() => setSelectedDay(day)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={baseDate.toISOString() + selectedDay} // ✅ 주간 or 요일 변경 시 슬라이드
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className={styles.mealCards}
        >
          {meals.length > 0 ? (
            meals.map((meal, idx) => (
              <div key={idx} className={styles.mealCard}>
                <div className={styles.mealTime}>
                  <span className={styles.mealLabel}>{meal.type}</span>
                  <span className={styles.mealTimeRange}>{meal.time}</span>
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
        <AddMealModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMeal}
          selectedDate={weekDates[days.indexOf(selectedDay)]}
        />
      )}
    </div>
  );
}
