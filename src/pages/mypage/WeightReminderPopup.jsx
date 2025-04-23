import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/pages/mypage/weightReminderPopup.css';

function WeightReminderPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkReminder = () => {
      const lastReminder = localStorage.getItem('lastWeightReminder');
      const now = new Date().getTime();
      const oneMinute = 60 * 1000; // 1분 (밀리초)

      if (!lastReminder || now - parseInt(lastReminder) >= oneMinute) {
        setShowPopup(true);
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 10 * 1000); // 10초마다 체크
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('lastWeightReminder', new Date().getTime().toString());
    setShowPopup(false);
    navigate('/mypage?tab=myInfo');
  };

  if (!showPopup) return null;

  return (
    <div className="popup">
      <h2 className="popup-title">몸무게 등록 알림</h2>
      <p className="popup-message">1분이 지났습니다! 몸무게를 등록하러 가시겠습니까?</p>
      <div className="popup-buttons">
        <button className="popup-button" onClick={handleConfirm}>
          등록하러 가기
        </button>
        <button className="popup-button cancel" onClick={() => setShowPopup(false)}>
          취소
        </button>
      </div>
    </div>
  );
}

export default WeightReminderPopup;

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../../assets/css/pages/mypage/weightReminderPopup.css';

// function WeightReminderPopup() {
//   const [showPopup, setShowPopup] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkReminder = () => {
//       const lastReminder = localStorage.getItem('lastWeightReminder');
//       const now = new Date().getTime();
//       const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7일 (밀리초)

//       if (!lastReminder || now - parseInt(lastReminder) >= oneWeek) {
//         setShowPopup(true);
//       }
//     };

//     checkReminder();
//     const interval = setInterval(checkReminder, 24 * 60 * 60 * 1000); // 하루마다 체크
//     return () => clearInterval(interval);
//   }, []);

//   const handlePopupClick = () => {
//     localStorage.setItem('lastWeightReminder', new Date().getTime().toString());
//     setShowPopup(false);
//     navigate('/mypage');
//   };

//   if (!showPopup) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <h2 className="modal-title">몸무게 등록 알림</h2>
//         <p className="modal-message">7일이 지났습니다! 몸무게를 등록하러 가시겠습니까?</p>
//         <button className="modal-button" onClick={handlePopupClick}>
//           등록하러 가기
//         </button>
//       </div>
//     </div>
//   );
// }

// export default WeightReminderPopup;