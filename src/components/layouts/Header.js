import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 모바일 메뉴 열기/닫기
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // 모바일 메뉴가 열렸을 때 스크롤 방지
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  // 모바일 메뉴 닫기
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="currentColor" 
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" 
            />
          </svg>
          Balance Lab
        </Link>
        
        <nav className={styles.navMenu}>
          <NavLink to="/" className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>
            홈
          </NavLink>
          <NavLink to="/analysis" className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>
            식단분석
          </NavLink>
          <NavLink to="/diet" className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>
            식단관리
          </NavLink>
          <NavLink to="/calendar" className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>
            캘린더
          </NavLink>
          <NavLink to="/mypage" className={({isActive}) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>
            마이페이지
          </NavLink>
        </nav>
        
        <div className={styles.authButtons}>
          <Link to="/login" className={styles.loginButton}>
            로그인
          </Link>
          <Link to="/signup" className={styles.signupButton}>
            회원가입
          </Link>
        </div>
        
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>
      
      {/* 모바일 메뉴 */}
      <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={closeMobileMenu}></div>
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={closeMobileMenu}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        
        <nav className={styles.mobileNavMenu}>
          <Link to="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            홈
          </Link>
          <Link to="/analysis" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            식단분석
          </Link>
          <Link to="/diet" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            식단관리
          </Link>
          <Link to="/calendar" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            캘린더
          </Link>
          <Link to="/mypage" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            마이페이지
          </Link>
        </nav>
        
        <div className={styles.mobileAuthButtons}>
          <Link to="/login" className={styles.mobileLoginButton} onClick={closeMobileMenu}>
            로그인
          </Link>
          <Link to="/signup" className={styles.mobileSignupButton} onClick={closeMobileMenu}>
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;