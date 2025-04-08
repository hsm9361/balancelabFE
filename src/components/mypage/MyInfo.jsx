import React from 'react';
import styles from '../../assets/css/pages/mypage/mypage.module.css';

function MyInfo() {
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>내정보</h2>
      <div className={styles.infoContainer}>
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            {/* 프로필 이미지 플레이스홀더 */}
            <div className={styles.imagePlaceholder}>
              <span>프로필</span>
            </div>
          </div>
          <button className={styles.editButton}>프로필 수정</button>
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
        </div>
      </div>
    </div>
  );
}

export default MyInfo;