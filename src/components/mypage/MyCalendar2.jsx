import React, { useState, useEffect, useCallback } from 'react';

import eventsData from 'data/events.json';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
const days = ['월', '화', '수', '목', '금', '토', '일'];

function MyCalendar() {
  const [weekDates, setWeekDates] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(new Date().getDay() - 1);
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOffset = today.getDay() === 0 ? 6 : today.getDay() - 1;
    startOfWeek.setDate(today.getDate() - dayOffset);
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
    setWeekDates(dates);
  }, []);

  useEffect(() => {
    setEvents(eventsData.events);
  }, []);

  useEffect(() => {
    if (weekDates.length === 7) {
      const selectedDate = weekDates[selectedIndex];
      const formatted = formatDate(selectedDate);
      const filtered = events.filter(e => e.date === formatted);
      setSelectedDateEvents(filtered);
    }
  }, [selectedIndex, events, weekDates, formatDate]);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>주간 캘린더</h2>

      {/* 요일 선택 */}
      <div className={styles.daySelector}>
        {days.map((day, idx) => (
          <button
            key={idx}
            className={selectedIndex === idx ? styles.activeDay : ''}
            onClick={() => setSelectedIndex(idx)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 선택된 날짜 기록 표시 */}
      <div className={styles.scheduleList}>
        <h4>
          {weekDates[selectedIndex] &&
            `${weekDates[selectedIndex].getFullYear()}년 ${weekDates[selectedIndex].getMonth() + 1}월 ${weekDates[selectedIndex].getDate()}일 기록`}
        </h4>
        {selectedDateEvents.length > 0 ? (
          <ul className={styles.scheduleItems}>
            {selectedDateEvents.map(event => (
              <li key={event.id} className={styles.scheduleItem}>
                <span className={styles.eventIcon}>
                  {event.type === 'diet' ? '🍽️' : event.type === 'workout' ? '💪' : '📝'}
                </span>
                <span className={styles.scheduleTitle}>{event.title}</span>
                <span className={styles.scheduleDetails}>{event.details}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noEvents}>이 날짜에 기록된 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MyCalendar;
