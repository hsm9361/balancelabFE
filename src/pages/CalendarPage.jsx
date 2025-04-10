// pages/CalendarPage.jsx
import React, { useState } from 'react';
import styles from '../assets/css/pages/calendar/Calendar.module.css';
import DaySelector from 'components/calendar/DaySelector';
import DailyMealInfo from 'components/calendar/DailyMealInfo';
import CalendarActionButtons from 'components/calendar/CalendarActionButtons';

function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() - 1); // 0 = 월요일

  return (
    <div className={styles.calendarPageContainer}>
      <h1 className={styles.pageTitle}>식단 기록</h1>
      <div className={styles.contentWrapper}>
        <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <div className={styles.contentArea}>
          <DailyMealInfo selectedDay={selectedDay} />
          <CalendarActionButtons />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;