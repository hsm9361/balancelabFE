import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisResultPage.module.css';

function ResultImage({ imageUrl }) {
  return (
    <section className={styles.imageSection}>
      <h2 className={styles.sectionTitle}>분석된 식단</h2>
      {imageUrl ? (
        <div>
          <img src={imageUrl} alt="Analyzed Meal" className={styles.resultImage} />
          <p className={styles.imageCaption}>분석된 식단의 이미지입니다. 아래에서 세부 정보를 확인하세요.</p>
        </div>
      ) : (
        <p className={styles.placeholder}>이미지가 없습니다.</p>
      )}
    </section>
  );
}

export default ResultImage;