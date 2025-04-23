import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'assets/css/pages/dietConsulting/DietConsulting.css';
import dietImage from 'assets/images/diet-consulting.png';
import dietAi from 'assets/images/diet-ai.png';

function DietConsultIndex() {
  const navigate = useNavigate();

  return (
    <div className="diet-consulting">
      <div className="consult-container">
        <div className='ai-header'>
        <h1>AI 식단 추천</h1>
        <img src={dietAi} alt="AI" className="ai-icon" />
        </div>
        <div className="consult-content">
          <div className="consult-image">
            <img src={dietImage} alt="AI 식단 추천" />
          </div>

          <div className="consult-info">
            <h2>맞춤형 식단 추천을 받아보세요</h2>
            <p className="description">
              AI가 당신의 현재 식단, 예측된 질병 위험도, 목표 체중 등을 분석하여
              최적의 식단을 추천해드립니다.
            </p>

            <div className="analysis-points">
              <div className="point-item">
                <div className="point-icon">🍽️</div>
                <div className="point-text">
                  <h3>현재 식단 분석</h3>
                  <p>1주일간의 식단 기록을 기반으로 분석</p>
                </div>
              </div>
              <div className="point-item">
                <div className="point-icon">⚕️</div>
                <div className="point-text">
                  <h3>질병 위험도 고려</h3>
                  <p>예측된 질병 위험도를 고려한 맞춤 식단</p>
                </div>
              </div>
              <div className="point-item">
                <div className="point-icon">🎯</div>
                <div className="point-text">
                  <h3>목표 체중 기반</h3>
                  <p>목표 체중 달성을 위한 최적의 영양소 배분</p>
                </div>
              </div>
            </div>

            <button 
              className="recommend-button"
              onClick={() => navigate('/diet-consulting/result')}
            >
              AI 식단 추천 받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DietConsultIndex; 