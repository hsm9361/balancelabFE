import React from 'react';
import styles from '../../assets/css/common/CustomModal.module.css';

const CustomModal = ({ isOpen, onClose, title, message, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} data-testid="modal-overlay">
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{title || '오류'}</h2>
        <p className={styles.modalMessage}>{message || '오류가 발생했습니다. 다시 시도해주세요.'}</p>
        <div className={styles.buttonContainer}>
          {onConfirm ? (
            <>
              <button
                className={styles.cancelButton}
                onClick={onClose}
                data-testid="cancel-button"
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  onConfirm();
                  onClose(); // 확인 후 모달 닫기
                }}
                data-testid="confirm-button"
              >
                확인
              </button>
            </>
          ) : (
            <button
              className={styles.confirmButton}
              onClick={onClose}
              data-testid="confirm-button"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;