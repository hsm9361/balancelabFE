import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisResultPage.module.css';

function ResultImage({ imageUrl }) {
  return (
    <section className={styles.imageSection}>
      <h2 className={styles.sectionTitle}>분석된 식단</h2>
      {imageUrl ? (
        <img src={imageUrl} alt="Analyzed Meal" className={styles.resultImage} />
      ) : (
        <p className={styles.placeholder}>이미지가 없습니다.</p>
      )}
    </section>
  );
}

export default ResultImage;