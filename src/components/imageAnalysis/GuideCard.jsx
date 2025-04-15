import React from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function GuideCard() {
  return (
    <div className={styles.guideCard}>
      <h3 className={styles.guideTitle}>최적의 분석을 위한 팁</h3>
      <ul className={styles.guideList}>
        <li>음식 전체가 보이도록 밝은 조명에서 촬영하세요.</li>
        <li>접시나 배경이 단순한 사진이 더 정확합니다.</li>
        <li>여러 음식이 있다면 하나씩 업로드해 보세요.</li>
      </ul>
    </div>
  );
}

export default GuideCard;