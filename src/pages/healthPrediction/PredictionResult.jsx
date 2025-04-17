import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { memberService } from '../../services/memberService';
import HealthPredictionResults from 'components/healthPrediction/HealthPredictionResults';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';

function PredictionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputData, predictions } = location.state || {};
  const [isSaving, setIsSaving] = useState(false);
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
    console.log('Received data:', { inputData, predictions }); // 디버깅을 위한 로그
  }, [inputData, predictions]);

  useEffect(() => {
    fetchMemberInfo(); // 이 줄이 있어야 memberId를 세팅합니다.
  }, [inputData, predictions]);

  
  console.log("아이디"+memberId)

  const handleConsultClick = async () => {
    try {
      setIsSaving(true);
      
      // 저장할 데이터 구성
      const saveData = {
        ...inputData,
        diabetesProba: predictions.diabetes,
        hypertensionProba: predictions.hypertension,
        cvdProba: predictions.cardiovascular,
        id:memberId
      };
      console.log(saveData)
      // 저장 요청
      const response = await fetch('http://localhost:8080/api/health-prediction/savePrediction', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      if (response.status === 401) {
        // 인증되지 않은 경우 로그인 페이지로 이동
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
        return;
      }

      if (!response.ok) {
        throw new Error('예측 결과 저장에 실패했습니다.');
      }

      navigate('/diet-consulting');
    } catch (error) {
      console.error('Error saving predictions:', error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!predictions) {
    return (
      <div className="health-prediction">
        <h1>결과를 찾을 수 없습니다</h1>
        <button onClick={() => navigate('/healthprediction')}>돌아가기</button>
      </div>
    );
  }

  return (
    <div className="health-prediction">
      <h1>🧬 질병 예측 결과</h1>
      <HealthPredictionResults predictions={predictions} />
      <div className="button-group">
        <button 
          className="back-button"
          onClick={() => navigate('/healthprediction')}
        >
          돌아가기
        </button>
        <button 
          className="consult-button"
          onClick={handleConsultClick}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '저장 후 AI에게 상담받기'}
        </button>
      </div>
    </div>
  );
}

export default PredictionResult; 