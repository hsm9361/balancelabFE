import React, { useState } from 'react';
import styles from 'assets/css/pages/ImageAnalysisResultPage.module.css';

function AdditionalInfo({ nutritionData }) {
  const [expanded, setExpanded] = useState({});

  const getHealthTip = (foodName) => {
    const tips = {
      'Grilled Chicken': '단백질이 풍부해 근육 회복에 좋습니다.',
      'Steamed Broccoli': '비타민 K와 섬유질이 많아 소화와 뼈 건강에 도움됩니다.',
      'Brown Rice': '통곡물로 혈당 조절에 유익합니다.',
    };
    return tips[foodName] || '균형 잡힌 식단을 유지하세요.';
  };

  const toggleExpand = (index) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>건강 팁</h2>
      {Array.isArray(nutritionData) && nutritionData.length > 0 ? (
        <ul className={styles.infoList}>
          {nutritionData.map((item, index) => (
            <li key={index} className={styles.infoItem}>
              <button
                className={styles.infoButton}
                onClick={() => toggleExpand(index)}
              >
                {item.name} {expanded[index] ? '▲' : '▼'}
              </button>
              {expanded[index] && (
                <p className={styles.infoText}>{getHealthTip(item.name)}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.placeholder}>추가 정보가 없습니다.</p>
      )}
    </section>
  );
}

export default AdditionalInfo;