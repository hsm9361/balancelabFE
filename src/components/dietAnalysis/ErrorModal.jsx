import React from 'react';
import styles from '../../assets/css/components/ErrorModal.module.css';

const WarningIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 7V13M12 15V17M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22Z" 
      stroke="#FF6B6B" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

function ErrorModal({ message, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="닫기">×</button>
        <div className={styles.modalHeader}>
          <WarningIcon />
          <h2>알림</h2>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.confirmButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal; 