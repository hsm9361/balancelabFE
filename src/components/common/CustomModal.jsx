import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../assets/css/common/CustomModal.module.css';

const CustomModal = ({ isOpen, onClose, title, message, onConfirm }) => {
  const modalRef = useRef(null);
  const scrollYRef = useRef(0);

  // 스크롤 고정 및 포커스 관리
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      modalRef.current?.querySelector('button')?.focus();
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} data-testid="modal-overlay">
      <div className={styles.modalContent} ref={modalRef} role="dialog" aria-labelledby="modal-title">
        <h2 id="modal-title" className={styles.modalTitle}>{title || '오류'}</h2>
        <p className={styles.modalMessage}>{message || '오류가 발생했습니다. 다시 시도해주세요.'}</p>
        <div className={styles.buttonContainer}>
          {onConfirm ? (
            <>
              <button
                className={styles.cancelButton}
                onClick={onClose}
                data-testid="cancel-button"
                aria-label="모달 닫기"
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                data-testid="confirm-button"
                aria-label="확인"
              >
                확인
              </button>
            </>
          ) : (
            <button
              className={styles.confirmButton}
              onClick={onClose}
              data-testid="confirm-button"
              aria-label="확인"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // 모달을 body 최상위에 렌더링
  return ReactDOM.createPortal(modalContent, document.body);
};

export default CustomModal;