import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/css/pages/Home.module.css';
import foodPlateImage from '../assets/images/food-plate.jpg';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.flexContainer}>
          <div className={styles.imageContainer}>
            <img 
              src={foodPlateImage}
              alt="건강한 식단" 
              className={styles.mainImage}
            />
          </div>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>너의 식단은?</h1>
            <p className={styles.description}>
              당신만의 맞춤 식단을 분석하고<br />
              건강한 라이프스타일을 시작하세요.
            </p>
            <button 
              className={styles.analyzeButton}
              onClick={() => navigate('/analysis')}
            >
              식단 분석하러 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 