// Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // 아이콘 사용 (lucide-react 권장)
import styles from '../assets/css/layouts/Header.module.css';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          Balance Lab
        </Link>
        
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="메뉴 열기"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${styles.navMenu} ${isOpen ? styles.open : ''}`}>
          <Link to="/healthprediction" className={styles.navLink} onClick={() => setIsOpen(false)}>건강예측</Link>
          <Link to="/analysis" className={styles.navLink} onClick={() => setIsOpen(false)}>이미지분석</Link>
          <Link to="/diet" className={styles.navLink} onClick={() => setIsOpen(false)}>식단</Link>
          <Link to="/calendar" className={styles.navLink} onClick={() => setIsOpen(false)}>캘린더</Link>
          <Link to="/mypage" className={styles.navLink} onClick={() => setIsOpen(false)}>마이페이지</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
