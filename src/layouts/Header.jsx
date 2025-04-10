// src/layouts/Header.jsx
import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from '../assets/css/layouts/Header.module.css';
import useAuth from '../hooks/useAuth';
import AuthModal from '../components/auth/AuthModal';
import logo from 'assets/images/logo.svg'; // logo.svg 파일 경로에 맞게 수정

const Header = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('required');
  const { user, handleLogout, isAuthenticated, updateAuthState } = useAuth();
  const navigate = useNavigate();
  const loginWindowRef = useRef(null);

  const handleGoogleLogin = useCallback(() => {
    // 이미 열린 창이 있다면 닫기
    if (loginWindowRef.current) {
      loginWindowRef.current.close();
    }

    // 팝업 창 크기와 위치 계산
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // 구글 로그인 URL에 redirect_uri 추가
    const redirectUri = encodeURIComponent('http://localhost:3000/oauth/callback');
    const googleAuthUrl = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${redirectUri}`;
    
    loginWindowRef.current = window.open(
      googleAuthUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (loginWindowRef.current) {
      loginWindowRef.current.focus();
    } else {
      console.error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  }, []);

  const handleLoginClick = useCallback(() => {
    handleGoogleLogin();
  }, [handleGoogleLogin]);

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

  // 사용자 정보 저장 및 설정
  const handleAuthData = async (authData) => {
    try {
      const { username, email, accessToken, refreshToken } = authData;
      
      const authState = {
        user: {
          username: username || email,
          email,
        },
        accessToken,
        refreshToken,
        status: 'authenticated'
      };

      // 로컬 스토리지에 인증 정보 저장
      localStorage.setItem('auth-storage', JSON.stringify({ state: authState }));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 전역 인증 상태 업데이트
      updateAuthState(authState);

      // CustomEvent를 발생시켜 현재 창의 상태 업데이트 트리거
      window.dispatchEvent(new CustomEvent('auth-update', { detail: authState }));

      return authState;
    } catch (error) {
      console.error('Error handling auth data:', error);
      return null;
    }
  };

  // 로그인 메시지 처리
  const handleLoginMessage = useCallback(async (event) => {
    // 출처 검증
    if (event.origin !== window.location.origin) {
      return;
    }

    const { type, error, ...authData } = event.data;

    if (type === 'LOGIN_SUCCESS') {
      try {
        const authState = await handleAuthData(authData);
        if (authState) {
          // 팝업 창 닫기
          if (loginWindowRef.current) {
            loginWindowRef.current.close();
            loginWindowRef.current = null;
          }
          // 햄버거 메뉴 닫기
          setIsOpen(false);
        }
      } catch (err) {
        console.error('Failed to process login:', err);
      }
    } else if (type === 'LOGIN_ERROR') {
      console.error('Login error:', error);
      if (loginWindowRef.current) {
        loginWindowRef.current.close();
        loginWindowRef.current = null;
      }
    }
  }, [updateAuthState]);

  // 메시지 이벤트 리스너 설정
  useEffect(() => {
    window.addEventListener('message', handleLoginMessage);
    return () => {
      window.removeEventListener('message', handleLoginMessage);
    };
  }, [handleLoginMessage]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (loginWindowRef.current) {
        loginWindowRef.current.close();
      }
    };
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="Balance Lab Logo" className={styles.logoImage} />
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
            <Link to="/healthprediction" className={styles.navLink} onClick={closeMenu}>
            건강예측
            </Link>
            <Link to="/analysis" className={styles.navLink} onClick={closeMenu}>
              이미지분석
            </Link>
            <Link to="/diet" className={styles.navLink} onClick={closeMenu}>
              식단
            </Link>
            <Link to="/diet-analysis" className={styles.navLink} onClick={closeMenu}
            >식단분석
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
              <button className={styles.authButton} onClick={handleLogoutClick}>
                로그아웃
              </button>
            ) : (
              <button className={styles.authButton} onClick={handleLoginClick}>
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