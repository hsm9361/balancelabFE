// src/layouts/Header.jsx
import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from '../assets/css/layouts/Header.module.css';
import useAuth from '../hooks/useAuth';
import AuthModal from '../components/auth/AuthModal';

const Header = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('required');
  const { user, handleLogout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = useCallback(() => {
    setAuthModalType('required');
    setShowAuthModal(true);
    setIsOpen(false);
  }, []);

  const handleLogoutClick = useCallback(() => {
    handleLogout();
    setIsOpen(false);
    navigate('/');
  }, [handleLogout, navigate]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            Balance Lab
          </Link>
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="메뉴 열기/닫기"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className={`${styles.navMenu} ${isOpen ? styles.open : ''}`}>
            <Link to="/analysis" className={styles.navLink} onClick={closeMenu}>
              이미지분석
            </Link>
            <Link to="/diet" className={styles.navLink} onClick={closeMenu}>
              식단
            </Link>
            <Link to="/calendar" className={styles.navLink} onClick={closeMenu}>
              캘린더
            </Link>
            {isAuthenticated && (
              <Link to="/mypage" className={styles.navLink} onClick={closeMenu}>
                마이페이지
              </Link>
            )}
            {isAuthenticated ? (
              <button className={styles.navLink} onClick={handleLogoutClick}>
                로그아웃
              </button>
            ) : (
              <button className={styles.navLink} onClick={handleLoginClick}>
                로그인
              </button>
            )}
          </nav>
        </div>
      </header>
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        type={authModalType}
      />
    </>
  );
});

Header.displayName = 'Header';

export default Header;