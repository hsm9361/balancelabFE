import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import eventsData from 'data/events.json';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // 날짜 포맷팅 함수
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // 선택된 날짜에 해당하는 이벤트 필터링
  const filterEventsByDate = useCallback(
    (selectedDate) => {
      const formattedDate = formatDate(selectedDate);
      const filteredEvents = events.filter(event => event.date === formattedDate);
      setSelectedDateEvents(filteredEvents);
    },
    [events, formatDate] // events와 formatDate에 의존
  );

  // useEffect로 초기 데이터 로드 및 날짜 변경 시 필터링
  useEffect(() => {
    setEvents(eventsData.events); // 데이터 로드
    filterEventsByDate(date); // 선택된 날짜 이벤트 필터링
  }, [date, events, filterEventsByDate]);

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setDate(newDate);
    filterEventsByDate(newDate);
  };

  // 이벤트가 있는 날짜 클래스 추가
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = formatDate(date);
      const hasEvent = events.some(event => event.date === formattedDate);
      return hasEvent ? styles.hasEvent : null;
    }
  };

  // 이벤트 타입에 따른 아이콘 반환
  const getEventIcon = (type) => {
    switch (type) {
      case 'diet':
        return '🍽️';
      case 'workout':
        return '💪';
      case 'measurement':
        return '⚖️';
      default:
        return '📝';
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>캘린더</h2>

      <div className={styles.calendarContainer}>
        {/* react-calendar 컴포넌트 */}
        <div className={styles.calendarWrapper}>
          <Calendar
            onChange={handleDateChange}
            value={date}
            locale="ko-KR"
            tileClassName={tileClassName}
            nextLabel="▶"
            prevLabel="◀"
            next2Label={null}
            prev2Label={null}
          />
        </div>

        <div className={styles.scheduleList}>
          <h4>
            {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일 기록
          </h4>
          {selectedDateEvents.length > 0 ? (
            <ul className={styles.scheduleItems}>
              {selectedDateEvents.map(event => (
                <li key={event.id} className={styles.scheduleItem}>
                  <span className={styles.eventIcon}>{getEventIcon(event.type)}</span>
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
    </div>
  );
}

export default MyCalendar;