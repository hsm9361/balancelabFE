// components/calendar/CalendarActionButtons.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../assets/css/pages/calendar/Calendar.module.css';


function CalendarActionButtons() {
  const navigate = useNavigate();

  return (
    <div className={styles.buttonSection}>
      <button onClick={() => navigate('/analysis')} className={styles.actionBtn}>
        + 새 기록 추가하기
      </button>
      <button onClick={() => navigate('/mypage')} className={styles.actionBtn}>
        📊 영양 정보 보기
      </button>
    </div>
  );
}

export default CalendarActionButtons;