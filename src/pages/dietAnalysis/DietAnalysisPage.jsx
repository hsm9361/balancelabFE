import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/DietAnalysisPage.module.css'; // 스타일 임포트
import FoodInputSection from 'components/dietAnalysis/FoodInputSection';
import AnalysisInfoSection from 'components/dietAnalysis/AnalysisInfoSection';

function DietAnalysisPage() {
  const [foodInput, setFoodInput] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (foodInput.trim()) {
      navigate('/dietAnalysis/result', { state: { food: foodInput } });
    }
  };

  return (
    <div className={styles.analysisContainer}>
      <FoodInputSection foodInput={foodInput} setFoodInput={setFoodInput} />
      <AnalysisInfoSection foodInput={foodInput} handleAnalysis={handleAnalyze} />
    </div>
  );
}

export default DietAnalysisPage;
