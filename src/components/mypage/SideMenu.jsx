import React, { useState } from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';

function SideMenu({ activeTab, setActiveTab }) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleItemClick = (id) => {
    if (id === 'calendar') {
      setCalendarOpen(prev => !prev);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className={styles.sideMenu}>
      <ul className={styles.menuList}>
        <li
          className={`${styles.menuItem} ${activeTab === 'myInfo' ? styles.active : ''}`}
          onClick={() => handleItemClick('myInfo')}
        >
          <span className={styles.menuIcon}>👤</span> 내정보
        </li>

        <li
          className={`${styles.menuItem} ${activeTab === 'calendar' ? styles.active : ''}`}
          onClick={() => handleItemClick('calendar')}
        >
          <span className={styles.menuIcon}>📅</span> 식단표
        </li>

        <ul className={`${styles.subMenu} ${calendarOpen ? styles.open : ''}`}>
  <li
    className={styles.subMenuItem}
    onClick={() => setActiveTab('calendar-week')}
  >
     주간 식단표
  </li>
  <li
    className={styles.subMenuItem}
    onClick={() => setActiveTab('calendar-month')}
  >
     월간 식단표
  </li>
</ul>


        <li
          className={`${styles.menuItem} ${activeTab === 'myBalance' ? styles.active : ''}`}
          onClick={() => handleItemClick('myBalance')}
        >
          <span className={styles.menuIcon}>📊</span> MyBalance
        </li>
      </ul>
    </div>
  );
}

export default SideMenu;
