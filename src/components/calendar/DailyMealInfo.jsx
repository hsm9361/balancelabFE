// ✅ components/calendar/DailyMealInfo.jsx
import React from 'react';
import eventsData from 'data/events.json';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';

function DailyMealInfo({ selectedDay }) {
  const today = new Date();
  const start = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  const targetDate = new Date(start.setDate(start.getDate() + selectedDay));
  const formattedDate = targetDate.toISOString().split('T')[0];

  const meals = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  eventsData.events.forEach((e) => {
    if (e.date === formattedDate) {
      if (e.time === 'morning') meals.breakfast.push(e);
      else if (e.time === 'lunch') meals.lunch.push(e);
      else if (e.time === 'dinner') meals.dinner.push(e);
    }
  });

  const renderMeal = (label, items) => (
    <div className={styles.mealBlock}>
      <strong>{label}</strong>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.noEvent}>기록 없음</p>
      )}
    </div>
  );

  return (
    <div className={styles.dailyMealInfo}>
      <h3>📅 {formattedDate} 기록</h3>
      {renderMeal('🥣 아침', meals.breakfast)}
      {renderMeal('🍱 점심', meals.lunch)}
      {renderMeal('🍽️ 저녁', meals.dinner)}
    </div>
  );
}

export default DailyMealInfo;