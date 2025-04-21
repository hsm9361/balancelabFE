import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import calendarStyles from 'assets/css/pages/calendar/calendarPage.module.css';
import AddDietModal from 'components/calendar/AddMealModal'; // 올바른 경로로 수정
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/apiClient';
import CustomModal from '../../components/common/CustomModal';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());

  const userId = 1;

  // 날짜 포맷팅 함수
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // 월별 날짜 범위 계산
  const getMonthDateRange = useCallback(
    (date) => {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
      };
    },
    [formatDate]
  );

  // 식단 이벤트 조회
  const fetchDietEvents = useCallback(
    async (baseDate) => {
      const { startDate, endDate } = getMonthDateRange(baseDate);
      try {
        const res = await apiClient.get(`/food-record/member/range`, {
          params: { userId, startDate, endDate },
        });
        const dietEvents = res.data
          .filter((item) => item.count > 0)
          .map((item) => ({
            date: item.consumedDate.split('T')[0],
            title: '식단 기록',
            type: 'diet',
            count: item.count,
          }));
        setEvents(dietEvents);
        console.log('Fetched events:', dietEvents);
      } catch (error) {
        console.error('식단 데이터 조회 오류:', error);
        setEvents([]);
        setModalState({
          isOpen: true,
          title: '오류',
          message: '식단 데이터를 불러오는 중 오류가 발생했습니다.',
          onConfirm: null,
        });
      }
    },
    [getMonthDateRange, userId]
  );

  // 날짜 변경 시 식단 조회
  const handleDateChange = useCallback(
    async (newDate) => {
      setDate(newDate);
      const formatted = formatDate(newDate);
      try {
        const res = await apiClient.get(`/food-record/member/date`, {
          params: { date: formatted, userId },
        });
        const dayEvents = res.data.map((item) => {
          const type = getMealType(item.mealTime);
          return {
            id: item.id || item.recordId,
            date: formatted,
            title: item.mealType || '식단',
            type,
            time: item.mealTime || '알 수 없음',
            items: [
              `${item.foodName || item.description || '음식'} (${
                item.intakeAmount || item.amount || 1
              }${formatUnit(item.unit)})`,
            ],
          };
        });
        setSelectedDateEvents(dayEvents);
        console.log('Selected date events:', dayEvents);
      } catch (error) {
        console.error('선택 날짜 식단 조회 오류:', error);
        setSelectedDateEvents([]);
        setModalState({
          isOpen: true,
          title: '오류',
          message: '선택한 날짜의 식단 데이터를 불러오는 중 오류가 발생했습니다.',
          onConfirm: null,
        });
      }
      // 연도와 월 업데이트
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    },
    [formatDate, userId]
  );

  // 식사 시간대 분류
  const getMealType = (mealTime) => {
    if (!mealTime) return '기타';
    const [start] = mealTime.split(' ~ ');
    const hour = parseInt(start.split(':')[0], 10);
    if (hour < 10) return '아침';
    if (hour < 15) return '점심';
    return '저녁';
  };

  // 단위 포맷팅
  const formatUnit = (unit) => {
    if (unit === 'serving') return '인분';
    return unit || 'g';
  };

  // 캘린더 타일에 이벤트 표시
  const tileContent = useCallback(
    ({ date, view }) => {
      if (view === 'month') {
        const formattedDate = formatDate(date);
        const hasEvent = events.some((event) => event.date === formattedDate);
        return hasEvent ? <div className={calendarStyles.eventDot} /> : null;
      }
      return null;
    },
    [events, formatDate]
  );

  // 식단 추가 처리
  const handleAddMeal = useCallback(
    async (mealType, menus) => {
      console.log('handleAddMeal 호출:', { mealType, menus });
      try {
        // 식단 저장 요청은 이미 AddMealModal 내부에서 처리됨 가정
  
        setModalState({
          isOpen: true,
          title: '추가 완료',
          message: '식단이 성공적으로 추가되었습니다.',
          onConfirm: null,
        });
  
        // 최신 데이터 다시 불러오기 (실제 ID 반영)
        await handleDateChange(new Date(menus[0]?.consumedDate || date));
        await fetchDietEvents(date);
      } catch (error) {
        console.error('식단 추가 처리 오류:', error);
        setModalState({
          isOpen: true,
          title: '추가 실패',
          message: '식단 추가에 실패했습니다. 다시 시도해주세요.',
          onConfirm: null,
        });
      } finally {
        setShowModal(false);
      }
    },
    [date, formatDate, handleDateChange, fetchDietEvents]
  );
  
  

  // 식단 삭제
  const handleDeleteMeal = (indexToDelete, foodId) => {
    setModalState({
      isOpen: true,
      title: '식단 삭제',
      message: '이 식단을 삭제하시겠습니까?',
      onConfirm: () => {
        apiClient
          .delete(`food-record/${foodId}`)
          .then(() => {
            setSelectedDateEvents((prev) => prev.filter((_, idx) => idx !== indexToDelete));
            setEvents((prev) => prev.filter((event) => event.id !== foodId));
            setModalState({
              isOpen: true,
              title: '삭제 완료',
              message: '식단이 성공적으로 삭제되었습니다.',
              onConfirm: null,
            });
            fetchDietEvents(date);
          })
          .catch((err) => {
            console.error('삭제 실패:', err);
            setModalState({
              isOpen: true,
              title: '삭제 실패',
              message: '식단 삭제에 실패했습니다.',
              onConfirm: null,
            });
          });
      },
    });
  };

  // 모달 닫기
  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  // 초기 데이터 로드
  useEffect(() => {
    handleDateChange(date);
    fetchDietEvents(date);
  }, []); // 빈 의존성 배열로 초기 로드 시 1회 실행

  // 연도/월 변경 시 데이터 갱신
  useEffect(() => {
    fetchDietEvents(date);
  }, [year, month, fetchDietEvents]);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>캘린더</h2>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarWrapper}>
          <Calendar
            onChange={handleDateChange}
            value={date}
            locale="ko-KR"
            tileContent={tileContent}
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
                    <div
                      className={calendarStyles.mealTime}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <span className={calendarStyles.mealLabel}>{meal.type}</span>
                        <span
                          className={calendarStyles.mealTimeRange}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          {meal.time}
                        </span>
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
          <button className={calendarStyles.addButton} onClick={() => setShowModal(true)}>
            + 식단 추가하기
          </button>
        </div>
      </div>
      {showModal && (
        <AddDietModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMeal}
          selectedDate={date}
          type="text"
        />
      )}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
      />
    </div>
  );
}

export default MyCalendar;