import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import styles from '../../assets/css/components/Modal.module.css';

const RequiredInfoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();
    navigate('/mypage', { state: { activeTab: 'info' } });
  };

  const handleCancel = () => {
    onClose();
    navigate('/');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="신체 정보 입력 필요"
      buttons={
        <>
          <button className={styles.primaryButton} onClick={handleConfirm}>
            확인
          </button>
          <button className={styles.secondaryButton} onClick={handleCancel}>
            취소
          </button>
        </>
      }
    >
      <p>신체 정보가 없어서 마이페이지로 이동할까요?</p>
      <p>확인을 누르시면 마이페이지의 내정보 입력 화면으로 이동합니다.</p>
      <p>취소를 누르시면 메인페이지로 이동합니다.</p>
    </Modal>
  );
};

export default RequiredInfoModal; 