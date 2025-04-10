// ✅ components/calendar/DaySelector.jsx
import React from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';


const days = ['월', '화', '수', '목', '금', '토', '일'];

function DaySelector({ selectedDay, setSelectedDay }) {
  return (
    <div className={styles.daySelector}>
      {days.map((day, index) => (
        <button
          key={index}
          className={selectedDay === index ? styles.activeDay : ''}
          onClick={() => setSelectedDay(index)}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

export default DaySelector;