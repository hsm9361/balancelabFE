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
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import styles from '../../assets/css/pages/DietAnalysisResultPage.module.css';
// import FoodList from '../../components/dietAnalysis/FoodList';
// import NutritionPerFood from '../../components/dietAnalysis/NutritionPerFood';
// import TotalNutrition from '../../components/dietAnalysis/TotalNutrition';
// import DeficientNutrients from '../../components/dietAnalysis/DeficientNutrients';
// import NextMealSuggestion from '../../components/dietAnalysis/NextMealSuggestion';
// import ActionButtons from '../../components/dietAnalysis/ActionButtons';

// const DietAnalysisResultPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     console.log('Location state:', location.state);
//     if (location.state && location.state.result) {
//       const resultData = location.state.result.data || location.state.result;
//       console.log('Result data:', resultData);
//       setResult(resultData);
//     } else {
//       console.warn('No result data found, navigating back');
//       navigate(-1);
//     }
//   }, [location, navigate]);

//   if (!result) {
//     return (
//       <div className={styles.resultContainer}>
//         <div className={styles.content}>Loading...</div>
//       </div>
//     );
//   }

//   console.log('Props to components:', {
//     foodList: result.food_list,
//     nutritionPerFood: result.nutrition_per_food,
//     totalNutrition: result.total_nutrition,
//     deficientNutrients: result.deficient_nutrients,
//     nextMealSuggestion: result.next_meal_suggestion,
//   });

//   return (
//     <div className={styles.resultContainer}>
//       <div id="diet-analysis-content" className={styles.content}>
//         <h1 className={styles.title}>식단 분석 결과</h1>
//         <div className={styles.section}>
//           <FoodList foodList={result.food_list || []} />
//         </div>
//         <div className={styles.section}>
//           <NutritionPerFood nutritionPerFood={result.nutrition_per_food || []} />
//         </div>
//         <div className={styles.section}>
//           <TotalNutrition totalNutrition={result.total_nutrition || {}} />
//         </div>
//         <div className={styles.section}>
//           <DeficientNutrients deficientNutrients={result.deficient_nutrients || []} />
//         </div>
//         <div className={styles.section}>
//           <NextMealSuggestion nextMealSuggestion={result.next_meal_suggestion || []} />
//         </div>
//       </div>
//       <ActionButtons />
//     </div>
//   );
// };

// export default DietAnalysisResultPage;
// ------------------------------------------------------------------------------
// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import styles from 'assets/css/pages/DietAnalysisResultPage.module.css';

// function DietAnalysisResultPage() {
//   const location = useLocation();
//   const { message, analysisResult } = location.state || { message: null, analysisResult: null };

//   useEffect(() => {
//     console.log('Diet analysis result updated:', analysisResult);
//   }, [analysisResult]);

//   console.log('프론트엔드 location.state:', location.state);
//   console.log('프론트엔드 analysisResult:', analysisResult);

//   return (
//     <div className={styles.resultContainer}>
//       <h1 className={styles.title}>식단 분석 결과</h1>
//       <div className={styles.content}>
//         {/* 섹션 1: 입력 및 추출 정보 */}
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>입력 정보</h2>
//           <div className={styles.card}>
//             <p className={styles.label}>입력하신 식단</p>
//             <p className={styles.value}>"{message || '데이터 없음'}"</p>
//             <p className={styles.label}>추출된 음식</p>
//             <p className={styles.value}>
//               {analysisResult?.food_list && analysisResult.food_list.length > 0
//                 ? analysisResult.food_list.join(', ')
//                 : '없음'}
//             </p>
//           </div>
//         </section>

//         {/* 섹션 2: 영양소 분석 */}
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>영양소 분석 (한 끼 기준)</h2>
//           <div className={styles.card}>
//             {analysisResult?.nutrition_per_food && analysisResult.nutrition_per_food.length > 0 ? (
//               <>
//                 {analysisResult.nutrition_per_food.map((item, index) => (
//                   <div key={index} className={styles.foodNutrition}>
//                     <h3 className={styles.foodTitle}>{item.food}</h3>
//                     <table className={styles.nutritionTable}>
//                       <thead>
//                         <tr>
//                           <th>단백질(g)</th>
//                           <th>탄수화물(g)</th>
//                           <th>수분(ml)</th>
//                           <th>당류(g)</th>
//                           <th>지방(g)</th>
//                           <th>식이섬유(g)</th>
//                           <th>나트륨(mg)</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td>{item.nutrition.protein ?? 0}</td>
//                           <td>{item.nutrition.carbohydrate ?? 0}</td>
//                           <td>{item.nutrition.water ?? 0}</td>
//                           <td>{item.nutrition.sugar ?? 0}</td>
//                           <td>{item.nutrition.fat ?? 0}</td>
//                           <td>{item.nutrition.fiber ?? 0}</td>
//                           <td>{item.nutrition.sodium ?? 0}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 ))}
//                 <h3 className={styles.foodTitle}>총합</h3>
//                 <table className={styles.nutritionTable}>
//                   <thead>
//                     <tr>
//                       <th>단백질(g)</th>
//                       <th>탄수화물(g)</th>
//                       <th>수분(ml)</th>
//                       <th>당류(g)</th>
//                       <th>지방(g)</th>
//                       <th>식이섬유(g)</th>
//                       <th>나트륨(mg)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>{analysisResult.total_nutrition?.protein ?? 0}</td>
//                       <td>{analysisResult.total_nutrition?.carbohydrate ?? 0}</td>
//                       <td>{analysisResult.total_nutrition?.water ?? 0}</td>
//                       <td>{analysisResult.total_nutrition?.sugar ?? 0}</td>
//                       <td>{analysisResult.total_nutrition?.fat ?? 0}</td>
//                       <td>{analysisResult.total_nutrition?.fiber ?? 0}</td>
//                       <td>{analysisResult.total_nutrition?.sodium ?? 0}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </>
//             ) : (
//               <p className={styles.placeholder}>영양소 데이터 없음</p>
//             )}
//           </div>
//         </section>

//         {/* 섹션 3: 부족한 영양소 및 제안 */}
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>영양 상태 및 제안</h2>
//           <div className={styles.card}>
//             <p className={styles.label}>부족한 영양소</p>
//             <p className={styles.value}>
//               {Array.isArray(analysisResult?.deficient_nutrients) && analysisResult.deficient_nutrients.length > 0
//                 ? analysisResult.deficient_nutrients.join(', ')
//                 : '없음'}
//             </p>
//             <p className={styles.label}>다음 식단 제안</p>
//             <p className={styles.value}>
//               {Array.isArray(analysisResult?.next_meal_suggestion) && analysisResult.next_meal_suggestion.length > 0
//                 ? analysisResult.next_meal_suggestion.join(', ')
//                 : '제안 없음'}
//             </p>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default DietAnalysisResultPage;