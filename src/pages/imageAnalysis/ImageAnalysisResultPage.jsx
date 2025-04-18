import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../assets/css/pages/ImageAnalysisResultPage.module.css';
import ActionButtons from '../../components/dietAnalysis/ActionButtons';

import ResultImage from '../../components/imageAnalysis/ResultImage';
import FoodList from '../../components/dietAnalysis/FoodList';
import NutritionPerFood from '../../components/dietAnalysis/NutritionPerFood';
import TotalNutrition from '../../components/dietAnalysis/TotalNutrition';
import DeficientNutrients from '../../components/dietAnalysis/DeficientNutrients';
import NextMealSuggestion from '../../components/dietAnalysis/NextMealSuggestion';
import AddDietModal from '../../components/calendar/AddMealModal';
import { FaUtensils } from 'react-icons/fa';

const ImageAnalysisResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const processAnalysisResult = useCallback((state) => {
    if (!state?.analysisResult) throw new Error('No analysis result provided');
    const analysisData = state.analysisResult;
    return {
      food_list: analysisData.nutrition_data?.map(item => item.food) || [],
      nutrition_per_food: analysisData.nutrition_data || [],
      total_nutrition: analysisData.total_nutrition || {},
      deficient_nutrients: analysisData.deficient_nutrients || [],
      next_meal_suggestion: analysisData.next_meal_suggestion || [],
      image_url: state.imageUrl || '',
    };
  }, []);

  useEffect(() => {
    try {
      const resultData = processAnalysisResult(location.state);
      setResult(resultData);
    } catch (err) {
      setError(err.message);
      navigate(-1, { replace: true });
    }
  }, [location.state, navigate, processAnalysisResult]);

  const getSelectedTime = () => {
    return location.state?.selectedTime || '점심';
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitMeal = (mealType, foodList) => {
    console.log('Meal submitted:', { mealType, foodList });
    setIsModalOpen(false);
    // TODO: API 저장
  };

  if (error) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.content}>
          <h2>오류 발생</h2>
          <p>{error}</p>
          <button className={styles.actionButton} onClick={() => navigate(-1)}>
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return <div className={styles.resultContainer}>분석 데이터를 불러오는 중...</div>;
  }

  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.title}>당신의 식단 분석</h1>
      <div id="image-analysis-content" className={`${styles.content} pdf-capture`}>
        <ResultImage imageUrl={result.image_url} />
        <div className={styles.section}><FoodList foodList={result.food_list} /></div>
        <div className={styles.section}><NutritionPerFood nutritionPerFood={result.nutrition_per_food} /></div>
        <div className={styles.section}><TotalNutrition totalNutrition={result.total_nutrition} /></div>
        <div className={styles.section}><DeficientNutrients deficientNutrients={result.deficient_nutrients} /></div>
        <div className={styles.section}><NextMealSuggestion nextMealSuggestion={result.next_meal_suggestion} /></div>
      </div>

      <ActionButtons
        targetId="image-analysis-content"
        pdfFileName="image-analysis-result.pdf"
        additionalButton={
          <button className={styles.actionButton} onClick={handleOpenModal}>
            <FaUtensils style={{ marginRight: '8px' }} />
            식단 추가하기
          </button>
        }
      />

      {isModalOpen && (
        <AddDietModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitMeal}
          selectedDate={new Date()}
          initialFoodList={result.food_list}
          selectedTime={getSelectedTime()}
        />
      )}
    </div>
  );
};

export default ImageAnalysisResultPage;
