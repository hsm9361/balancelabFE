import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../assets/css/pages/DietAnalysisResultPage.module.css';
import FoodList from '../../components/dietAnalysis/FoodList';
import NutritionPerFood from '../../components/dietAnalysis/NutritionPerFood';
import TotalNutrition from '../../components/dietAnalysis/TotalNutrition';
import DeficientNutrients from '../../components/dietAnalysis/DeficientNutrients';
import NextMealSuggestion from '../../components/dietAnalysis/NextMealSuggestion';
import ActionButtons from '../../components/dietAnalysis/ActionButtons';
import AddDietModal from '../../components/calendar/AddMealModal';

const DietAnalysisResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log('Location state:', location.state);
    if (location.state && location.state.result) {
      const resultData = location.state.result.data || location.state.result;
      console.log('Result data:', resultData);
      setResult(resultData);
    } else {
      console.warn('No result data found, navigating back');
      navigate(-1);
    }
  }, [location, navigate]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitMeal = (mealType, foodList) => {
    console.log('Meal submitted:', { mealType, foodList });
    setIsModalOpen(false);
  };

  if (!result) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.content}>Loading...</div>
      </div>
    );
  }

  // 메시지에서 시간대 추출
  const getSelectedTime = () => {
    if (location.state && location.state.selectedTime) {
      return location.state.selectedTime;
    }
    return '점심'; // 기본값
  };

  console.log('Props to components:', {
    foodList: result.food_list,
    nutritionPerFood: result.nutrition_per_food,
    totalNutrition: result.total_nutrition,
    deficientNutrients: result.deficient_nutrients,
    nextMealSuggestion: result.next_meal_suggestion,
  });

  return (
    <div className={styles.resultContainer}>
      <div id="diet-analysis-content" className={`${styles.content} pdf-capture`}>
        <h1 className={styles.title}>식단 분석 결과</h1>
        <div className={styles.section}>
          <FoodList foodList={result.food_list || []} />
        </div>
        <div className={styles.section}>
          <NutritionPerFood nutritionPerFood={result.nutrition_per_food || []} />
        </div>
        <div className={styles.section}>
          <TotalNutrition totalNutrition={result.total_nutrition || {}} />
        </div>
        <div className={styles.section}>
          <DeficientNutrients deficientNutrients={result.deficient_nutrients || []} />
        </div>
        <div className={styles.section}>
          <NextMealSuggestion nextMealSuggestion={result.next_meal_suggestion || []} />
        </div>
      </div>
      <div className={styles.actionButtons}>
        <ActionButtons 
          additionalButton={
            <button onClick={handleOpenModal} className={styles.addMealButton}>
              식단 추가하기
            </button>
          }
        />
      </div>
      {isModalOpen && (
        <AddDietModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitMeal}
          selectedDate={new Date()}
          initialFoodList={result.food_list || []}
          selectedTime={getSelectedTime()}
          type='text'
        />
      )}
    </div>
  );
};

export default DietAnalysisResultPage;