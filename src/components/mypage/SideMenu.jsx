import React, { useState, useRef, useEffect } from 'react';
import styles from 'assets/css/pages/mypage/mypage.module.css';
import { FaCircleUser } from 'react-icons/fa6';
import { FaCalendarAlt } from 'react-icons/fa';
import { HiDocumentReport, HiDocumentAdd } from 'react-icons/hi';

function SideMenu({ activeTab, setActiveTab }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const subMenuRef = useRef(null);

  const menuItems = [
    { id: 'myInfo', name: '내정보', icon: <FaCircleUser /> },
    { id: 'myBalance', name: 'MyBalance', icon: <HiDocumentReport /> },
    { id: 'challenge', name: 'Challenge', icon: <HiDocumentAdd /> },
  ];

  useEffect(() => {
    if (subMenuRef.current) {
      if (calendarOpen) {
        subMenuRef.current.style.maxHeight = `${subMenuRef.current.scrollHeight}px`;
      } else {
        subMenuRef.current.style.maxHeight = '0';
      }
    }
  }, [calendarOpen]);

  const handleItemClick = (id) => {
    if (id === 'calendar') {
      setCalendarOpen((prev) => !prev);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className={styles.sideMenu}>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li key={item.id}>
            <div
              className={`${styles.menuItem} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className={styles.menuIcon}>{item.icon}</span> {item.name}
            </div>
            {item.subMenu && item.id === 'calendar' && (
              <ul
                ref={subMenuRef}
                className={`${styles.subMenu} ${calendarOpen ? styles.open : ''}`}
              >
                {item.subMenu.map((subItem) => (
                  <li
                    key={subItem.id}
                    className={styles.subMenuItem}
                    onClick={() => setActiveTab(subItem.id)}
                  >
                    {subItem.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideMenu;