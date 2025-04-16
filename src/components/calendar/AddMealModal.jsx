import React, { useState } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import axios from 'axios';
import apiClient from '../../services/apiClient';
import dietIcon from 'assets/images/diary.png';

function AddMealModal({ onClose, onSubmit, selectedDate }) {
  const [menus, setMenus] = useState([{ name: '', grams: '' }]);
  const [unitTypes, setUnitTypes] = useState(['g']);
  const [time, setTime] = useState('12:00 ~ 13:00');
  const [showTimeGrid, setShowTimeGrid] = useState(false);

  const handleMenuChange = (index, field, value) => {
    const updated = [...menus];
    updated[index][field] = value;
    setMenus(updated);
  };

  const handleAddMenu = () => {
    if (menus.length < 8) {
      setMenus([...menus, { name: '', grams: '' }]);
      setUnitTypes([...unitTypes, 'g']);
    }
  };

  const handleRemoveMenu = (index) => {
    if (menus.length > 1) {
      const updated = menus.filter((_, i) => i !== index);
      const updatedUnits = unitTypes.filter((_, i) => i !== index);
      setMenus(updated);
      setUnitTypes(updatedUnits);
    }
  };

  const toggleUnitType = (index) => {
    const updatedUnits = [...unitTypes];
    updatedUnits[index] = updatedUnits[index] === 'g' ? '인분' : 'g';
    setUnitTypes(updatedUnits);
  };

  const handleTimeSelect = (startHour) => {
    const endHour = (startHour + 1) % 24;
    const formattedStart = String(startHour).padStart(2, '0');
    const formattedEnd = String(endHour).padStart(2, '0');
    setTime(`${formattedStart}:00 ~ ${formattedEnd}:00`);
    setShowTimeGrid(false);
  };

  const handleSubmit = () => {
    const [startTime, endTime] = time.split(' ~ ');
    const category = `${startTime}~${endTime}`;
    
    const cleaned = menus.map((m, i) => ({
      foodName: m.name.trim(),
      intakeAmount: parseFloat(m.grams),
      unit: unitTypes[i],
      category: category,
      eatenDate: new Date(selectedDate).toISOString()
    })).filter(m => m.foodName && m.intakeAmount);
  
    if (cleaned.length === 0) return;
  
    apiClient.post('/api/diet/save', cleaned)
      .then(() => {
        alert('저장 성공!');
        setMenus([{ name: '', grams: '' }]);
        setUnitTypes(['g']);
        setTime('12:00 ~ 13:00');
        onSubmit('meal', cleaned);
      })
      .catch(err => {
        console.error('저장 실패:', err);
        alert('저장 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <img src={dietIcon} alt="식단 아이콘" className={styles.modalIcon} />
          <h3>식단 기록 추가</h3>
        </div>

        <div className={styles.timeSelector}>
          <input
            type="text"
            value={time}
            readOnly
            className={styles.timeDisplay}
            onClick={() => setShowTimeGrid(true)}
          />
          {showTimeGrid && (
            <div className={styles.timeGrid}>
              {Array.from({ length: 24 }, (_, i) => {
                const startHour = String(i).padStart(2, '0');
                const endHour = String((i + 1) % 24).padStart(2, '0');
                return (
                  <button
                    key={i}
                    onClick={() => handleTimeSelect(i)}
                    className={styles.timeButton}
                  >
                    {startHour}:00 ~ {endHour}:00
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.menuGrid}>
          {menus.map((menu, index) => (
            <div key={index} className={styles.menuItem}>
              <div className={styles.menuInputs}>
                <input
                  type="text"
                  value={menu.name}
                  onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                  placeholder="음식 이름"
                  className={styles.foodNameInput}
                />
                <div className={styles.amountInput}>
                  <input
                    type="number"
                    value={menu.grams}
                    onChange={(e) => handleMenuChange(index, 'grams', e.target.value)}
                    placeholder="수량"
                    className={styles.amountNumberInput}
                  />
                  <button
                    type="button"
                    onClick={() => toggleUnitType(index)}
                    className={styles.unitToggleButton}
                  >
                    {unitTypes[index]}
                  </button>
                  {menus.length > 1 && (
                    <button 
                      onClick={() => handleRemoveMenu(index)}
                      className={styles.removeButton}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {menus.length < 8 && (
          <button onClick={handleAddMenu} className={styles.addMenuButton}>
            <span className={styles.plusIcon}>+</span> 메뉴 추가하기
          </button>
        )}

        <div className={styles.modalButtons}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            저장
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMealModal;