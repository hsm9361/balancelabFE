import React, { useState } from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import SideMenu from 'components/mypage/SideMenu';
import MyInfo from 'components/mypage/MyInfo';
import WeekCalendar from 'components/mypage/WeekCalendar';
import MyBalance from 'components/mypage/MyBalance';
import CalendarActionButtons from 'components/calendar/CalendarActionButtons';
import AddMealModal from 'components/calendar/AddMealModal'; // ✅ 모달 컴포넌트 import
import MonthCalendar from 'components/mypage/MonthCalendar';

function MyPage() {
  const [activeTab, setActiveTab] = useState('myInfo');
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태 추가

  const renderContent = () => {
    switch (activeTab) {
      case 'myInfo':
        return <MyInfo />;
      case 'calendar-week':
        return <WeekCalendar />;
      case 'calendar-month':
        return <MonthCalendar />;
      case 'myBalance':
        return <MyBalance />;
      default:
        return <MyInfo />;
    }
  };
  

  return (
    <div className={styles.myPageContainer}>
      <h1 className={styles.pageTitle}>마이페이지</h1>
      <div className={styles.contentWrapper}>
        <SideMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className={styles.contentArea}>
          {renderContent()}
          {activeTab === 'calendar' && (
  <CalendarActionButtons onAddClick={() => setShowModal(true)} />
)}
        </div>
      </div>

      {/* ✅ 모달은 항상 최상단에서 렌더링되도록! */}
      {showModal && (
        <AddMealModal
          onClose={() => setShowModal(false)}
          onSubmit={(type, menu) => {
            console.log('기록 추가됨:', type, menu);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default MyPage;
