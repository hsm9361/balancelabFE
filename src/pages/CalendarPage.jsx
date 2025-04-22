import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarView from '../components/calendar/CalendarView';
import MealCards from '../components/calendar/MealCards';
import AddDietModal from 'components/calendar/AddMealModal';
import CustomModal from '../components/common/CustomModal';
import apiClient from '../services/apiClient';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import calendarStyles from 'assets/css/pages/calendar/calendarPage.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

function CalendarPage() {
  const location = useLocation();
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });
  const [weekRange, setWeekRange] = useState({ minDate: null, maxDate: null });
  const userId = 1;

  // URL로 전달된 viewMode 처리
  useEffect(() => {
    if (location.state?.viewMode) {
      setViewMode(location.state.viewMode);
    }
  }, [location.state]);

  // 날짜 포맷팅 함수
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // 주간/월간 날짜 범위 계산
  const getDateRange = useCallback(
    (date, mode) => {
      if (mode === 'week') {
        const start = dayjs(date).startOf('week').toDate(); // 월요일
        const end = dayjs(date).endOf('week').toDate(); // 일요일
        return {
          startDate: formatDate(start),
          endDate: formatDate(end),
          minDate: new Date(start),
          maxDate: new Date(end),
        };
      }
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        minDate: null,
        maxDate: null,
      };
    },
    [formatDate]
  );

  // 주간 범위 업데이트
  useEffect(() => {
    const { minDate, maxDate } = getDateRange(date, viewMode);
    setWeekRange({ minDate, maxDate });
  }, [date, viewMode, getDateRange]);

  // 식단 이벤트 조회
  const fetchDietEvents = useCallback(
    async (baseDate, mode = viewMode) => {
      const { startDate, endDate } = getDateRange(baseDate, mode);
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
      } catch (error) {
        console.error('식단 데이터 조회 오류:', error);
        setEvents([]);
        setModalState({
          isOpen: true,
          title: '오류',
          message: `식단 데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`,
          onConfirm: null,
        });
      }
    },
    [getDateRange, userId, viewMode]
  );

  // 날짜 변경 시 식단 조회
  const handleDateChange = useCallback(
    async (newDate) => {
      setDate(newDate);
      const formatted = formatDate(newDate);
      try {
        const res = await apiClient.get(`/food-record/member/date`, {
          params: { userId, date: formatted },
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
      } catch (error) {
        console.error('선택 날짜 식단 조회 오류:', error);
        setSelectedDateEvents([]);
        setModalState({
          isOpen: true,
          title: '오류',
          message: `선택한 날짜의 식단 데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`,
          onConfirm: null,
        });
      }
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

  // 식단 추가 처리
  const handleAddMeal = useCallback(
    async (mealType, menus) => {
      try {
        setModalState({
          isOpen: true,
          title: '추가 완료',
          message: '식단이 성공적으로 추가되었습니다.',
          onConfirm: null,
        });
        await handleDateChange(new Date(menus[0]?.consumedDate || date));
        await fetchDietEvents(date);
      } catch (error) {
        console.error('식단 추가 처리 오류:', error);
        setModalState({
          isOpen: true,
          title: '추가 실패',
          message: `식단 추가에 실패했습니다: ${error.message}`,
          onConfirm: null,
        });
      } finally {
        setShowModal(false);
      }
    },
    [date, handleDateChange, fetchDietEvents]
  );

  // 식단 삭제
  const handleDeleteMeal = (indexToDelete, foodId) => {
    setModalState({
      isOpen: true,
      title: '식단 삭제',
      message: '정말로 이 식단을 삭제하시겠습니까?',
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
              message: `식단 삭제에 실패했습니다: ${err.message}`,
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
  }, []); // 초기 로드

  // 뷰 모드 변경 시 데이터 갱신
  useEffect(() => {
    fetchDietEvents(date, viewMode);
  }, [viewMode, date, fetchDietEvents]);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>
        {viewMode === 'week' ? '주간 식단 캘린더' : '월간 식단 캘린더'}
      </h2>
      <div className={calendarStyles.toggleWrapper}>
        <motion.button
          className={`${calendarStyles.toggleButton} ${
            viewMode === 'month' ? calendarStyles.activeToggle : ''
          }`}
          onClick={() => setViewMode('month')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          월간 보기
        </motion.button>
        <motion.button
          className={`${calendarStyles.toggleButton} ${
            viewMode === 'week' ? calendarStyles.activeToggle : ''
          }`}
          onClick={() => setViewMode('week')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          주간 보기
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={calendarStyles.calendarContainer}
        >
          <CalendarView
            date={date}
            setDate={setDate}
            viewMode={viewMode}
            events={events}
            weekRange={weekRange}
            formatDate={formatDate}
            handleDateChange={handleDateChange}
            fetchDietEvents={fetchDietEvents}
          />
          <MealCards
            date={date}
            selectedDateEvents={selectedDateEvents}
            handleDeleteMeal={handleDeleteMeal}
            setShowModal={setShowModal}
          />
        </motion.div>
      </AnimatePresence>
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

export default CalendarPage;