import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { memberService } from '../../services/memberService';
import 'assets/css/pages/dietConsulting/DietConsulting.css';
import breakfastImg from 'assets/images/breakfast.png';
import lunchImg from 'assets/images/lunch.png';
import dinnerImg from 'assets/images/dinner.png';
import snackImg from 'assets/images/snack.png';
import dietAi from 'assets/images/diet-ai.png';
import useSaveAsPDF from '../../hooks/useSaveAsPDF'; // 훅 임포트

const mealImages = {
  아침: breakfastImg,
  점심: lunchImg,
  저녁: dinnerImg,
  간식: snackImg,
};

function DietConsulting() {
  const navigate = useNavigate();
  const [dietData, setDietData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [memberId, setMemberId] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);

  // useSaveAsPDF 훅 호출
  const { saveAsPDF, isSaving } = useSaveAsPDF('diet-analysis-content', 'diet-recommendation');

  const fetchMemberInfo = async () => {
    try {
      console.log('fetchMemberInfo 시작');
      const data = await memberService.getMemberInfo();
      console.log('fetchMemberInfo 성공:', data);
      setMemberId(data.id);
      setName(data.membername);
    } catch (err) {
      console.error('fetchMemberInfo 에러:', err);
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        navigate('/login');
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
      console.log('fetchDietRecommendation 시작, memberId:', memberId);
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

        console.log('fetch 응답 상태:', response.status);

        if (!response.ok) {
          throw new Error(`식단 추천 요청 실패: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('서버 응답:', result);
        const parsed = result.data;
        setDietData(parsed);
      } catch (error) {
        console.error('fetchDietRecommendation 에러:', error);
        setError(error.message);
        alert(error.message);
      } finally {
        console.log('fetchDietRecommendation 완료');
        setIsLoading(false);
      }
    };

    if (memberId) {
      fetchDietRecommendation();
    } else {
      console.log('memberId 없음, fetchDietRecommendation 스킵');
    }
  }, [memberId]);

  if (error) {
    return (
      <div className="diet-consulting">
        <h1>오류 발생</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
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

  if (!dietData) {
    return (
      <div className="diet-consulting">
        <h1>🙅‍♀️데이터를 불러올 수 없습니다🙅‍♂️</h1>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  const { '건강 위험도 분석': riskAnalysis, '목표 기반 추천': goalRec, '식단 추천': meals, '주의사항': caution } = dietData;

  return (
    <div className="diet-consulting">
      {/* PDF로 저장할 콘텐츠를 감싸는 div에 id 추가 */}
      <div id="diet-analysis-content">
        <h1>{name}님의 식단 추천</h1>
        <img src={dietAi} alt="AI" className="ai-icon" />

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
              {meals?.['아침']?.map((item, index) => (
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
      </div>

      <div className="button-group">
        <button className="back-button" onClick={() => navigate('/healthprediction')}>
          돌아가기
        </button>
        {/* PDF 저장 버튼 추가 */}
        <button
          className="save-pdf-button"
          onClick={saveAsPDF}
          disabled={isSaving}
        >
          {isSaving ? 'PDF 저장 중...' : 'PDF로 저장'}
        </button>
      </div>
    </div>
  );
}

export default DietConsulting;