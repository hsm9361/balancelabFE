import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'assets/css/pages/dietConsulting/DietConsulting.css';
import breakfastImg from 'assets/images/breakfast.png';
import lunchImg from 'assets/images/lunch.png';
import dinnerImg from 'assets/images/dinner.png';
import snackImg from 'assets/images/snack.png';

const mealImages = {
  아침: breakfastImg,
  점심: lunchImg,
  저녁: dinnerImg,
  간식: snackImg,
};

function DietConsulting() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dietData, setDietData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchDietRecommendation = async () => {
      try {
        const response = await fetch('http://localhost:8000/diet/recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('식단 추천을 불러오는데 실패했습니다.');
        }

        const result = await response.json();
        const parsed = result.data; // 문자열로 된 JSON을 파싱
        setDietData(parsed);
        
      } catch (error) {
        console.error('Error fetching diet recommendation:', error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      fetchDietRecommendation();
    }
  }, [email]);

  if (isLoading) {
    return (
      <div className="diet-consulting">
        <h1>데이터를 불러오는 중...</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const { "건강 위험도 분석": riskAnalysis, "목표 기반 추천": goalRec, "식단 추천": meals, "주의사항": caution } = dietData;

  if (!dietData) {
    return (
      <div className="diet-consulting">
        <h1>🙅‍♀️데이터를 불러올 수 없습니다🙅‍♂️</h1>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  

  return (
    <div className="diet-consulting">
      <h1>🍽️ {email}님의 식단 추천</h1>

      <div className="analysis-section">
        <h2>건강 위험도 분석</h2>
        <div className="speech-bubble">{riskAnalysis}</div>

        <h2>목표 기반 추천</h2>
        <div className="speech-bubble">{goalRec}</div>

        <h2>식단 추천</h2>
        <div className="food-recommend">
        <div className="meal-header">
          <img src={mealImages['아침']} alt="Breakfast" className="meal-icon" />
          <h3>🥚아침</h3>
        </div>
        <ul>
          {meals['아침']?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="food-recommend">
        <div className="meal-header">
          <img src={mealImages['점심']} alt="Lunch" className="meal-icon" />
          <h3>🍔점심</h3>
        </div>
        <ul>
          {meals['점심']?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="food-recommend">
        <div className="meal-header">
          <img src={mealImages['저녁']} alt="Dinner" className="meal-icon" />
          <h3>🍖저녁</h3>
        </div>
        <ul>
          {meals['저녁']?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="food-recommend">
        <div className="meal-header">
          <img src={mealImages['간식']} alt="Snack" className="meal-icon" />
          <h3>🍩간식</h3>
        </div>
        <ul>
          {meals['간식']?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

        <h2>주의사항</h2>
        <div className="speech-bubble">{caution}</div>
      </div>

      <div className="button-group">
        <button 
          className="back-button"
          onClick={() => navigate('/healthprediction')}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default DietConsulting;
