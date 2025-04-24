import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from '../assets/css/layouts/Header.module.css';
import useAuth from '../hooks/useAuth';
import AuthModal from '../components/auth/AuthModal';
import RequiredInfoModal from '../components/auth/RequiredInfoModal';
import logo from 'assets/images/logo.svg';
import { toast } from 'react-toastify';

const Header = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRequiredInfoModal, setShowRequiredInfoModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('required');
  const { user, handleLogout, isAuthenticated, updateAuthState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const loginWindowRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // 경로가 변경될 때마다 실행

  const handleGoogleLogin = useCallback(() => {
    try {
      if (loginWindowRef.current) {
        loginWindowRef.current.close();
      }
      loginWindowRef.current = null;

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

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
        toast.error('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
      }
    } catch (error) {
      console.error('Failed to open login window:', error);
      toast.error('로그인 창을 열 수 없습니다. 다시 시도해주세요.');
      loginWindowRef.current = null;
    }
  }, []);

  // 로그인 버튼 클릭 시 바로 Google 로그인 호출
  const handleLoginClick = useCallback(() => {
    handleGoogleLogin();
  }, [handleGoogleLogin]);

  const handleLogoutClick = useCallback(() => {
    handleLogout();
    setIsOpen(false);
    navigate('/');
  }, [handleLogout, navigate]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleAuthData = useCallback(
    async (authData) => {
      try {
        const { username, email, accessToken, refreshToken, hasRequiredInfo } = authData;
        const authState = {
          user: {
            username: username || email,
            email,
            hasRequiredInfo: hasRequiredInfo || 'N',
          },
          accessToken,
          refreshToken,
          status: 'authenticated',
        };

        localStorage.setItem('auth-storage', JSON.stringify({ state: authState }));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        updateAuthState(authState);
        window.dispatchEvent(new CustomEvent('auth-update', { detail: authState }));

        return authState;
      } catch (error) {
        console.error('Error handling auth data:', error);
        toast.error('인증 데이터를 처리하는 중 오류가 발생했습니다.');
        return null;
      }
    },
    [updateAuthState]
  );

  const handleLoginMessage = useCallback(
    async (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, error, ...authData } = event.data;
      if (type !== 'LOGIN_SUCCESS') {
        return;
      }

      try {
        setIsOpen(false);
        setShowAuthModal(false);
        const authState = await handleAuthData(authData);

        if (authState) {
          const redirectTo = location.state?.from || '/';
          if (authState.user.hasRequiredInfo === 'N') {
            setShowRequiredInfoModal(true);
          } else {
            navigate(redirectTo, { replace: true });
          }
        }
      } catch (err) {
        console.error('Failed to process login:', err);
        toast.error('로그인 처리에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [handleAuthData, navigate, location.state]
  );

  const handleProtectedRouteClick = useCallback(
    (e, to) => {
      if (!isAuthenticated) {
        e.preventDefault();
        setShowAuthModal(true);
        navigate(location.pathname, { state: { from: to } });
      } else {
        closeMenu();
      }
    },
    [isAuthenticated, navigate, location.pathname, closeMenu]
  );

  useEffect(() => {
    window.addEventListener('message', handleLoginMessage);
    return () => {
      window.removeEventListener('message', handleLoginMessage);
    };
  }, [handleLoginMessage]);

  useEffect(() => {
    return () => {
      if (loginWindowRef.current) {
        loginWindowRef.current.close();
      }
    };
  }, []);

  const handleRequiredInfoModalClose = useCallback(() => {
    setShowRequiredInfoModal(false);
    const redirectTo = location.state?.from || '/';
    navigate(redirectTo, { replace: true });
  }, [navigate, location.state]);

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
            <Link
              to="/healthprediction"
              className={styles.navLink}
              onClick={(e) => handleProtectedRouteClick(e, '/healthprediction')}
            >
              건강예측
            </Link>
            <Link
              to="/diet-consulting"
              className={styles.navLink}
              onClick={(e) => handleProtectedRouteClick(e, '/diet-consulting')}
            >
              식단추천
            </Link>
            <Link
              to="/analysis"
              className={styles.navLink}
              onClick={(e) => handleProtectedRouteClick(e, '/analysis')}
            >
              식단분석
            </Link>
            <Link
              to="/calendar"
              className={styles.navLink}
              onClick={(e) => handleProtectedRouteClick(e, '/calendar')}
            >
              캘린더
            </Link>
            {isAuthenticated && (
              <Link
                to="/mypage"
                className={styles.navLink}
                onClick={(e) => handleProtectedRouteClick(e, '/mypage')}
              >
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
        onGoogleLogin={handleGoogleLogin}
      />
      <RequiredInfoModal
        isOpen={showRequiredInfoModal}
        onClose={handleRequiredInfoModalClose}
      />
    </>
  );
});

Header.displayName = 'Header';

export default Header;