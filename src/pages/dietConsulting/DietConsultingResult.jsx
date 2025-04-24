import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { memberService } from '../../services/memberService';
import '../../assets/css/pages/dietConsulting/DietConsultingResult.css'
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
  const [memberId, setMemberId] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);

  const fetchMemberInfo = async () => {
    try {
      const data = await memberService.getMemberInfo();
      setMemberId(data.id);
      setName(data.username);
    } catch (err) {
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        return;
      }
      setError('회원 정보를 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  useEffect(() => {
    const fetchDietRecommendation = async () => {
      try {
        setDietData(null);
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/diet/recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: memberId }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('식단 추천을 불러오는데 실패했습니다.');
        }

        const result = await response.json();
        console.log('서버 응답:', result);
        if (typeof result.data === 'string') {
          throw new Error(result.data);
        }
        const parsed = result.data;
        setDietData(parsed);
      } catch (error) {
        console.error('Error fetching diet recommendation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (memberId) {
      fetchDietRecommendation();
    }
  }, [memberId]);

  if (error) {
    return (
      <div className="diet-consulting">
        <h1>오류 발생</h1>
        <p>{error}</p>
        <button className="action-button" onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="diet-consulting">
        <h1>데이터를 불러오는 중...</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!dietData || dietData.error || !dietData['식단 추천']) {
    return (
      <div className="diet-consulting">
        <h1>🙅‍♀️{dietData?.error || '데이터를 불러올 수 없습니다'}🙅‍♂️</h1>
        <button className="action-button" onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  const { '건강 위험도 분석': riskAnalysis, '목표 기반 추천': goalRec, '식단 추천': meals, '주의사항': caution } = dietData;

  const mealTypes = ['아침', '점심', '저녁', '간식'];

  return (
    <div className="diet-consulting">
      <h1>🍽️ {name}님의 식단 추천</h1>

      <div className="analysis-section">
        <h2>건강 위험도 분석</h2>
        <div className="speech-bubble">{riskAnalysis}</div>

        <h2>목표 기반 추천</h2>
        <div className="speech-bubble">{goalRec}</div>

        <h2>식단 추천</h2>
        <div className="meal-recommendations">
          {mealTypes.map((mealType) => (
            <div className="food-recommend" key={mealType}>
              <div className="meal-header">
                <img src={mealImages[mealType]} alt={mealType} className="meal-icon" />
                <h3>
                  {mealType === '아침' && '🥚'}
                  {mealType === '점심' && '🍔'}
                  {mealType === '저녁' && '🍖'}
                  {mealType === '간식' && '🍩'}
                  {mealType}
                </h3>
              </div>
              <ul>
                {meals[mealType]?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2>주의사항</h2>
        <div className="speech-bubble">{caution}</div>
      </div>

      <div className="button-group">
        <button className="action-button" onClick={() => navigate('/healthprediction')}>
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default DietConsulting;