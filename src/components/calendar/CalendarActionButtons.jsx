// ✅ components/calendar/CalendarActionButtons.jsx (변경 없음)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';



function CalendarActionButtons({ onAddClick }) {
  const navigate = useNavigate();

  return (
    <div className={styles.buttonSection}>
      <button onClick={onAddClick} className={styles.actionBtn}>
        + 새 기록 추가하기
      </button>
      <button onClick={() => navigate('/mypage')} className={styles.actionBtn}>
        📊 영양 정보 보기
      </button>
    </div>
  );
}



export default CalendarActionButtons;