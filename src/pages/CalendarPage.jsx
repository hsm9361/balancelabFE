import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { VscFoldUp, VscFoldDown } from 'react-icons/vsc';
import CalendarView from '../components/calendar/CalendarView';
import MealCards from '../components/calendar/MealCards';
import AddDietModal from 'components/calendar/AddMealModal';
import CustomModal from '../components/common/CustomModal';
import AuthModal from '../components/auth/AuthModal';
import apiClient from '../services/apiClient';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import calendarStyles from 'assets/css/pages/calendar/calendarPage.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../hooks/useAuth';

dayjs.locale('ko');

function CalendarPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });
  const [weekRange, setWeekRange] = useState({ minDate: null, maxDate: null });
  const userId = user?.id || 1;

  const handleGoogleLogin = useCallback(() => {
    try {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const redirectUri = encodeURIComponent('http://localhost:3000/oauth/callback');
      const googleAuthUrl = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${redirectUri}`;

      const loginWindow = window.open(
        googleAuthUrl,
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      );

      if (loginWindow) {
        loginWindow.focus();
      } else {
        toast.error('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
      }
    } catch (error) {
      console.error('Failed to open login window:', error);
      toast.error('로그인 창을 열 수 없습니다. 다시 시도해주세요.');
    }
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const getDateRange = useCallback(
    (date, mode) => {
      if (mode === 'week') {
        const start = dayjs(date).startOf('week').toDate();
        const end = dayjs(date).endOf('week').toDate();
        return {
          startDate: formatDate(start),
          endDate: formatDate(end),
          minDate: new Date(start),
          maxDate: new Date(end),
        };
      }
      return {
        startDate: formatDate(new Date(date.getFullYear(), date.getMonth(), 1)),
        endDate: formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
        minDate: null,
        maxDate: null,
      };
    },
    [formatDate]
  );

  const fetchDietEvents = useCallback(
    async (baseDate, mode = viewMode) => {
      if (!isAuthenticated) return;
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
        toast.error('식단 데이터를 불러오는 중 오류가 발생했습니다.');
        setModalState({
          isOpen: true,
          title: '오류',
          message: '식단 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
          onConfirm: null,
        });
      }
    },
    [getDateRange, userId, viewMode, isAuthenticated]
  );

  const handleDateChange = useCallback(
    async (newDate) => {
      if (!isAuthenticated) return;
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
        toast.error('선택한 날짜의 식단 데이터를 불러오는 중 오류가 발생했습니다.');
        setModalState({
          isOpen: true,
          title: '오류',
          message: '선택한 날짜의 식단 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
          onConfirm: null,
        });
      }
    },
    [formatDate, userId, isAuthenticated]
  );

  const getMealType = (mealTime) => {
    if (!mealTime) return '기타';
    const [start] = mealTime.split(' ~ ');
    const hour = parseInt(start.split(':')[0], 10);
    if (hour < 10) return '아침';
    if (hour < 15) return '점심';
    return '저녁';
  };

  const formatUnit = (unit) => {
    if (unit === 'serving') return '인분';
    return unit || 'g';
  };

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
        toast.error('식단 추가에 실패했습니다.');
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
    [date, handleDateChange, fetchDietEvents]
  );

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
            toast.error('식단 삭제에 실패했습니다.');
            setModalState({
              isOpen: true,
              title: '삭제 실패',
              message: '식단 삭제에 실패했습니다. 다시 시도해주세요.',
              onConfirm: null,
            });
          });
      },
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible((prev) => !prev);
  };

  useEffect(() => {
    const { minDate, maxDate } = getDateRange(date, viewMode);
    setWeekRange({ minDate, maxDate });
  }, [date, viewMode, getDateRange]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDietEvents(date);
      handleDateChange(date);
    } else {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, date, fetchDietEvents, handleDateChange]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDietEvents(date, viewMode);
    }
  }, [isAuthenticated, viewMode, date, fetchDietEvents]);

  useEffect(() => {
    const handleAuthUpdate = () => {
      if (isAuthenticated) {
        fetchDietEvents(date);
        handleDateChange(date);
        setShowAuthModal(false);
      }
    };
    window.addEventListener('auth-update', handleAuthUpdate);
    return () => {
      window.removeEventListener('auth-update', handleAuthUpdate);
    };
  }, [isAuthenticated, date, fetchDietEvents, handleDateChange]);

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
      <button
        className={calendarStyles.toggleCalendarButton}
        onClick={toggleCalendarVisibility}
      >
        {isCalendarVisible ? (
          <>
            <VscFoldUp size={20} /> 캘린더 접기
          </>
        ) : (
          <>
            <VscFoldDown size={20} /> 캘린더 펴기
          </>
        )}
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={calendarStyles.calendarContainer}
        >
          {isCalendarVisible && (
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
          )}
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
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        type="required"
        onGoogleLogin={handleGoogleLogin}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CalendarPage;