import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import calendarStyles from 'assets/css/pages/calendar/calendarPage.module.css';
import empty from 'assets/images/empty.png';

function MealCards({ date, selectedDateEvents, handleDeleteMeal, setShowModal }) {
  return (
    <div className={calendarStyles.mealCards}>
      <h4 className={calendarStyles.selectedDateTitle}>
        {`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 식단 기록`}
      </h4>
      <AnimatePresence mode="wait">
        <motion.div
          key={date.toISOString()}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((meal, idx) => (
              <div key={idx} className={calendarStyles.mealCard}>
                <div className={calendarStyles.mealTime}>
                  <div>
                    <span className={calendarStyles.mealLabel}>{meal.type}</span>
                    <span className={calendarStyles.mealTimeRange}>{meal.time}</span>
                  </div>
                  <div className={calendarStyles.mealContents}>{meal.items.join(', ')}</div>
                  <button
                    onClick={() => handleDeleteMeal(idx, meal.id)}
                    className={calendarStyles.deleteButton}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={calendarStyles.noEvents}>
              <img src={empty} alt="No events icon" />
              <p>선택한 날짜에 기록된 식단이 없습니다.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <button className={calendarStyles.addButton} onClick={() => setShowModal(true)}>
        + 식단 추가
      </button>
    </div>
  );
}

export default MealCards;