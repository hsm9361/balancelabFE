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
  const [showModal, setShowModal] = useState(false);

  const userId = 1; // 사용자 ID

  // 날짜 포맷팅 함수
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // mealType 변환 함수
  const getMealTypeTitle = (mealType) => {
    switch (mealType) {
      case 'morning':
        return '아침';
      case 'lunch':
        return '점심';
      case 'dinner':
        return '저녁';
      default:
        return '식단';
    }
  };

  // 식단 데이터 가져오기
  const fetchDietEvents = useCallback(
    async (selectedDate) => {
      const formattedDate = formatDate(selectedDate);
      try {
        const res = await apiClient.get(`/food-record/member/date`, {
          params: {
            userId,
            date: formattedDate,
          },
        });

        console.log('서버 응답 데이터', res.data);

        const dietEvents = res.data.map((item) => ({
          id: item.id || item.recordId || Date.now(),
          date: item.consumedDate?.split('T')[0] || formattedDate, // consumedDate가 null이면 요청 날짜 사용
          title: getMealTypeTitle(item.mealTime),
          type: 'diet',
          details: `${item.foodName || '음식'} (${item.amount}${item.unit === 'serving' ? '인분' : item.unit || 'g'})`,
        }));

        console.log('매핑된 이벤트', dietEvents);
        setEvents(dietEvents);
      } catch (error) {
        console.error('식단 데이터를 불러오는 중 오류 발생:', error);
        setEvents([]);
      }
    },
    [formatDate, userId]
  );

  // 날짜 변경 시 API 호출
  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchDietEvents(newDate);
  };

  // 이벤트가 있는 날짜 클래스 추가
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = formatDate(date);
      const hasEvent = events.some((event) => event.date === formattedDate);
      return hasEvent ? styles.hasEvent : null;
    }
    return null;
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

  // 식단 추가 핸들러
  const handleAddMeal = (mealType, menus) => {
    const formattedDate = formatDate(date);
    const newEvent = {
      id: Date.now(), // 임시 ID, 백엔드에서 실제 ID 반환
      date: formattedDate,
      type: 'diet',
      title: getMealTypeTitle(mealType),
      details: menus
        .map((m) => `${m.foodName} (${m.intakeAmount}${m.unit === 'serving' ? '인분' : m.unit || 'g'})`)
        .join(', '),
    };

    apiClient
      .post('/food-record', {
        foodName: menus[0].foodName,
        amount: menus[0].intakeAmount,
        unit: menus[0].unit,
        mealTime: mealType,
        consumedDate: formattedDate,
        memberId: userId,
      })
      .then((res) => {
        setEvents((prev) => [
          ...prev.filter((e) => e.date !== formattedDate), // 기존 날짜 이벤트 제거
          { ...newEvent, id: res.data.id }, // 백엔드 ID로 업데이트
        ]);
        setShowModal(false);
        window.alert('식단이 추가되었습니다.');
      })
      .catch((err) => {
        console.error('식단 추가 실패:', err);
        window.alert('식단 추가에 실패했습니다.');
      });
  };

  // 날짜 변경 시 API 호출
  useEffect(() => {
    fetchDietEvents(date);
  }, [date, fetchDietEvents]);

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
          {events.length > 0 ? (
            <ul className={styles.scheduleItems}>
              {events.map((event) => (
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
          <br />
          <button className={buttonStyles.addButton} onClick={() => setShowModal(true)}>
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