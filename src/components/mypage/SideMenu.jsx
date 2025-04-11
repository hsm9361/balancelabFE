import React, { useState } from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';

import { FaCircleUser } from 'react-icons/fa6';
import { FaCalendarAlt } from 'react-icons/fa';
import { HiDocumentReport } from 'react-icons/hi';

function SideMenu({ activeTab, setActiveTab }) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const menuItems = [
    { id: 'myInfo', name: '내정보', icon: <FaCircleUser /> },
    { id: 'calendar', name: '식단표', icon: <FaCalendarAlt /> },
    { id: 'myBalance', name: 'MyBalance', icon: <HiDocumentReport /> }
  ];

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
        {menuItems.map(item => (
          <li
            key={item.id}
            className={`${styles.menuItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => handleItemClick(item.id)}
          >
            <span className={styles.menuIcon}>{item.icon}</span> {item.name}
          </li>
        ))}

        {/* 캘린더 하위 메뉴 */}
        {calendarOpen && (
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
        )}
      </ul>
    </div>
  );
}

export default SideMenu;
