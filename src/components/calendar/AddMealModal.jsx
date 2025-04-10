// components/calendar/AddMealModal.jsx
import React, { useState } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';

function AddMealModal({ onClose, onSubmit }) {
  const [mealType, setMealType] = useState('morning');
  const [menu, setMenu] = useState('');

  const handleSubmit = () => {
    if (!menu.trim()) return;
    onSubmit(mealType, menu);
    setMealType('morning');
    setMenu('');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>기록 추가</h3>
        <label>
          식사 시간:
          <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
            <option value="morning">아침</option>
            <option value="lunch">점심</option>
            <option value="dinner">저녁</option>
          </select>
        </label>
        <label>
          메뉴:
          <input
            type="text"
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            placeholder="메뉴를 입력하세요"
          />
        </label>
        <div className={styles.modalButtons}>
          <button onClick={handleSubmit} className={styles.actionBtn}>저장</button>
          <button onClick={onClose} className={styles.actionBtn}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default AddMealModal;