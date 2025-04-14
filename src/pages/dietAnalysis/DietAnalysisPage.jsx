import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisPage.module.css';
import FoodInputSection from 'components/dietAnalysis/FoodInputSection';
import dietImage from 'assets/images/diet-placeholder.jpg';
import { useDietAnalysis } from 'hooks/useDietAnalysis';

function DietAnalysisPage() {
  const [message, setMessage] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedTime, setSelectedTime] = useState(''); // 선택된 시간대 추적
  const navigate = useNavigate();
  const { analyzeDiet, loading, error } = useDietAnalysis('testUser');
  const textareaRef = useRef(null);

  const handleAnalysis = async () => {
    if (!message.trim()) {
      alert('음식을 입력해주세요!');
      return;
    }

    try {
      const result = await analyzeDiet(message);
      navigate('/diet-analysis/result', {
        state: {
          message,
          analysisResult: result,
        },
      });
    } catch (err) {
      console.error('Diet analysis failed:', err);
      navigate('/diet-analysis/error', { state: { error: error || '분석에 실패했습니다.' } });
    }
  };

  // 시간대 버튼 클릭
  const handleTimeClick = (time) => {
    const text = `${time}으로\n\n먹었어`;
    setMessage(text);
    setSelectedFoods([]);
    setSelectedTime(time); // 선택된 시간대 업데이트
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        const cursorPosition = text.indexOf('\n') + 1;
        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  // 음식 버튼 클릭 (중복 방지)
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
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const cursorPosition = (lines[0] || '').length + (lines[1] || '').length + 2;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  // 예시 버튼 클릭
  const handleExampleClick = (time, foods) => {
    const text = `${time}으로\n${foods}\n먹었어`;
    setMessage(text);
    setSelectedFoods(foods.split(', '));
    setSelectedTime(time); // 예시 버튼도 시간대 선택으로 간주
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const cursorPosition = text.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  // 자주 먹는 음식 목록 (2x4 그리드용)
  const popularFoods = [
    '치킨', '김치찌개', '불고기', '라면',
    '김밥', '된장찌개', '삼겹살', '피자'
  ];

  // 예시 목록
  const examples = [
    { time: '아침', foods: '시리얼, 우유' },
    { time: '점심', foods: '라면, 김밥' },
    { time: '저녁', foods: '삼겹살, 된장찌개' }
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

      {/* 시간대 버튼 */}
      <div className={styles.timeButtons}>
        <button
          className={`${styles.timeButton} ${selectedTime === '아침' ? styles.selected : ''}`}
          onClick={() => handleTimeClick('아침')}
          disabled={loading}
        >
          아침
        </button>
        <button
          className={`${styles.timeButton} ${selectedTime === '점심' ? styles.selected : ''}`}
          onClick={() => handleTimeClick('점심')}
          disabled={loading}
        >
          점심
        </button>
        <button
          className={`${styles.timeButton} ${selectedTime === '저녁' ? styles.selected : ''}`}
          onClick={() => handleTimeClick('저녁')}
          disabled={loading}
        >
          저녁
        </button>
        <button
          className={`${styles.timeButton} ${selectedTime === '간식' ? styles.selected : ''}`}
          onClick={() => handleTimeClick('간식')}
          disabled={loading}
        >
          간식
        </button>
      </div>

      {/* 자주 먹는 음식 버튼 (2x4 그리드) */}
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

      {/* 예시 버튼 */}
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
      {error && (
        <p className={styles.errorMessage}>
          {typeof error === 'string' ? error : '오류가 발생했습니다.'}
        </p>
      )}
    </div>
  );
}

export default DietAnalysisPage;
// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from 'assets/css/pages/DietAnalysisPage.module.css';
// import FoodInputSection from 'components/dietAnalysis/FoodInputSection';
// import dietImage from 'assets/images/diet-placeholder.jpg';
// import { useDietAnalysis } from 'hooks/useDietAnalysis';

// function DietAnalysisPage() {
//   const [message, setMessage] = useState('');
//   const [selectedFoods, setSelectedFoods] = useState([]); // 클릭한 메뉴 추적
//   const navigate = useNavigate();
//   const { analyzeDiet, loading, error } = useDietAnalysis('testUser');
//   const textareaRef = useRef(null);

//   const handleAnalysis = async () => {
//     if (!message.trim()) {
//       alert('음식을 입력해주세요!');
//       return;
//     }

//     try {
//       const result = await analyzeDiet(message);
//       navigate('/diet-analysis/result', {
//         state: {
//           message,
//           analysisResult: result,
//         },
//       });
//     } catch (err) {
//       console.error('Diet analysis failed:', err);
//       navigate('/diet-analysis/error', { state: { error: error || '분석에 실패했습니다.' } });
//     }
//   };

//   // 시간대 버튼 클릭
//   const handleTimeClick = (time) => {
//     const text = `${time}으로\n\n먹었어`;
//     setMessage(text);
//     setSelectedFoods([]); // 시간대 변경 시 선택된 음식 초기화
//     setTimeout(() => {
//       const textarea = textareaRef.current;
//       if (textarea) {
//         const cursorPosition = text.indexOf('\n') + 1;
//         textarea.focus();
//         textarea.setSelectionRange(cursorPosition, cursorPosition);
//       }
//     }, 0);
//   };

//   // 음식 버튼 클릭 (중복 방지)
//   const handleFoodClick = (food) => {
//     if (selectedFoods.includes(food)) return; // 이미 선택된 음식이면 추가 안 함

//     const lines = message.split('\n');
//     if (lines.length < 3) {
//       setMessage(`\n${food}\n먹었어`);
//       setSelectedFoods([food]);
//     } else {
//       const currentFoods = lines[1].trim();
//       lines[1] = currentFoods ? `${currentFoods}, ${food}` : food;
//       setMessage(lines.join('\n'));
//       setSelectedFoods([...selectedFoods, food]);
//     }
//     setTimeout(() => {
//       const textarea = textareaRef.current;
//       if (textarea) {
//         textarea.focus();
//         const cursorPosition = lines[0].length + lines[1].length + 2;
//         textarea.setSelectionRange(cursorPosition, cursorPosition);
//       }
//     }, 0);
//   };

//   // 예시 버튼 클릭
//   const handleExampleClick = (time, foods) => {
//     const text = `${time}으로\n${foods}\n먹었어`;
//     setMessage(text);
//     setSelectedFoods(foods.split(', ')); // 선택된 음식으로 설정
//     setTimeout(() => {
//       const textarea = textareaRef.current;
//       if (textarea) {
//         textarea.focus();
//         const cursorPosition = text.length; // 텍스트 끝으로 커서 이동
//         textarea.setSelectionRange(cursorPosition, cursorPosition);
//       }
//     }, 0);
//   };

//   // 자주 먹는 음식 목록 (2x4 그리드용)
//   const popularFoods = [
//     '치킨', '김치찌개', '불고기', '라면',
//     '김밥', '된장찌개', '삼겹살', '피자'
//   ];

//   // 예시 목록
//   const examples = [
//     { time: '아침', foods: '시리얼, 우유' },
//     { time: '점심', foods: '라면, 김밥' },
//     { time: '저녁', foods: '삼겹살, 된장찌개' }
//   ];

//   return (
//     <div className={styles.dietAnalysisContainer}>
//       <div className={styles.heroSection}>
//         <h1 className={styles.heroTitle}>식단 분석</h1>
//         <p className={styles.heroDescription}>
//           먹은 음식을 선택하거나 입력하면 AI가 영양 정보를 분석해드립니다.
//         </p>
//         <div className={styles.imagePlaceholder}>
//           <img
//             src={dietImage}
//             alt="식단 예시 이미지"
//             className={styles.placeholderImage}
//           />
//         </div>
//       </div>

//       {/* 시간대 버튼 */}
//       <div className={styles.timeButtons}>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('아침')} disabled={loading}>
//           아침
//         </button>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('점심')} disabled={loading}>
//           점심
//         </button>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('저녁')} disabled={loading}>
//           저녁
//         </button>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('간식')} disabled={loading}>
//           간식
//         </button>
//       </div>

//       {/* 자주 먹는 음식 버튼 (2x4 그리드) */}
//       <div className={styles.foodGrid}>
//         {popularFoods.map((food, index) => (
//           <button
//             key={index}
//             className={`${styles.foodButton} ${selectedFoods.includes(food) ? styles.selected : ''}`}
//             onClick={() => handleFoodClick(food)}
//             disabled={loading}
//           >
//             {food}
//           </button>
//         ))}
//       </div>

//       {/* 예시 버튼 */}
//       <div className={styles.exampleButtons}>
//         {examples.map((example, index) => (
//           <button
//             key={index}
//             className={styles.exampleButton}
//             onClick={() => handleExampleClick(example.time, example.foods)}
//             disabled={loading}
//           >
//             {`${example.time}으로 ${example.foods} 먹었어`}
//           </button>
//         ))}
//       </div>

//       <FoodInputSection
//         foodText={message}
//         setFoodText={setMessage}
//         handleAnalysis={handleAnalysis}
//         loading={loading}
//         textareaRef={textareaRef}
//       />
//       {error && (
//         <p className={styles.errorMessage}>
//           {typeof error === 'string' ? error : '오류가 발생했습니다.'}
//         </p>
//       )}
//     </div>
//   );
// }

// export default DietAnalysisPage;

//--------------------------------------------------------------------------------
// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from 'assets/css/pages/DietAnalysisPage.module.css';
// import FoodInputSection from 'components/dietAnalysis/FoodInputSection';
// import dietImage from 'assets/images/diet-placeholder.jpg';
// import { useDietAnalysis } from 'hooks/useDietAnalysis';

// function DietAnalysisPage() {
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const { analyzeDiet, loading, error } = useDietAnalysis('testUser');
//   const textareaRef = useRef(null);

//   const handleAnalysis = async () => {
//     if (!message.trim()) {
//       alert('음식을 입력해주세요!');
//       return;
//     }

//     try {
//       const result = await analyzeDiet(message);
//       navigate('/diet-analysis/result', {
//         state: {
//           message,
//           analysisResult: result,
//         },
//       });
//     } catch (err) {
//       console.error('Diet analysis failed:', err);
//       navigate('/diet-analysis/error', { state: { error: error || '분석에 실패했습니다.' } });
//     }
//   };

//   // 시간대 버튼 클릭
//   const handleTimeClick = (time) => {
//     const text = `${time}으로\n\n먹었어`;
//     setMessage(text);
//     setTimeout(() => {
//       const textarea = textareaRef.current;
//       if (textarea) {
//         const cursorPosition = text.indexOf('\n') + 1; // 첫 번째 줄바꿈 후 위치
//         textarea.focus();
//         textarea.setSelectionRange(cursorPosition, cursorPosition);
//       }
//     }, 0);
//   };

//   // 음식 버튼 클릭 (추가 방식)
//   const handleFoodClick = (food) => {
//     const lines = message.split('\n');
//     if (lines.length < 3) {
//       // 초기 상태일 때
//       setMessage(`\n${food}\n먹었어`);
//     } else {
//       // 기존 음식이 있으면 쉼표로 추가
//       const currentFoods = lines[1].trim();
//       lines[1] = currentFoods ? `${currentFoods}, ${food}` : food;
//       setMessage(lines.join('\n'));
//     }
//     setTimeout(() => {
//       const textarea = textareaRef.current;
//       if (textarea) {
//         textarea.focus();
//         const cursorPosition = lines[0].length + lines[1].length + 2; // 음식 끝 위치
//         textarea.setSelectionRange(cursorPosition, cursorPosition);
//       }
//     }, 0);
//   };

//   // 자주 먹는 음식 목록 (2x4 그리드용)
//   const popularFoods = [
//     '치킨', '김치찌개', '불고기', '라면',
//     '김밥', '된장찌개', '삼겹살', '피자'
//   ];

//   return (
//     <div className={styles.dietAnalysisContainer}>
//       <div className={styles.heroSection}>
//         <h1 className={styles.heroTitle}>식단 분석</h1>
//         <p className={styles.heroDescription}>
//           먹은 음식을 선택하거나 입력하면 AI가 영양 정보를 분석해드립니다.
//         </p>
//         <div className={styles.imagePlaceholder}>
//           <img
//             src={dietImage}
//             alt="식단 예시 이미지"
//             className={styles.placeholderImage}
//           />
//         </div>
//       </div>

//       {/* 시간대 버튼 */}
//       <div className={styles.timeButtons}>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('아침')} disabled={loading}>
//           아침
//         </button>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('점심')} disabled={loading}>
//           점심
//         </button>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('저녁')} disabled={loading}>
//           저녁
//         </button>
//         <button className={styles.timeButton} onClick={() => handleTimeClick('간식')} disabled={loading}>
//           간식
//         </button>
//       </div>

//       {/* 자주 먹는 음식 버튼 (2x4 그리드) */}
//       <div className={styles.foodGrid}>
//         {popularFoods.map((food, index) => (
//           <button
//             key={index}
//             className={styles.foodButton}
//             onClick={() => handleFoodClick(food)}
//             disabled={loading}
//           >
//             {food}
//           </button>
//         ))}
//       </div>

//       <FoodInputSection
//         foodText={message}
//         setFoodText={setMessage}
//         handleAnalysis={handleAnalysis}
//         loading={loading}
//         textareaRef={textareaRef}
//       />
//       {error && (
//         <p className={styles.errorMessage}>
//           {typeof error === 'string' ? error : '오류가 발생했습니다.'}
//         </p>
//       )}
//     </div>
//   );
// }

// export default DietAnalysisPage;
