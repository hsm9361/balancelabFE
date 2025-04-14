import React, { useState } from 'react';
import styles from 'assets/css/pages/calendar/calendarPage.module.css';
import axios from 'axios';

function AddMealModal({ onClose, onSubmit }) {
  const [mealType, setMealType] = useState('morning');
  const [menus, setMenus] = useState([{ name: '', grams: '' }]);
  const [unitTypes, setUnitTypes] = useState(['g']); // 기본 단위

  const handleMenuChange = (index, field, value) => {
    const updated = [...menus];
    updated[index][field] = value;
    setMenus(updated);
  };

  const handleAddMenu = () => {
    if (menus.length < 3) {
      setMenus([...menus, { name: '', grams: '' }]);
      setUnitTypes([...unitTypes, 'g']); // 새 메뉴 단위도 기본 g로 추가
    }
  };

  const toggleUnitType = (index) => {
    const updatedUnits = [...unitTypes];
    updatedUnits[index] = updatedUnits[index] === 'g' ? '인분' : 'g';
    setUnitTypes(updatedUnits);
  };

  const handleSubmit = () => {
    const cleaned = menus.map((m, i) => ({
      foodName: m.name.trim(),
      intakeAmount: parseFloat(m.grams),
      unit: unitTypes[i],
      category: mealType,
      eatenDate: new Date().toISOString() // 현재 날짜/시간
    })).filter(m => m.foodName && m.intakeAmount);
  
    if (cleaned.length === 0) return;
  
    axios.post('/api/diet/save?userId=1', cleaned)
      .then(() => {
        alert('저장 성공!');
        setMealType('morning');
        setMenus([{ name: '', grams: '' }]);
        setUnitTypes(['g']);
        onSubmit(mealType, cleaned); // 성공 후 부모로 결과 넘김
      })
      .catch(err => {
        console.error('저장 실패:', err);
        alert('저장 중 오류가 발생했습니다.');
      });
  };
  

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>기록 추가</h3>

        <label>
          식사 시간:
          <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
            <option value="morning">아침 (09:00~11:00)</option>
            <option value="lunch">점심 (12:00~15:00)</option>
            <option value="dinner">저녁 (18:00~20:00)</option>
          </select>
        </label>

        {menus.map((menu, index) => {
          const menuLabel = ['Main Menu', 'Sub Menu', 'Desert'][index] || `메뉴 ${index + 1}`;

          return (
            <div key={index} style={{ marginBottom: '0.8rem' }}>
              <label>
                {menuLabel}:
                <input
                  type="text"
                  value={menu.name}
                  onChange={(e) => handleMenuChange(index, 'name', e.target.value)}
                  placeholder={`예: ${menuLabel}`}
                  style={{ marginRight: '0.5rem', width: '60%' }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={menu.grams}
                  onChange={(e) => handleMenuChange(index, 'grams', e.target.value)}
                  placeholder={`${unitTypes[index]} 단위`}
                  style={{ width: '80px' }}
                />
                <span>{unitTypes[index]}</span>
                <button
                  type="button"
                  onClick={() => toggleUnitType(index)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.5rem',
                    background: '#eee',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    cursor: 'pointer'
                  }}
                >
                  {unitTypes[index] === 'g' ? '인분' : 'g'}
                </button>
              </label>
            </div>
          );
        })}

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