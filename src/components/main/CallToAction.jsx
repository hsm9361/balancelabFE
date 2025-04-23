import React from 'react';
import styles from 'assets/css/pages/Home.module.css';
import plane from 'assets/images/plane.png';
import footprint from 'assets/images/compass.png';

const CallToAction = ({ navigate }) => {
    return (
        <div className={styles.textContainer}>
            <h1 className={styles.title}>
                당신만의 건강 여정을<br/> 시작해보세요!
                <img src={footprint} alt="footprint" className="foot-icon" />
            </h1>
            <p className={styles.description}>
                매일 식단을 등록하면, AI가 영양소를 분석하고<br/> 건강의 나침반이 되어줄 거예요.<br/>  
                지금, 더 나은 나를 향한 탐험을 시작해볼까요?
            </p>
            <button
                className={styles.analyzeButton}
                onClick={() => navigate('/analysis')}
            >
            
                건강 여정 떠나기 
                <img src={plane} alt="plane" className="plane-icon" />
            </button>
        </div>
    );
};

export default CallToAction;