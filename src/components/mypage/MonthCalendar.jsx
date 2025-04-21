import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import calendarStyles from 'assets/css/pages/calendar/calendarPage.module.css';
import AddMealModal from 'components/calendar/AddMealModal';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const userId = 1; // 사용자 ID

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
      const res = await apiClient.get(`/food-record/member/range`, {
        params: {
          userId,
          startDate,
          endDate,
        },
      });

      // FoodRecordCountDto의 count와 consumedDate를 기반으로 이벤트 생성
      const dietEvents = res.data
        .filter(item => item.count > 0) // count가 0보다 큰 날짜만 포함
        .map(item => ({
          date: item.consumedDate.split('T')[0], // consumedDate를 YYYY-MM-DD 형식으로 변환
          title: '식단 기록',
          type: 'diet',
          count: item.count,
        }));

      setEvents(dietEvents);
      console.log('Fetched events:', dietEvents); // 디버깅용 로그
    } catch (error) {
      console.error('식단 데이터를 불러오는 중 오류 발생:', error);
      setEvents([]);
    }
  }, [getMonthDateRange, userId]);

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    const formatted = formatDate(newDate);

    try {
      const res = await apiClient.get(`/food-record/member/date`, {
        params: { date: formatted, userId },
      });

      const dayEvents = res.data.map(item => {
        const { type, time } = getMealTypeAndTime(item.mealTime);
        return {
          id: item.id || item.recordId,
          date: formatted,
          title: item.mealType || '식단',
          type: 'diet',
          items: [`${item.foodName || item.description || '음식'} (${item.intakeAmount || item.amount || 1}${formatUnit(item.unit)})`],
          type,
          time,
        };
      });

      setSelectedDateEvents(dayEvents);
      console.log('Selected date events:', dayEvents); // 디버깅용 로그
    } catch (error) {
      console.error('선택한 날짜 식단 조회 오류:', error);
      setSelectedDateEvents([]);
    }
  };

  // WeekCalendar의 getMealTypeAndTime 재사용
  const getMealTypeAndTime = (mealTime) => {
    if (!mealTime) {
      return { type: '기타', time: '알 수 없음' };
    }
    const [start] = mealTime.split(' ~ ');
    const hour = parseInt(start.split(':')[0], 10);
    if (hour < 10) {
      return { type: '아침', time: '08:00 ~ 09:30' };
    } else if (hour < 15) {
      return { type: '점심', time: '12:00 ~ 13:30' };
    } else {
      return { type: '저녁', time: '18:00 ~ 19:30' };
    }
  };

  // WeekCalendar의 formatUnit 함수
  const formatUnit = (unit) => {
    if (unit === 'serving') return '인분';
    return unit || 'g';
  };

  // 타일 콘텐츠 (점 표시)
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = formatDate(date);
      const hasEvent = events.some(event => event.date === formattedDate);
      return hasEvent ? <div className={calendarStyles.eventDot} /> : null;
    }
    return null;
  };

  const handleAddMeal = (mealType, menus) => {
    const newEvent = {
      id: Date.now(),
      date: formatDate(date),
      type: 'diet',
      title: `${mealType === 'morning' ? '아침' : mealType === 'lunch' ? '점심' : '저녁'} 식사`,
      items: menus.map((m) => `${m.foodName} (${m.intakeAmount || 1}${formatUnit(m.unit)})`),
      ...getMealTypeAndTime(null),
    };

    setEvents(prev => [...prev, newEvent]);
    setSelectedDateEvents(prev => [...prev, newEvent]);
    setShowModal(false);
  };

  // 삭제 기능
  const handleDeleteMeal = (indexToDelete, foodId) => {
    const confirmDelete = window.confirm('삭제하시겠습니까?');
    if (!confirmDelete) return;

    apiClient
      .delete(`/api/diet/delete/${foodId}?userId=${userId}`)
      .then(() => {
        setSelectedDateEvents(prev => prev.filter((_, idx) => idx !== indexToDelete));
        setEvents(prev => prev.filter(event => event.id !== foodId));
        setTimeout(() => {
          window.alert('삭제되었습니다.');
        }, 100);
      })
      .catch((err) => {
        console.error('삭제 실패:', err);
        window.alert('삭제에 실패했습니다.');
      });
  };

  // 초기 로드 시 오늘 날짜 데이터 조회
  useEffect(() => {
    handleDateChange(date);
    fetchDietEvents(date); // 초기 데이터 fetching
  }, []); // 빈 의존성 배열로 초기 로드 시 1회만 실행

  // 월 변경 시 캘린더 타일 데이터 조회
  useEffect(() => {
    fetchDietEvents(date);
  }, [date.getFullYear(), date.getMonth(), fetchDietEvents]);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>캘린더</h2>

      <div className={styles.calendarContainer}>
        <div className={styles.calendarWrapper}>
          <Calendar
            onChange={handleDateChange}
            value={date}
            locale="ko-KR"
            tileContent={tileContent} // 점 표시
            nextLabel="▶"
            prevLabel="◀"
            next2Label={null}
            prev2Label={null}
          />
        </div>

        <div className={calendarStyles.mealCards}>
          <h4>
            {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일 기록
          </h4>
          <AnimatePresence mode="wait">
            <motion.div
              key={formatDate(date)}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((meal, idx) => (
                  <div key={idx} className={calendarStyles.mealCard}>
                    <div className={calendarStyles.mealTime} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className={calendarStyles.mealLabel}>{meal.type}</span>
                        <span className={calendarStyles.mealTimeRange} style={{ marginLeft: '0.5rem' }}>{meal.time}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteMeal(idx, meal.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'red',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                    <div className={calendarStyles.mealContents}>{meal.items.join(', ')}</div>
                  </div>
                ))
              ) : (
                <p className={calendarStyles.noEvents}>이 날짜에 기록된 데이터가 없습니다.</p>
              )}
            </motion.div>
          </AnimatePresence>
          <br />
          <button
            className={calendarStyles.addButton}
            onClick={() => setShowModal(true)}
          >
            + 식단 추가하기
          </button>
        </div>
      </div>

      {showModal && (
        <AddMealModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMeal}
          selectedDate={date}
          type="custom"
        />
      )}
    </div>
  );
}

export default MyCalendar;