import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from 'assets/css/pages/ImageAnalysisResultPage.module.css';
import ResultImage from 'components/imageAnalysis/ResultImage';
import NutritionTable from 'components/imageAnalysis/NutritionTable';
import AdditionalInfo from 'components/imageAnalysis/AdditionalInfo';
import nutritionData from 'data/nutritionData.json';
import foodPlate1 from 'assets/images/food-plate1.jpg';

function ImageAnalysisResultPage() {
  const location = useLocation();
  
  // location.state.analysisData가 nutrition_data를 포함하는지 확인
  const hasValidAnalysisData = location.state?.analysisData && 
    Array.isArray(location.state.analysisData.nutrition_data) && 
    location.state.analysisData.nutrition_data.length > 0;

  const analysisData = hasValidAnalysisData 
    ? location.state.analysisData 
    : { ...nutritionData, image_url: foodPlate1 };
  
  const imageUrl = analysisData.image_url || '';
  const nutritionItems = Array.isArray(analysisData.nutrition_data) 
    ? analysisData.nutrition_data 
    : [];

  console.log('nutritionData (imported):', nutritionData);
  console.log('location.state:', location.state);
  console.log('hasValidAnalysisData:', hasValidAnalysisData);
  console.log('analysisData:', analysisData);
  console.log('nutritionItems:', nutritionItems);

  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.title}>당신의 식단 분석</h1>
      <div className={styles.content}>
        <ResultImage imageUrl={imageUrl} />
        <NutritionTable nutritionData={nutritionItems} />
        <AdditionalInfo nutritionData={nutritionItems} />
      </div>
    </div>
  );
}

export default ImageAnalysisResultPage;