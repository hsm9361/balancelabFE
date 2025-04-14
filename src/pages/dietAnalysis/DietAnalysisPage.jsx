import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/pages/DietAnalysisPage.module.css';
import FoodInputSection from '../../components/dietAnalysis/FoodInputSection';
import dietImage from '../../assets/images/diet-placeholder.jpg';
import { useDietAnalysis } from '../../hooks/useDietAnalysis';

function DietAnalysisPage() {
  const [message, setMessage] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { analyzeDiet, loading, error } = useDietAnalysis('testUser');
  const textareaRef = useRef(null);

  const handleAnalysis = async () => {
    if (!message.trim()) {
      setErrorMessage('음식을 입력해주세요!');
      return;
    }

    try {
      const result = await analyzeDiet(message);
      navigate('/diet-analysis/result', {
        state: { result },
      });
    } catch (err) {
      navigate('/diet-analysis/error', { state: { error: err.message || '분석에 실패했습니다.' } });
    }
  };

  const handleTimeClick = (time) => {
    const text = `${time}으로\n\n먹었어`;
    setMessage(text);
    setSelectedFoods([]);
    setSelectedTime(time);
    setErrorMessage('');
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        const cursorPosition = text.indexOf('\n') + 1;
        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const handleFoodClick = (food) => {
    if (selectedFoods.includes(food)) return;

    const lines = message ? message.split('\n') : ['', '', ''];
    if (lines.length < 3) {
      setMessage(`\n${food}\n먹었어`);
      setSelectedFoods([food]);
    } else {
      const currentFoods = lines[1].trim();
      lines[1] = currentFoods ? `${currentFoods}, ${food}` : food;
      setMessage(lines.join('\n'));
      setSelectedFoods([...selectedFoods, food]);
    }
    setErrorMessage('');
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const cursorPosition = (lines[0] || '').length + (lines[1] || '').length + 2;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const handleExampleClick = (time, foods) => {
    const text = `${time}으로\n${foods}\n먹었어`;
    setMessage(text);
    setSelectedFoods(foods.split(', '));
    setSelectedTime(time);
    setErrorMessage('');
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const cursorPosition = text.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const popularFoods = [
    '치킨', '김치찌개', '불고기', '라면',
    '김밥', '냉면', '삼겹살', '피자'
  ];

  const examples = [
    { time: '아침', foods: '시리얼, 우유' },
    { time: '점심', foods: '라면, 김밥' },
    { time: '저녁', foods: '삼겹살, 김치찌개' }
  ];

  return (
    <div className={styles.dietAnalysisContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>식단 분석</h1>
        <p className={styles.heroDescription}>
          먹은 음식을 선택하거나 입력하면 AI가 영양 정보를 분석해드립니다.
        </p>
        <div className={styles.imagePlaceholder}>
          <img
            src={dietImage}
            alt="식단 예시 이미지"
            className={styles.placeholderImage}
          />
        </div>
      </div>

      <div className={styles.timeButtons}>
        {['아침', '점심', '저녁', '간식'].map((time) => (
          <button
            key={time}
            className={`${styles.timeButton} ${selectedTime === time ? styles.selected : ''}`}
            onClick={() => handleTimeClick(time)}
            disabled={loading}
          >
            {time}
          </button>
        ))}
      </div>

      <div className={styles.foodGrid}>
        {popularFoods.map((food, index) => (
          <button
            key={index}
            className={`${styles.foodButton} ${selectedFoods.includes(food) ? styles.selected : ''}`}
            onClick={() => handleFoodClick(food)}
            disabled={loading}
          >
            {food}
          </button>
        ))}
      </div>

      <div className={styles.exampleButtons}>
        {examples.map((example, index) => (
          <button
            key={index}
            className={styles.exampleButton}
            onClick={() => handleExampleClick(example.time, example.foods)}
            disabled={loading}
          >
            {`${example.time}으로 ${example.foods} 먹었어`}
          </button>
        ))}
      </div>

      <FoodInputSection
        foodText={message}
        setFoodText={setMessage}
        handleAnalysis={handleAnalysis}
        loading={loading}
        textareaRef={textareaRef}
      />
      {(error || errorMessage) && (
        <p className={styles.errorMessage}>
          {errorMessage || (typeof error === 'string' ? error : '오류가 발생했습니다.')}
        </p>
      )}
    </div>
  );
}

export default DietAnalysisPage;