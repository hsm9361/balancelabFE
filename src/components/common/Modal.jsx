import React from 'react';
import styles from '../../assets/css/components/Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, buttons }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.modalBody}>{children}</div>
        {buttons && <div className={styles.modalButtons}>{buttons}</div>}
      </div>
    </div>
  );
};

export default Modal; 