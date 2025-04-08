import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/layouts/Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          Balance Lab
        </Link>
        <nav className={styles.navMenu}>
          <Link to="/analysis" className={styles.navLink}>이미지분석</Link>
          <Link to="/diet" className={styles.navLink}>식단</Link>
          <Link to="/calendar" className={styles.navLink}>캘린더</Link>
          <Link to="/mypage" className={styles.navLink}>마이페이지</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header; 