import React, { useState } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';

function AddMealModal({ onClose, onSubmit }) {
  const [mealType, setMealType] = useState('morning');
  const [menus, setMenus] = useState([{ name: '', servings: 1 }]);

  const handleMenuChange = (index, field, value) => {
    const updated = [...menus];
    updated[index][field] = field === 'servings' ? parseInt(value) : value;
    setMenus(updated);
  };

  const handleAddMenu = () => {
    if (menus.length < 3) {
      setMenus([...menus, { name: '', servings: 1 }]);
    }
  };

  const handleSubmit = () => {
    const cleaned = menus.filter(m => m.name.trim());
    if (cleaned.length === 0) return;

    onSubmit(mealType, cleaned);
    setMealType('morning');
    setMenus([{ name: '', servings: 1 }]);
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

        {menus.map((menu, index) => (
          <div key={index} style={{ marginBottom: '0.8rem' }}>
            <label>
              메뉴 {index + 1}:
              <input
                type="text"
                value={menu.name}
                onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                placeholder="메뉴명을 입력하세요"
                style={{ marginRight: '0.5rem', width: '60%' }}
              />
            </label>
            <label>
              <select
                value={menu.servings}
                onChange={(e) => handleMenuChange(index, 'servings', e.target.value)}
              >
                <option value="1">1인분</option>
                <option value="2">2인분</option>
                <option value="3">3인분</option>
              </select>
            </label>
          </div>
        ))}

        {menus.length < 3 && (
          <button onClick={handleAddMenu} className={styles.actionBtn}>
            + 메뉴 추가하기
          </button>
        )}

        <div className={styles.modalButtons}>
          <button onClick={handleSubmit} className={styles.actionBtn}>저장</button>
          <button onClick={onClose} className={styles.actionBtn}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default AddMealModal;
