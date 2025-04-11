// src/pages/CalendarPage.jsx
import React, { useState } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import MonthCalendar from 'components/mypage/MonthCalendar';
import WeekCalendar from 'components/mypage/WeekCalendar';




function CalendarPage() {
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  return (
    <div className='{styles.calendarPageContainer} {styles.toggleWrapper}'>
      <h1 className={styles.pageTitle}>
  {viewMode === 'week' ? '주간 캘린더' : '월간 캘린더'}
</h1>
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
        {viewMode === 'month' ? <MonthCalendar /> : <WeekCalendar />}
      </div>
    </div>
  );
}

export default CalendarPage;
