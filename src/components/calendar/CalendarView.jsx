import React, { useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import calendarStyles from 'assets/css/pages/calendar/calendarPage.module.css';
import NavigationButtons from './NavigationButtons';
import dayjs from 'dayjs';

function CalendarView({
  date,
  setDate,
  viewMode,
  events,
  weekRange,
  formatDate,
  handleDateChange,
  fetchDietEvents,
}) {
  // 캘린더 타일에 이벤트 표시
  const tileContent = useCallback(
    ({ date, view }) => {
      const formattedDate = formatDate(date);
      const hasEvent = events.some((event) => event.date === formattedDate);
      if (hasEvent && view === 'month') {
        return (
          <div
            className={
              viewMode === 'week' ? calendarStyles.eventBar : calendarStyles.eventBottomBorder
            }
          ></div>
        ); // 주간: 파란색 그라데이션 바, 월간: 파란색 그라데이션 하단 테두리
      }
      return null;
    },
    [events, formatDate, viewMode]
  );

  // 타일 클래스 설정
  const tileClassName = useCallback(
    ({ date, view }) => {
      const formattedDate = formatDate(date);
      const isSelected = formattedDate === formatDate(new Date(date));
      const classes = [];
      if (isSelected && view === 'month') {
        classes.push(calendarStyles.selectedTile); // 선택된 날짜 강조
      }
      if (
        viewMode === 'week' &&
        view === 'month' &&
        weekRange.minDate &&
        weekRange.maxDate
      ) {
        const startOfWeek = dayjs(weekRange.minDate).startOf('day').toDate();
        const endOfWeek = dayjs(weekRange.maxDate).endOf('day').toDate();
        if (date < startOfWeek || date > endOfWeek) {
          classes.push(calendarStyles.hiddenTile); // 해당 주 외 날짜 숨김
        }
      }
      return classes.join(' ');
    },
    [viewMode, weekRange, formatDate, date]
  );

  // 타일 비활성화
  const tileDisabled = useCallback(
    ({ date, view }) => {
      if (
        viewMode === 'week' &&
        view === 'month' &&
        weekRange.minDate &&
        weekRange.maxDate
      ) {
        const startOfWeek = dayjs(weekRange.minDate).startOf('day').toDate();
        const endOfWeek = dayjs(weekRange.maxDate).endOf('day').toDate();
        return date < startOfWeek || date > endOfWeek; // 해당 주 외 날짜 비활성화
      }
      return false;
    },
    [viewMode, weekRange]
  );

  // 월 변경 시 호출 (다음/이전 달 버튼)
  const handleActiveStartDateChange = useCallback(
    ({ activeStartDate, view }) => {
      if (view === 'month') {
        const newDate = new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), date.getDate());
        setDate(newDate);
        fetchDietEvents(newDate, viewMode);
      }
    },
    [setDate, fetchDietEvents, viewMode, date]
  );

  // 내비게이션 라벨 커스터마이징
  const navigationLabel = useCallback(
    ({ date, view }) => {
      if (view === 'month') {
        if (viewMode === 'week' && weekRange.minDate) {
          const startOfWeek = dayjs(weekRange.minDate);
          return `${startOfWeek.year()}년 ${startOfWeek.month() + 1}월`; // 주간 뷰: 시작 날짜의 달 표시
        }
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      }
      return date.getFullYear();
    },
    [viewMode, weekRange]
  );

  // 월 시작 날짜 설정
  const activeStartDate = viewMode === 'week' ? weekRange.minDate : new Date(date.getFullYear(), date.getMonth(), 1);

  return (
    <div className={calendarStyles.calendarWrapper}>
      {viewMode === 'week' && (
        <NavigationButtons
          date={date}
          handleDateChange={handleDateChange}
          fetchDietEvents={fetchDietEvents}
          viewMode={viewMode}
        />
      )}
      <Calendar
        onChange={handleDateChange}
        value={date}
        activeStartDate={activeStartDate}
        locale="ko-KR"
        tileContent={tileContent}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
        nextLabel={viewMode === 'week' ? null : '▶'}
        prevLabel={viewMode === 'week' ? null : '◀'}
        navigationLabel={navigationLabel}
        onActiveStartDateChange={handleActiveStartDateChange}
        next2Label={null}
        prev2Label={null}
        view="month"
        minDetail="month" // 드롭다운 비활성화: 월 뷰 고정
        maxDetail="month" // 월 단위 뷰만 표시
        minDate={null}
        maxDate={null}
        className={viewMode === 'week' ? calendarStyles.weekView : ''}
        showNeighboringMonth={true} // 주간 뷰에서도 이웃 달 표시
      />
    </div>
  );
}

export default CalendarView;