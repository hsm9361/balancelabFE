import React from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';

function MyInfo() {
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>내정보</h2>
      <div className={styles.infoContainer}>
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            <div className={styles.imagePlaceholder}>
              <span>프로필</span>
            </div>
          </div>
          <button className={styles.editButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            프로필 수정
          </button>
        </div>
        
        <div className={styles.userInfoSection}>
          <div className={styles.infoItem}>
            <span className={styles.label}>이름</span>
            <span className={styles.value}>홍길동</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>이메일</span>
            <span className={styles.value}>user@example.com</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>가입일</span>
            <span className={styles.value}>2025년 4월 8일</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>키</span>
            <span className={styles.value}>175cm</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>몸무게</span>
            <span className={styles.value}>70kg</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>목표</span>
            <span className={styles.value}>균형 잡힌 영양 섭취</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;