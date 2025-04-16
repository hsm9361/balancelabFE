import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/AnalysisPage.module.css';
import imageBubble from 'assets/images/imagebubble.png';
import chatBubble from 'assets/images/chatbubble.png';

const AnalysisPage = () => {
    const navigate = useNavigate();

    const handleImageAnalysisClick = () => {
        // TODO: Implement navigation or action for image analysis
        console.log('Navigate to Image Analysis');
        navigate('/analysis/image-analysis'); 
    };

    const handleDietAnalysisClick = () => {
        // TODO: Implement navigation or action for diet analysis
        console.log('Navigate to Diet Analysis');
        navigate('/analysis/diet-analysis'); 
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.cardContainer}>
                {/* Image Analysis Card */}
                <div className={styles.analysisCard}>
                    <img src={imageBubble} alt="Image Analysis" className={styles.cardIcon} />
                    <h2 className={styles.cardTitle}>이미지 분석</h2>
                    <p className={styles.cardDescription}>사진을 업로드하고 분석해보세요</p>
                    <button 
                        className={`${styles.cardButton} ${styles.imageButton}`} 
                        onClick={handleImageAnalysisClick}
                    >
                        이미지 분석 시작하기
                    </button>
                </div>

                {/* Diet Analysis Card */}
                <div className={styles.analysisCard}>
                    <img src={chatBubble} alt="Diet Analysis" className={styles.cardIcon} />
                    <h2 className={styles.cardTitle}>식단 분석</h2>
                    <p className={styles.cardDescription}>먹은 음식을 말해보세요. AI가 분석해드려요.</p>
                    <button 
                        className={`${styles.cardButton} ${styles.dietButton}`} 
                        onClick={handleDietAnalysisClick}
                    >
                        식단 입력하러 가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage; 