import React, { useState, useEffect } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import AddMealModal from 'components/calendar/AddMealModal';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';

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

    apiClient.get(`/api/diet/list?userId=1&startDate=${startDate}&endDate=${endDate}`)
      .then(res => {
        console.log('서버 응답 데이터', res.data);
        const result = { '일': [], '월': [], '화': [], '수': [], '목': [], '금': [], '토': [] };
        res.data.forEach((r) => {
          const date = new Date(r.eatenDate);
          const day = days[date.getDay()];
          result[day].push({
            foodId: r.foodId || r.food_id,
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

  const handleDeleteMeal = (indexToDelete, foodId) => {
    const confirmDelete = window.confirm('삭제하시겠습니까?');
    if (!confirmDelete) return;
  
    axios.delete(`/api/diet/delete/${foodId}?userId=1`,{
      withCredentials: true

    })
      .then(() => {
        // 프론트 상태에서도 제거
        setMealData((prev) => {
          const updatedMeals = [...(prev[selectedDay] || [])];
          updatedMeals.splice(indexToDelete, 1);
          return {
            ...prev,
            [selectedDay]: updatedMeals,
          };
        });
  
        setTimeout(() => {
          window.alert('삭제되었습니다.');
        }, 100);
      })
      .catch((err) => {
        console.error('삭제 실패:', err);
        window.alert('삭제에 실패했습니다.');
      });
  };
  
  

  const meals = mealData[selectedDay] || [];

  return (
    <div className={`${styles.tabContent}`}>
      <h2 className={styles.contentTitle}>주간 식단표</h2>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => handleWeekChange(-7)}
          style={{
            backgroundColor: '#cce5ff',
            color: '#004085',
            border: '1px solid #b8daff',
            borderRadius: '5px',
            padding: '0.4rem 0.8rem',
            cursor: 'pointer'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#007bff'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#cce5ff'}
        >
          ◀ 이전 주
        </button>
        <span style={{ fontSize: '14px', color: '#555' }}>이번 주: {weekDateRange}</span>
        <button
          onClick={() => handleWeekChange(7)}
          style={{
            backgroundColor: '#cce5ff',
            color: '#004085',
            border: '1px solid #b8daff',
            borderRadius: '5px',
            padding: '0.4rem 0.8rem',
            cursor: 'pointer'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#007bff'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#cce5ff'}
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
              className={`${styles.dayButton}`}
              style={{
                backgroundColor: isActive ? '#007bff' : '#cce5ff',
                color: isActive ? 'white' : '#004085',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                border: 'none',
                margin: '0 0.3rem',
                cursor: 'pointer'
              }}
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
                <div className={styles.mealTime} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className={styles.mealLabel}>{meal.type}</span>
                    <span className={styles.mealTimeRange} style={{ marginLeft: '0.5rem' }}>{meal.time}</span>
                  </div>
                  <button
                    onClick={() => {
                      console.log('삭제요청', meal.foodId, meal);
                      handleDeleteMeal(idx, meal.foodId)}
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'red',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
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
        <AddMealModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMeal}
          selectedDate={weekDates[days.indexOf(selectedDay)]}
        />
      )}
    </div>
  );
}
