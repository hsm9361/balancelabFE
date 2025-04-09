import React from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';

function SideMenu({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'myInfo', name: '내정보', icon: '👤' },
    { id: 'calendar', name: '캘린더', icon: '📅' },
    { id: 'myBalance', name: 'MyBalance', icon: '📊' }
  ];

  return (
    <div className={styles.sideMenu}>
      <ul className={styles.menuList}>
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`${styles.menuItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-label={`${item.name} 탭으로 이동`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveTab(item.id);
              }
            }}
          >
            <span className={styles.menuIcon}>{item.icon}</span> {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideMenu;