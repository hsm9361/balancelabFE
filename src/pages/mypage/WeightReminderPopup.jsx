import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/pages/mypage/weightReminderPopup.css';
import useAuth from '../../hooks/useAuth';

function WeightReminderPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping popup');
      return;
    }

    const checkReminder = () => {
      const lastReminderDate = localStorage.getItem('lastWeightReminderDate');
      const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)

      console.log('Checking:', {
        lastReminderDate,
        today,
        showPopup,
        isAuthenticated,
      });

      if (!lastReminderDate || lastReminderDate !== today) {
        console.log('Triggering popup');
        setShowPopup(true);
      }
    };

    checkReminder(); // 페이지 로드 시 단일 호출
  }, [isAuthenticated]);

  const handleConfirm = () => {
    console.log('Confirm clicked');
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastWeightReminderDate', today);
    setShowPopup(false);
    navigate('/mypage');
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastWeightReminderDate', today);
    setShowPopup(false);
  };

  if (!showPopup || !isAuthenticated) return null;

  return (
    <div className="popup">
      <h2 className="popup-title">몸무게 등록 알림</h2>
      <p className="popup-message">오늘 몸무게를 등록하시겠습니까?</p>
      <div className="popup-buttons">
        <button className="popup-button" onClick={handleConfirm}>
          등록하러 가기
        </button>
        <button className="popup-button cancel" onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
}

export default WeightReminderPopup;