import React, { useCallback } from 'react';
import calendarStyles from 'assets/css/pages/calendar/calendarPage.module.css';

function NavigationButtons({ date, handleDateChange, fetchDietEvents, viewMode }) {
  const handlePrevWeek = useCallback(() => {
    console.log('handlePrevWeek called');
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 7);
    handleDateChange(prevDate);
    fetchDietEvents(prevDate, viewMode);
  }, [date, handleDateChange, fetchDietEvents, viewMode]);

  const handleNextWeek = useCallback(() => {
    console.log('handleNextWeek called');
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 7);
    handleDateChange(nextDate);
    fetchDietEvents(nextDate, viewMode);
  }, [date, handleDateChange, fetchDietEvents, viewMode]);

  return (
    <div className={calendarStyles.navigationWrapper}>
      <button onClick={handlePrevWeek}>◀ 이전 주</button>
      <button onClick={handleNextWeek}>다음 주 ▶</button>
    </div>
  );
}

export default NavigationButtons;