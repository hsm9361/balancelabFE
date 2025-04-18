// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import MonthCalendar from 'components/mypage/MonthCalendar';
import WeekCalendar from 'components/mypage/WeekCalendar';




function CalendarPage() {
  const location = useLocation();
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  // 페이지 이동 시 viewMode가 'month'로 강제 설정되도록 useEffect 추가
  useEffect(() => {
    if (location.state?.viewMode === 'week') {
      setViewMode('week');
    } else if (location.state?.viewMode === 'month') {
      setViewMode('month');
    }
  }, [location.state]);

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
