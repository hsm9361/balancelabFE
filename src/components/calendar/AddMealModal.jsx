import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/pages/calendar/calendarPage.module.css';
import apiClient from '../../services/apiClient';
import dietIcon from 'assets/images/diary.png';

function AddDietModal({ onClose, onSubmit, selectedDate, initialFoodList = [], 
  selectedTime = '점심', type='text' }) {
  // 날짜 포맷팅 함수 (useState 이전에 정의)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [menus, setMenus] = useState([{ name: '', grams: '1' }]);
  const [unitTypes, setUnitTypes] = useState(['인분']);
  const [time, setTime] = useState('12:00 ~ 13:00');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [date, setDate] = useState(() => {
    // selectedDate가 있으면 사용, 없으면 오늘 날짜
    const today = new Date();
    return selectedDate ? formatDate(new Date(selectedDate)) : formatDate(today);
  });

  const navigate = useNavigate();

  // initialFoodList로 menus 초기화
  useEffect(() => {
    if (initialFoodList.length > 0) {
      const initialMenus = initialFoodList.map(food => ({
        name: food,
        grams: '1'
      }));
      setMenus(initialMenus);
      setUnitTypes(new Array(initialMenus.length).fill('인분'));
    }
  }, [initialFoodList]);

  // 선택된 시간대에 따라 초기 시간 설정
  useEffect(() => {
    switch (selectedTime) {
      case '아침':
        setTime('08:00 ~ 09:00');
        break;
      case '점심':
        setTime('12:00 ~ 13:00');
        break;
      case '저녁':
        setTime('18:00 ~ 19:00');
        break;
      case '간식':
        setTime('14:00 ~ 15:00');
        break;
      default:
        setTime('12:00 ~ 13:00');
    }
  }, [selectedTime]);

  const handleMenuChange = (index, field, value) => {
    const updated = [...menus];
    updated[index][field] = value;
    setMenus(updated);
  };

  const handleAddMenu = () => {
    if (menus.length < 8) {
      setMenus([...menus, { name: '', grams: '1' }]);
      setUnitTypes([...unitTypes, '인분']);
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
    setShowTimeDropdown(false);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = () => {
    const cleaned = menus.map((m, i) => ({
      foodName: m.name.trim(),
      amount: parseFloat(m.grams),
      unit: unitTypes[i] === '인분' ? 'serving' : 'g',
      mealTime: time,
      type: type,
      consumedDate: new Date(date).toISOString() // consumedDate로 변경
    })).filter(m => m.foodName && m.amount);

    if (cleaned.length === 0) return;

    apiClient.post('/food-record/create', cleaned)
      .then(() => {
        alert('저장 성공!');
        setMenus([{ name: '', grams: '1' }]);
        setUnitTypes(['인분']);
        setTime('12:00 ~ 13:00');
        setDate(formatDate(new Date(selectedDate || new Date())));
        navigate('/calendar', { state: { viewMode: 'month' }, replace: true });
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

        <div className={styles.timeDateSelector}>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className={styles.dateDisplay}
          />
          <div className={styles.timeSelector}>
            <input
              type="text"
              value={time}
              readOnly
              className={styles.timeDisplay}
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            />
            {showTimeDropdown && (
              <div className={styles.timeDropdown}>
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

export default AddDietModal;