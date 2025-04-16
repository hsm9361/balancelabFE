import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import AddMealModal from 'components/calendar/AddMealModal';
import buttonStyles from 'assets/css/pages/calendar/calendarPage.module.css';
import apiClient from '../../services/apiClient';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem('member_Id');  // 사용자 ID

  // 날짜 포맷팅 함수
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const getMonthDateRange = useCallback((date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  }, [formatDate]);

  const fetchDietEvents = useCallback(async (baseDate) => {
    const { startDate, endDate } = getMonthDateRange(baseDate);

    try {
      const res = await apiClient.get(`/api/diet/list`, {
        params: {
          userId,
          startDate,
          endDate,
        }
      });

      const dietEvents = res.data.map(item => ({
        id: item.id || item.recordId,
        date: item.eatenDate?.split('T')[0], // 'YYYY-MM-DD' 포맷으로
        title: item.mealType || '식단',
        type: 'diet',
        details: `${item.foodName || item.description || '음식'} (${item.intakeAmount} ${item.unit})`
      }));

      setEvents(dietEvents);

      // 현재 날짜 기준으로 필터링해서 보여주기
      const formattedCurrent = formatDate(baseDate);
      const todaysEvents = dietEvents.filter(event => event.date === formattedCurrent);
      setSelectedDateEvents(todaysEvents);

    } catch (error) {
      console.error('식단 데이터를 불러오는 중 오류 발생:', error);
      setEvents([]);
      setSelectedDateEvents([]);
    }
  }, [getMonthDateRange, formatDate, userId]);

  // 날짜 클릭 시 필터링만
  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formatted = formatDate(newDate);
    const filtered = events.filter(event => event.date === formatted);
    setSelectedDateEvents(filtered);
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

  const handleAddMeal = (mealType, menus) => {
    const newEvent = {
      id: Date.now(),
      date: formatDate(date),
      type: 'diet',
      title: `${mealType === 'morning' ? '아침' : mealType === 'lunch' ? '점심' : '저녁'} 식사`,
      details: menus.map((m) => `${m.foodName} (${m.intakeAmount}${m.unit})`).join(', ')
    };

    setEvents(prev => [...prev, newEvent]);
    setSelectedDateEvents(prev => [...prev, newEvent]);
    setShowModal(false);
  };
  
  // 최초 로드 + 날짜 바뀔 때 월이 바뀌면 다시 로딩
  useEffect(() => {
    fetchDietEvents(date);
  }, [date.getFullYear(), date.getMonth(), fetchDietEvents]);
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
          <br/>
          <button 
            className={buttonStyles.addButton} 
            onClick={() => setShowModal(true)}          >
            + 식단 추가하기
          </button>
        </div>
      </div>

      {showModal && (
        <AddMealModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMeal}
          selectedDate={date}
        />
      )}
    </div>
  );
}

export default MyCalendar;