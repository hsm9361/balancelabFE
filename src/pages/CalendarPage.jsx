// src/pages/CalendarPage.jsx
import React, { useState } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import Calendar from 'components/mypage/MyCalendar';
import CalendarWeek from 'components/mypage/MyCalendar2';




function CalendarPage() {
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  return (
    <div className={styles.calendarPageContainer}>
      <h1 className={styles.pageTitle}>주간 캘린더</h1>
      <div className={styles.toggleWrapper}>
  <button
    className={viewMode === 'week' ? styles.activeToggle : ''}
    onClick={() => setViewMode('week')}
  >
    주간
  </button>
  <button
    className={viewMode === 'month' ? styles.activeToggle : ''}
    onClick={() => setViewMode('month')}
  >
    월간
  </button>
</div>



      <div className={styles.contentWrapper}>
        {viewMode === 'month' ? <Calendar /> : <CalendarWeek />}
      </div>
    </div>
  );
}

export default CalendarPage;
