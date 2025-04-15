import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../assets/css/pages/DietAnalysisResultPage.module.css';
import FoodList from '../../components/dietAnalysis/FoodList';
import NutritionPerFood from '../../components/dietAnalysis/NutritionPerFood';
import TotalNutrition from '../../components/dietAnalysis/TotalNutrition';
import DeficientNutrients from '../../components/dietAnalysis/DeficientNutrients';
import NextMealSuggestion from '../../components/dietAnalysis/NextMealSuggestion';
import ActionButtons from '../../components/dietAnalysis/ActionButtons';

const DietAnalysisResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

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

  if (!result) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.content}>Loading...</div>
      </div>
    );
  }

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
      <ActionButtons />
    </div>
  );
};

export default DietAnalysisResultPage;