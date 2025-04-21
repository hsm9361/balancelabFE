import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/pages/DietAnalysisPage.module.css';
import FoodInputSection from '../../components/dietAnalysis/FoodInputSection';
import ErrorModal from '../../components/dietAnalysis/ErrorModal';
import dietImage1 from '../../assets/images/diet-placeholder2.jpg';
import dietImage2 from '../../assets/images/diet-placeholder3.jpg';
import dietImage3 from '../../assets/images/diet-placeholder4.jpg';
import { useDietAnalysis } from '../../hooks/useDietAnalysis';

function DietAnalysisPage() {
  const [message, setMessage] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedExample, setSelectedExample] = useState('');
  const navigate = useNavigate();
  const { analyzeDiet, loading, error } = useDietAnalysis('testUser');
  const textareaRef = useRef(null);

  const handleAnalysis = async () => {
    try {
      const result = await analyzeDiet(message, selectedTime);
      console.log('분석 결과:', result);
      navigate('/analysis/diet-analysis/result', {
        state: { 
          result,
          selectedTime: selectedTime || '점심'
        },
      });
    } catch (err) {
      console.log('에러 발생:', err.message, err);
      // 두 가지 에러 모두 모달로 표시
      if (
        err.message === '분석할 음식이 없습니다. 음식을 추가해 주세요!' ||
        err.message === '입력된 음식이 없습니다.'
      ) {
        setErrorMessage(err.message);
        setShowErrorModal(true);
      } else {
        // 기타 에러는 alert로 유지 (또는 다른 방식으로 처리)
        console.error('기타 분석 에러:', err.message);
        setErrorMessage(err.message);
        alert(`분석 중 오류 발생: ${err.message}`);
      }
    }
  };

  const handleTimeClick = (time) => {
    const text = `${time}으로\n\n먹었어`;
    setMessage(text);
    setSelectedFoods([]);
    setSelectedTime(time);
    setErrorMessage('');
    setSelectedExample('');
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
    const lines = message ? message.split('\n') : ['', '', ''];
    if (lines.length < 3) {
      lines[0] = selectedTime ? `${selectedTime}으로` : '';
      lines[1] = '';
      lines[2] = '먹었어';
    }

    let currentFoods = lines[1].trim().split(',').map(f => f.trim()).filter(f => f);
    if (currentFoods.includes(food)) {
      currentFoods = currentFoods.filter(f => f !== food);
      setSelectedFoods(selectedFoods.filter(f => f !== food));
    } else {
      currentFoods.push(food);
      setSelectedFoods([...selectedFoods, food]);
    }

    lines[1] = currentFoods.join(', ');
    setMessage(lines.join('\n'));
    setErrorMessage('');
    setSelectedExample('');

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
    setSelectedExample(`${time}으로 ${foods} 먹었어`);
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
        <div className={styles.imageContainer}>
          <div className={styles.imagePlaceholder}>
            <img
              src={dietImage1}
              alt="식단 예시 이미지 1"
              className={styles.placeholderImage}
            />
          </div>
          <div className={styles.imagePlaceholder}>
            <img
              src={dietImage2}
              alt="식단 예시 이미지 2"
              className={styles.placeholderImage}
            />
          </div>
          <div className={styles.imagePlaceholder}>
            <img
              src={dietImage3}
              alt="식단 예시 이미지 3"
              className={styles.placeholderImage}
            />
          </div>
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
            className={`${styles.exampleButton} ${selectedExample === `${example.time}으로 ${example.foods} 먹었어` ? styles.selected : ''}`}
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
      
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}

export default DietAnalysisPage;