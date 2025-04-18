import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from '../../assets/css/pages/ImageAnalysisResultPage.module.css';
import FoodList from '../../components/dietAnalysis/FoodList';
import NutritionPerFood from '../../components/dietAnalysis/NutritionPerFood';
import TotalNutrition from '../../components/dietAnalysis/TotalNutrition';
import DeficientNutrients from '../../components/dietAnalysis/DeficientNutrients';
import NextMealSuggestion from '../../components/dietAnalysis/NextMealSuggestion';
import ResultImage from '../../components/imageAnalysis/ResultImage';
import AddDietModal from '../../components/calendar/AddMealModal';
import { FaRedoAlt, FaFilePdf, FaUtensils } from 'react-icons/fa';

// Custom hook for PDF export
const useExportPDF = () => {
  const exportToPDF = useCallback(async (elementId, fileName) => {
    try {
      const content = document.getElementById(elementId);
      if (!content) throw new Error('Content element not found');
      const canvas = await html2canvas(content, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  }, []);

  return { exportToPDF };
};

const ImageAnalysisResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const { exportToPDF } = useExportPDF();

  // Process analysis result from location state
  const processAnalysisResult = useCallback((state) => {
    if (!state?.analysisResult) {
      throw new Error('No analysis result provided');
    }
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
      console.log('Location state:', location.state);
      const resultData = processAnalysisResult(location.state);
      console.log('Mapped result data:', resultData);
      setResult(resultData);
    } catch (err) {
      console.warn('Failed to process analysis result:', err.message);
      setError(err.message);
      navigate(-1, { replace: true });
    }
  }, [location.state, navigate, processAnalysisResult]);

  const handleReanalyze = () => {
    navigate('/analysis/image-analysis');
  };

  const handleSavePDF = () => {
    exportToPDF('image-analysis-content', 'image-analysis-result.pdf');
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
    // TODO: Implement API call to save meal
  };

  const getSelectedTime = () => {
    return location.state?.selectedTime || '점심';
  };

  // Button configurations
  const actionButtons = [
    {
      key: 'reanalyze',
      icon: <FaRedoAlt style={{ marginRight: '8px' }} />,
      label: '새로운 식단 분석',
      onClick: handleReanalyze,
    },
    {
      key: 'savePDF',
      icon: <FaFilePdf style={{ marginRight: '8px' }} />,
      label: 'PDF로 저장',
      onClick: handleSavePDF,
    },
    {
      key: 'addMeal',
      icon: <FaUtensils style={{ marginRight: '8px' }} />,
      label: '식단 추가하기',
      onClick: handleOpenModal,
    },
  ];

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
    return (
      <div className={styles.resultContainer}>
        <div className={styles.content}>분석 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.resultContainer}>
      <h1 className={styles.title}>당신의 식단 분석</h1>
      <div id="image-analysis-content" className={`${styles.content} pdf-capture`}>
        <ResultImage imageUrl={result.image_url} />
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
        {actionButtons.map(button => (
          <button
            key={button.key}
            className={styles.actionButton}
            onClick={button.onClick}
          >
            {button.icon}
            {button.label}
          </button>
        ))}
      </div>
      {isModalOpen && (
        <AddDietModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitMeal}
          selectedDate={new Date()}
          initialFoodList={result.food_list || []}
          selectedTime={getSelectedTime()}
        />
      )}
    </div>
  );
};

export default ImageAnalysisResultPage;