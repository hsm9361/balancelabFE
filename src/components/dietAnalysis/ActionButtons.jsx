import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSaveAsPDF from '../../hooks/useSaveAsPDF';
import styles from '../../assets/css/components/ActionButtons.module.css';

const ActionButtons = ({ additionalButton }) => {
  const navigate = useNavigate();
  const { saveAsPDF, isSaving } = useSaveAsPDF();

  const handleBack = () => {
    console.log('Back button clicked'); // 디버깅
    navigate(-1);
  };

  const handleSavePDF = () => {
    console.log('Save PDF button clicked'); // 디버깅
    try {
      saveAsPDF();
    } catch (error) {
      console.error('Error triggering saveAsPDF:', error);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <button
        type="button"
        className={styles.backButton}
        onClick={handleBack}
        disabled={isSaving}
      >
        뒤로 가기
      </button>
      <button
        type="button"
        className={styles.saveButton}
        onClick={handleSavePDF}
        disabled={isSaving}
      >
        {isSaving ? '저장 중...' : 'PDF로 저장'}
      </button>
      {additionalButton}
    </div>
  );
};

export default ActionButtons;