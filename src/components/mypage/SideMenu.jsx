import React from 'react';
import styles from '../../assets/css/pages/mypage/mypage.module.css';

function SideMenu({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'myInfo', name: '내정보' },
    { id: 'calendar', name: '캘린더' },
    { id: 'myBalance', name: 'MyBalance' }
  ];

  return (
    <div className={styles.sideMenu}>
      <ul className={styles.menuList}>
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`${styles.menuItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideMenu;