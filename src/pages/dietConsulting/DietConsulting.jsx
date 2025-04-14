import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'assets/css/pages/dietConsulting/DietConsulting.css';

function DietConsulting() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const email = localStorage.getItem('email')
  
  useEffect(() => {
    const fetchDietRecommendation = async () => {
      try {
        const response = await fetch('http://localhost:8000/diet/recommendation', { // API 엔드포인트
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }), // 이메일만 body에 전송
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('식단 추천을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching diet recommendation:', error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (email) { // 이메일이 있는 경우에만 API 호출
      fetchDietRecommendation();
    }
  }, [email]);

  if (isLoading) {
    return (
      <div className="diet-consulting">
        <h1>데이터를 불러오는 중...</h1>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="diet-consulting">
        <h1>데이터를 불러올 수 없습니다</h1>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }
  return (
    <div className="diet-consulting">
      <h1>🍽️ {email}님의 식단 추천</h1>
      
      <div className="analysis-section">
        <h2>ai의 {email}님을 위한 식단 추천!</h2>
        <div className="speech-bubble">
          {userData}
        </div>
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