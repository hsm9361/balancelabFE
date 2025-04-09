import React, { useState } from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import SideMenu from 'components/mypage/SideMenu';
import MyInfo from 'components/mypage/MyInfo';
import MyCalendar from 'components/mypage/MyCalendar';
import MyBalance from 'components/mypage/MyBalance';

function MyPage() {
  const [activeTab, setActiveTab] = useState('myInfo');

  const renderContent = () => {
    switch (activeTab) {
      case 'myInfo':
        return <MyInfo />;
      case 'calendar':
        return <MyCalendar />;
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
        </div>
      </div>
    </div>
  );
}

export default MyPage;