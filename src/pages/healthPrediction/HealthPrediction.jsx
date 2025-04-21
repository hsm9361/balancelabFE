import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';
import HealthPredictionForm from 'components/healthPrediction/HealthPredictionForm';
import { memberService } from '../../services/memberService';

function HealthPrediction() {
  const [isLoading, setIsLoading] = useState(true);
  const [memberId, setMemberId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMemberInfo = async () => {
      try {
        const data = await memberService.getMemberInfo();
        setMemberId(data.id);
      } catch (err) {
        if (err.message === 'Authentication required') {
          localStorage.setItem('redirectPath', window.location.pathname);
          return;
        }
        setError('회원 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchMemberInfo(); // 이 줄이 있어야 memberId를 세팅합니다.
    });
  
  const navigate = useNavigate();

  const handleSubmit = async (inputData) => {
    if (!memberId) {
      alert('회원 정보를 불러오지 못했습니다.');
      return;
    }
  
    const dataWithMemberId = {
      ...inputData,
      memberId, // memberId 추가!
    };
    console.log("넘기는 데이터: "+JSON.stringify(dataWithMemberId, null, 2));

    try {
      const response = await fetch('http://localhost:8080/api/health-prediction/predict', {
        
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithMemberId),
      });
      
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData.detail || '서버 응답 오류');
      }
  
      const predictions = await response.json();
      console.log('Prediction data:', predictions); // 디버깅을 위한 로그
      
      // 입력 데이터와 예측 결과를 함께 전달
      navigate('/healthprediction/result', { 
        state: { 
          inputData:dataWithMemberId,
          predictions
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`예측 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <div className="health-prediction">
      <h1>🧬 질병 예측 시스템</h1>
      <h2>질병 위험군을 예측해보세요!</h2>

      <HealthPredictionForm onSubmit={handleSubmit} />
    </div>
  );
}

export default HealthPrediction; 